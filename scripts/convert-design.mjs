#!/usr/bin/env node
/**
 * Converte o template do Claude Design (`*.dc.html`) em componentes React/TSX.
 *
 * Uso:  node scripts/convert-design.mjs "<arquivo.dc.html>" <pasta-destino>
 *
 * Suporta a sintaxe usada pelo design:
 *   {{ caminho.da.var }}           -> interpolação
 *   <sc-if value="{{ x }}">        -> renderização condicional
 *   <sc-for list="{{ xs }}" as="i"> -> lista
 *   style="a:b; c:{{ x }}"         -> objeto de estilo
 *   style-hover="..."              -> classe CSS com :hover (gera hover.css)
 *
 * Gera um componente por tela/modal (veja SPLITS) e um `AppView.tsx` raiz.
 */
import fs from 'node:fs';
import path from 'node:path';

const [, , srcFile, outDir] = process.argv;
if (!srcFile || !outDir) {
  console.error('uso: node convert-design.mjs <arquivo.dc.html> <pasta-destino>');
  process.exit(1);
}

const html = fs.readFileSync(srcFile, 'utf8');
const start = html.indexOf('<x-dc>');
const end = html.indexOf('</x-dc>');
let body = html.slice(start + '<x-dc>'.length, end);
body = body.replace(/<helmet>[\s\S]*?<\/helmet>/, '');

// ---------------------------------------------------------------- tokenizer
const VOID = new Set(['input', 'img', 'br', 'hr', 'meta', 'link']);

function parse(src) {
  const root = { type: 'root', children: [] };
  const stack = [root];
  let i = 0;
  const top = () => stack[stack.length - 1];
  while (i < src.length) {
    if (src.startsWith('<!--', i)) {
      const j = src.indexOf('-->', i);
      top().children.push({ type: 'comment', text: src.slice(i + 4, j).trim() });
      i = j + 3;
    } else if (src.startsWith('</', i)) {
      const j = src.indexOf('>', i);
      const name = src.slice(i + 2, j).trim().toLowerCase();
      // fecha até achar a tag correspondente
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].name === name) { stack.length = k; break; }
      }
      i = j + 1;
    } else if (src[i] === '<' && /[a-zA-Z]/.test(src[i + 1] || '')) {
      // tag de abertura — atributos podem conter '>' dentro de aspas
      let j = i + 1;
      let q = null;
      while (j < src.length) {
        const ch = src[j];
        if (q) { if (ch === q) q = null; }
        else if (ch === '"' || ch === "'") q = ch;
        else if (ch === '>') break;
        j++;
      }
      const raw = src.slice(i + 1, j);
      const selfClose = raw.endsWith('/');
      const m = raw.replace(/\/$/, '').match(/^([a-zA-Z][\w-]*)([\s\S]*)$/);
      const name = m[1].toLowerCase();
      const attrs = [];
      const re = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
      let am;
      while ((am = re.exec(m[2]))) {
        attrs.push({ name: am[1], value: am[2] ?? am[3] ?? am[4] ?? null });
      }
      const node = { type: 'el', name, attrs, children: [] };
      top().children.push(node);
      if (!VOID.has(name) && !selfClose) stack.push(node);
      i = j + 1;
    } else {
      const j = src.indexOf('<', i);
      const t = src.slice(i, j < 0 ? src.length : j);
      top().children.push({ type: 'text', text: t });
      i = j < 0 ? src.length : j;
    }
  }
  return root;
}

// ---------------------------------------------------------------- helpers
const BIND = /^\s*\{\{\s*([\w.]+)\s*\}\}\s*$/;
const BIND_G = /\{\{\s*([\w.]+)\s*\}\}/g;

function resolve(expr, scope) {
  const head = expr.split('.')[0];
  if (expr === 'true') return 'true';
  if (expr === 'false') return 'false';
  return scope.includes(head) ? expr : `ui.${expr}`;
}

function camel(prop) {
  if (prop.startsWith('--')) return JSON.stringify(prop);
  let p = prop.replace(/^-webkit-/, 'Webkit-').replace(/^-moz-/, 'Moz-').replace(/^-ms-/, 'ms-');
  return p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function splitDecls(style) {
  const out = [];
  let depth = 0, q = null, cur = '';
  for (const ch of style) {
    if (q) { if (ch === q) q = null; cur += ch; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

function valueExpr(val, scope) {
  const b = val.match(BIND);
  if (b) return resolve(b[1], scope);
  if (!BIND_G.test(val)) { BIND_G.lastIndex = 0; return JSON.stringify(val); }
  BIND_G.lastIndex = 0;
  const tpl = val.replace(/`/g, '\\`').replace(BIND_G, (_, e) => '${' + resolve(e, scope) + '}');
  return '`' + tpl + '`';
}

function styleObj(style, scope) {
  const parts = splitDecls(style).map((d) => {
    const k = d.indexOf(':');
    const prop = d.slice(0, k).trim();
    const val = d.slice(k + 1).trim();
    return `${camel(prop)}: ${valueExpr(val, scope)}`;
  });
  return `{{ ${parts.join(', ')} }}`;
}

const hoverRules = new Map(); // css -> className
function hoverClass(css) {
  const norm = splitDecls(css).join('; ');
  if (!hoverRules.has(norm)) hoverRules.set(norm, `h${hoverRules.size + 1}`);
  return hoverRules.get(norm);
}

const ATTR_MAP = {
  class: 'className', for: 'htmlFor', onclick: 'onClick', oninput: 'onChange', onchange: 'onChange',
  onkeydown: 'onKeyDown', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  colspan: 'colSpan', rowspan: 'rowSpan', 'stroke-width': 'strokeWidth', 'text-anchor': 'textAnchor',
  'font-family': 'fontFamily', 'font-size': 'fontSize', 'font-weight': 'fontWeight', viewbox: 'viewBox',
  crossorigin: 'crossOrigin',
};
const NUMERIC_ATTRS = new Set(['rows', 'cols', 'colSpan', 'rowSpan', 'tabIndex', 'maxLength']);

function attrsToJsx(node, scope) {
  const out = [];
  const classes = [];
  for (const { name, value } of node.attrs) {
    if (name.startsWith('hint-')) continue;
    if (name === 'style-hover') { classes.push(hoverClass(value)); continue; }
    if (name === 'style') { out.push(`style=${styleObj(value, scope)}`); continue; }
    let jsxName = ATTR_MAP[name.toLowerCase()] || name;
    if (value === null) { out.push(jsxName); continue; }
    const b = value.match(BIND);
    if (jsxName === 'value' && b && ['input', 'select', 'textarea'].includes(node.name)) {
      out.push(`value={${resolve(b[1], scope)} ?? ''}`);
      continue;
    }
    if (b) { out.push(`${jsxName}={${resolve(b[1], scope)}}`); continue; }
    if (BIND_G.test(value)) { BIND_G.lastIndex = 0; out.push(`${jsxName}={${valueExpr(value, scope)}}`); continue; }
    if (NUMERIC_ATTRS.has(jsxName) && /^\d+$/.test(value)) { out.push(`${jsxName}={${value}}`); continue; }
    if (name === 'src' && /^assets\//.test(value)) { out.push(`src=${JSON.stringify('/' + value)}`); continue; }
    out.push(`${jsxName}=${JSON.stringify(value)}`);
  }
  if (classes.length) out.push(`className=${JSON.stringify(classes.join(' '))}`);
  // inputs com value+onChange já são controlados; selects/inputs só com value -> readOnly
  return out;
}

function textToJsx(t, scope, hasPrev, hasNext) {
  if (!t.trim()) return /\n/.test(t) ? '' : "{' '}";
  // JSX descarta espaços nas bordas da linha: preserva os que separam conteúdo inline
  const lead = /^\s/.test(t) && hasPrev ? "{' '}" : '';
  const trail = /\s$/.test(t) && hasNext ? "{' '}" : '';
  let s = t.replace(/\s+/g, ' ').trim();
  s = s.replace(/[{}]/g, (c) => `{'${c}'}`)
    .replace(/>/g, "{'>'}")
    .replace(/\{'\{'\}\{'\{'\}\s*([\w.]+)\s*\{'\}'\}\{'\}'\}/g, (_, e) => `{${resolve(e, scope)}}`);
  return lead + s + trail;
}

// ---------------------------------------------------------------- splitting
// flag do sc-if (ou tag) -> [arquivo, componente]
const SPLITS = {
  isDashboard: ['screens/Dashboard', 'Dashboard'],
  showClienteList: ['screens/ClientesLista', 'ClientesLista'],
  showClienteDetail: ['screens/ClienteFicha', 'ClienteFicha'],
  isPedidos: ['screens/Saidas', 'Saidas'],
  isEntradas: ['screens/Entradas', 'Entradas'],
  isFornecedores: ['screens/Fornecedores', 'Fornecedores'],
  isProdutos: ['screens/Produtos', 'Produtos'],
  isEstoque: ['screens/Estoque', 'Estoque'],
  isFuncionarios: ['screens/Funcionarios', 'Funcionarios'],
  isBancos: ['screens/Bancos', 'Bancos'],
  isVeiculos: ['screens/Veiculos', 'Veiculos'],
  isFinanceiro: ['screens/Financeiro', 'Financeiro'],
  isRelatorios: ['screens/Relatorios', 'Relatorios'],
  modalOpen: ['modals/ModalShell', 'ModalShell'],
  modalCliente: ['modals/ClienteForm', 'ClienteForm'],
  modalPedido: ['modals/PedidoForm', 'PedidoForm'],
  modalFornecedor: ['modals/FornecedorForm', 'FornecedorForm'],
  modalProduto: ['modals/ProdutoForm', 'ProdutoForm'],
  modalEntrada: ['modals/EntradaForm', 'EntradaForm'],
  modalLancamento: ['modals/LancamentoForm', 'LancamentoForm'],
  modalDiaria: ['modals/DiariaForm', 'DiariaForm'],
  modalBanco: ['modals/BancoForm', 'BancoForm'],
  modalVeiculo: ['modals/VeiculoForm', 'VeiculoForm'],
  modalFuncionario: ['modals/FuncionarioForm', 'FuncionarioForm'],
  modalPerda: ['modals/PerdaForm', 'PerdaForm'],
  modalPagamento: ['modals/PagamentoForm', 'PagamentoForm'],
  semLogin: ['Login', 'Login'],
  'tag:aside': ['layout/Sidebar', 'Sidebar'],
  'tag:header': ['layout/Topbar', 'Topbar'],
};

const files = []; // {file, comp, jsx}

function ind(n) { return '  '.repeat(n); }

function gen(nodes, scope, depth, owner) {
  const lines = [];
  const real = nodes.filter((x) => x.type !== 'comment' && !(x.type === 'text' && !x.text.trim() && /\n/.test(x.text)));
  for (const n of nodes) {
    if (n.type === 'comment') continue;
    if (n.type === 'text') {
      const ri = real.indexOf(n);
      const t = textToJsx(n.text, scope, ri > 0, ri >= 0 && ri < real.length - 1);
      if (t) lines.push(ind(depth) + t);
      continue;
    }
    if (n.name === 'sc-if') {
      const expr = n.attrs.find((a) => a.name === 'value').value.match(BIND)[1];
      const cond = resolve(expr, scope);
      const split = scope.length === 0 ? SPLITS[expr] : null;
      if (split) {
        emitComponent(split, n.children);
        lines.push(`${ind(depth)}{${cond} ? <${split[1]} ui={ui} /> : null}`);
        continue;
      }
      lines.push(`${ind(depth)}{${cond} ? (`);
      lines.push(`${ind(depth + 1)}<>`);
      lines.push(...gen(n.children, scope, depth + 2, owner));
      lines.push(`${ind(depth + 1)}</>`);
      lines.push(`${ind(depth)}) : null}`);
      continue;
    }
    if (n.name === 'sc-for') {
      const list = n.attrs.find((a) => a.name === 'list').value.match(BIND)[1];
      const as = n.attrs.find((a) => a.name === 'as').value;
      const key = `k${scope.length}`;
      lines.push(`${ind(depth)}{(${resolve(list, scope)} || []).map((${as}, ${key}) => (`);
      lines.push(`${ind(depth + 1)}<Fragment key={${key}}>`);
      lines.push(...gen(n.children, [...scope, as], depth + 2, owner));
      lines.push(`${ind(depth + 1)}</Fragment>`);
      lines.push(`${ind(depth)}))}`);
      continue;
    }
    const tagSplit = scope.length === 0 && !n._split ? SPLITS['tag:' + n.name] : null;
    if (tagSplit) {
      n._split = true;
      emitComponent(tagSplit, [n]);
      lines.push(`${ind(depth)}<${tagSplit[1]} ui={ui} />`);
      continue;
    }
    const attrs = attrsToJsx(n, scope);
    const open = `<${n.name}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
    if (VOID.has(n.name) || (n.children.length === 0 && n.name !== 'textarea')) {
      lines.push(`${ind(depth)}${open} />`);
    } else if (n.name === 'textarea') {
      lines.push(`${ind(depth)}${open} />`);
    } else {
      lines.push(`${ind(depth)}${open}>`);
      lines.push(...gen(n.children, scope, depth + 1, owner));
      lines.push(`${ind(depth)}</${n.name}>`);
    }
  }
  return lines;
}

function emitComponent([file, comp], children) {
  const body = gen(children, [], 3, comp);
  files.push({ file, comp, body });
}

const tree = parse(body);
const rootBody = gen(tree.children, [], 3, 'AppView');
files.push({ file: 'AppView', comp: 'AppView', body: rootBody });

// ---------------------------------------------------------------- write
const HEADER = '// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.\n';
for (const f of files) {
  const used = new Set();
  const text = f.body.join('\n');
  for (const [, [file, comp]] of Object.entries(SPLITS)) {
    if (new RegExp(`<${comp} ui=`).test(text)) used.add(JSON.stringify([file, comp]));
  }
  const depthUp = f.file.includes('/') ? '../' : './';
  const imports = [...used].map((u) => {
    const [file, comp] = JSON.parse(u);
    const rel = path.posix.relative(path.posix.dirname(f.file), file);
    return `import { ${comp} } from '${rel.startsWith('.') ? rel : './' + rel}';`;
  });
  const needsFragment = /<Fragment /.test(text);
  const src = `${HEADER}'use client';\n\n` +
    (needsFragment ? "import { Fragment } from 'react';\n" : '') +
    `import type { Vals } from '${depthUp}types';\n` +
    imports.join('\n') + (imports.length ? '\n' : '') +
    `\nexport function ${f.comp}({ ui }: { ui: Vals }) {\n  return (\n    <>\n${text}\n    </>\n  );\n}\n`;
  const out = path.join(outDir, f.file + '.tsx');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, src);
}

const css = '/* Gerado por scripts/convert-design.mjs — estados :hover do design (style-hover). */\n' +
  [...hoverRules].map(([rule, cls]) =>
    `.${cls}:hover { ${splitDecls(rule).map((d) => d + ' !important').join('; ')}; }`).join('\n') + '\n';
fs.writeFileSync(path.join(outDir, 'hover.css'), css);
console.log(`ok: ${files.length} componentes, ${hoverRules.size} regras de hover`);
