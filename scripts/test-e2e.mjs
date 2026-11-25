#!/usr/bin/env node
/**
 * Testes de ponta a ponta da API (npm test).
 *
 * Sobe o app com um banco PGlite TEMPORÁRIO (os dados reais em .data/ não são
 * tocados), carrega a demonstração, roda os testes e apaga tudo no fim.
 * Precisa do build: roda `next build` sozinho se ainda não existir.
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NEXT = path.join(RAIZ, 'node_modules', 'next', 'dist', 'bin', 'next');
const TSX = path.join(RAIZ, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const PORTA = 3000 + Math.floor(Math.random() * 900) + 100;
const B = `http://localhost:${PORTA}`;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'imperio-crm-teste-'));
// DATABASE_URL vazia (não ausente): nem o Next (.env*) nem o scripts/db.ts (.env.producao)
// sobrescrevem variável já existente — assim o teste NUNCA toca o banco de produção.
const ENV = { ...process.env, PGLITE_DIR: path.join(TMP, 'pglite'), DATABASE_URL: '', NODE_ENV: 'production' };

let falhas = 0, total = 0, servidor = null;
const ok = (cond, nome, extra) => {
  total++;
  if (cond) console.log(`  ✓ ${nome}`);
  else { falhas++; console.log(`  ✗ ${nome}${extra === undefined ? '' : ' → ' + JSON.stringify(extra).slice(0, 300)}`); }
};
const grupo = (t) => console.log(`\n${t}`);
const node = (args, extra = {}) => spawnSync(process.execPath, args, { cwd: RAIZ, env: ENV, encoding: 'utf8', ...extra });

function cliente() {
  let cookie = '';
  return async (method, url, body, headers = {}) => {
    const r = await fetch(B + url, {
      method, headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}), ...headers },
      body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)),
    });
    const sc = r.headers.get('set-cookie');
    if (sc) cookie = sc.split(';')[0];
    const txt = await r.text();
    let data = null; try { data = JSON.parse(txt); } catch { data = txt; }
    return { status: r.status, data, headers: r.headers };
  };
}
const hoje = new Date().toISOString().slice(0, 10);
const addDias = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

async function subirServidor() {
  servidor = spawn(process.execPath, [NEXT, 'start', '-p', String(PORTA)], { cwd: RAIZ, env: ENV, stdio: 'ignore' });
  for (let i = 0; i < 120; i++) {
    try { const r = await fetch(B + '/api/auth/me'); if (r.ok) return; } catch { /* subindo */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('servidor não subiu');
}
function pararServidor() {
  if (!servidor) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(servidor.pid), '/T', '/F'], { stdio: 'ignore' });
  else servidor.kill('SIGTERM');
  servidor = null;
}

async function testes() {
  const anon = cliente(), adm = cliente(), fun = cliente();

  grupo('Autenticação');
  ok((await anon('GET', '/api/bootstrap')).status === 401, 'sem login: 401');
  ok((await anon('GET', '/api/auth/me')).data.user === null, 'me sem login: null');
  ok((await anon('POST', '/api/auth/login', { usuario: 'admin', senha: 'x' })).status === 401, 'senha errada: 401');
  let r = await adm('POST', '/api/auth/login', { usuario: 'ADMIN', senha: 'admin123' });
  ok(r.status === 200 && r.data.user.role === 'admin', 'login admin (sem diferenciar maiúsculas)');
  ok(/HttpOnly/i.test(r.headers.get('set-cookie') || ''), 'cookie httpOnly');
  ok((await adm('POST', '/api/clientes', 'nome=x', { 'content-type': 'text/plain' })).status === 415, 'mutação sem JSON: 415');
  ok((await fun('POST', '/api/auth/login', { usuario: 'funcionario', senha: 'func123' })).status === 200, 'login funcionário');
  let ultima;
  for (let i = 0; i < 6; i++) ultima = await anon('POST', '/api/auth/login', { usuario: 'ninguem', senha: 'x' + i });
  ok(ultima.status === 429, '6ª senha errada seguida: bloqueado (429, guardado no banco)', ultima.data);

  grupo('Carga inicial');
  r = await adm('GET', '/api/bootstrap');
  const D = r.data.data;
  ok(D.clientes.length === 7 && D.pedidos.length === 9 && D.entradas.length === 6 && D.lancamentos.length === 16, 'dados de demonstração', Object.fromEntries(Object.entries(D).map(([k, v]) => [k, v.length])));
  ok(r.data.config && r.data.config.metas.perdaMax === 10 && r.data.config.rotas.length === 4, 'configurações padrão');
  ok(D.usuarios.length === 2 && !('senhaHash' in D.usuarios[0]), 'usuários sem hash de senha');
  ok(D.pedidos.every((p) => p.clienteId !== '') && D.entradas.every((e) => e.fornecedorId !== ''), 'vendas e compras ligadas aos cadastros');
  ok(D.pedidos.find((p) => p.id === '#2049').pag === 'Atrasado', 'pendente vencido = Atrasado');
  const rf = (await fun('GET', '/api/bootstrap')).data.data;
  ok(rf.lancamentos.length === 0 && rf.bancos.length === 0 && rf.funcionarios.length === 0 && rf.usuarios.length === 0 && rf.pedidos.length > 0, 'funcionário não recebe financeiro, equipe nem usuários');

  grupo('Permissões');
  ok((await fun('GET', '/api/lancamentos')).status === 403, 'funcionário: lançamentos 403');
  ok((await fun('POST', '/api/clientes', { nome: 'x' })).status === 403, 'funcionário: criar cliente 403');
  ok((await fun('PUT', '/api/configuracoes', { metas: {} })).status === 403, 'funcionário: configurações 403');
  ok((await fun('GET', '/api/usuarios')).status === 403, 'funcionário: usuários 403');
  ok((await fun('GET', '/api/backup')).status === 403, 'funcionário: backup 403');
  r = await fun('POST', '/api/pedidos', { cliente: 'Mercado Central', dataPedido: hoje, entrega: hoje, pag: 'Pago', bancoId: '1', itens: [] });
  ok(r.status === 201 && r.data.pag !== 'Pago' && r.data.bancoId === '', 'funcionário cria venda mas não dá baixa', r.data);
  const pedFun = r.data.id;
  ok((await fun('DELETE', '/api/pedidos/' + encodeURIComponent(pedFun))).status === 403, 'funcionário não exclui');

  grupo('Validação');
  ok((await adm('POST', '/api/clientes', { nome: ' ' })).data.erro === 'Informe o nome do estabelecimento.', 'cliente sem nome');
  ok(/diarista/.test((await adm('POST', '/api/lancamentos', { data: hoje, categoria: 'Diária', valor: 50 })).data.erro), 'diária sem diarista');
  ok(/maior que zero/.test((await adm('POST', '/api/lancamentos', { data: hoje, categoria: 'Frete', valor: 0 })).data.erro), 'valor zero');
  ok((await adm('POST', '/api/pedidos', { cliente: 'Não Existe', dataPedido: hoje, entrega: hoje })).status === 400, 'venda para cliente inexistente');

  grupo('Vendas, compras e baixas');
  const cli = D.clientes.find((c) => c.nome === 'Mini Atacado Real');
  r = await adm('POST', '/api/pedidos', { id: '#1', cliente: cli.nome, dataPedido: hoje, entrega: hoje, status: 'Entregue', venc: '—', valor: 1, itens: [{ produtoId: '1', nome: 'Batata', un: 'KG', kg: 100, preco: 3.2 }] });
  ok(r.status === 201 && r.data.id === '#2051' && r.data.valor === 320, 'código sequencial e total pelos itens', r.data);
  ok(r.data.venc === addDias(hoje, cli.prazo), 'vencimento = entrega + prazo do cliente');
  const ped = r.data;
  r = await adm('PUT', '/api/pedidos/' + encodeURIComponent(ped.id), { ...ped, status: 'Cancelado' });
  ok(r.data.pag === '—', 'cancelada não é dívida');
  r = await adm('PUT', '/api/pedidos/' + encodeURIComponent(ped.id), { ...ped, status: 'Entregue', pag: 'Pago', dataPagIso: addDias(hoje, 2), formaPag: 'PIX', bancoId: '1' });
  ok(r.data.pag === 'Pago' && r.data.bancoId === '1' && r.data.recebDias === 2, 'recebida no banco 1 (2 dias)', r.data);
  const forn = D.fornecedores[0];
  await adm('PUT', '/api/fornecedores/' + forn.id, { ...forn, prazo: 10 });
  r = await adm('POST', '/api/entradas', { fornecedor: forn.nome, data: hoje, itens: [{ produtoId: 1, nome: 'Batata', un: 'KG', kg: 10, preco: 2, perdaKg: 1 }] });
  ok(r.status === 201 && r.data.venc === addDias(hoje, 10) && r.data.valor === 20, 'compra vence pelo prazo do fornecedor', r.data);
  const ent = r.data;
  // centavos: 33,3 × 2,15 = 71,595 → 71,60 (não 71,59 nem 72); 10,5 × 2,35 = 24,675 → 24,68
  r = await adm('POST', '/api/entradas', { fornecedor: forn.nome, data: hoje, itens: [
    { produtoId: 1, nome: 'Batata', un: 'KG', kg: 33.3, preco: 2.15, perdaKg: 0 },
    { produtoId: 2, nome: 'Cebola', un: 'KG', kg: 10.5, preco: 2.35, perdaKg: 0 }] });
  ok(r.status === 201 && r.data.valor === 96.28, 'entrada guarda centavos exatos (71,60 + 24,68 = 96,28)', r.data && r.data.valor);
  const entCent = r.data;
  r = await adm('POST', '/api/pedidos', { cliente: cli.nome, dataPedido: hoje, entrega: hoje, itens: [{ produtoId: 1, nome: 'Batata', un: 'KG', kg: 12.5, preco: 3.19 }] });
  ok(r.status === 201 && r.data.valor === 39.88, 'venda guarda centavos (12,5 × 3,19 = 39,875 → 39,88)', r.data && r.data.valor);
  await adm('DELETE', '/api/pedidos/' + encodeURIComponent(r.data.id));
  await adm('DELETE', '/api/entradas/' + entCent.id);
  // desconto na compra (R$ 2,00 por caixa): 40 CX a R$ 25,50 = 1.020,00 − 80,00 = 940,00 a pagar
  r = await adm('POST', '/api/entradas', { fornecedor: forn.nome, data: hoje, desconto: 80, itens: [{ produtoId: 4, nome: 'Alface', un: 'CX', kg: 40, preco: 25.5, perdaKg: 0 }] });
  ok(r.status === 201 && r.data.valor === 940 && r.data.desconto === 80, 'desconto: total a pagar = itens − desconto (1.020 − 80 = 940)', r.data && [r.data.valor, r.data.desconto]);
  const entDesc = r.data;
  r = await adm('PUT', '/api/entradas/' + entDesc.id, { ...entDesc, desconto: 80.5 });
  ok(r.status === 200 && r.data.valor === 939.5, 'desconto com centavos ao editar (1.020 − 80,50 = 939,50)', r.data && r.data.valor);
  r = await adm('PUT', '/api/entradas/' + entDesc.id, { ...entDesc, desconto: 2000 });
  ok(r.status === 400 && /maior que o total/.test(r.data.erro), 'desconto maior que os itens é recusado', r.data);
  await adm('DELETE', '/api/entradas/' + entDesc.id);
  r = await adm('PUT', '/api/entradas/' + ent.id, { ...ent, pago: 'Pago', dataPag: hoje, bancoId: '2' });
  ok(r.data.pago === 'Pago' && r.data.bancoId === '2', 'compra paga pela conta 2');
  r = await adm('POST', '/api/lancamentos', { data: hoje, categoria: 'Simples Nacional', valor: 300, pago: 'Pendente', bancoId: '1' });
  ok(r.status === 201 && r.data.pago === 'Pendente' && r.data.dataPag === '', 'custo a pagar', r.data);
  const lanc = r.data;
  r = await adm('PUT', '/api/lancamentos/' + lanc.id, { ...lanc, pago: 'Pago', dataPag: addDias(hoje, -5) });
  ok(r.status === 400, 'pagamento antes do lançamento recusado');

  grupo('Vínculos e cascatas');
  const vila = D.clientes.find((c) => c.nome === 'Minimercado Vila Nova');
  await adm('PUT', '/api/clientes/' + vila.id, { ...vila, nome: 'Vila Nova Ltda' });
  ok((await adm('GET', '/api/pedidos')).data.filter((p) => p.clienteId === vila.id).every((p) => p.cliente === 'Vila Nova Ltda'), 'renomear cliente atualiza vendas');
  const bat = D.produtos.find((p) => p.nome === 'Batata');
  await adm('PUT', '/api/produtos/' + bat.id, { ...bat, nome: 'Batata Lavada' });
  const itens = [...(await adm('GET', '/api/pedidos')).data, ...(await adm('GET', '/api/entradas')).data].flatMap((x) => x.itens).filter((i) => i.produtoId === bat.id);
  ok(itens.length > 0 && itens.every((i) => i.nome === 'Batata Lavada'), 'renomear produto atualiza itens');
  ok((await adm('DELETE', '/api/clientes/' + vila.id)).status === 409, 'cliente com vendas não exclui');
  ok((await adm('DELETE', '/api/produtos/' + bat.id)).status === 409, 'produto usado não exclui');
  ok((await adm('DELETE', '/api/bancos/1')).status === 409, 'banco com movimento não exclui');
  ok((await adm('DELETE', '/api/fornecedores/' + forn.id)).status === 409, 'fornecedor com compras não exclui');

  grupo('Configurações');
  r = await adm('PUT', '/api/configuracoes', { metas: { perdaMax: 8, perdaAlerta: 12 }, rotas: ['Centro', 'Norte'], empresa: { nome: 'Goiaba Teste' } });
  ok(r.status === 200 && r.data.metas.perdaMax === 8 && r.data.metas.markupMin === 60 && r.data.rotas.join() === 'Centro,Norte', 'salvar metas mantendo as outras');
  ok((await adm('PUT', '/api/configuracoes', { metas: { perdaMax: 20, perdaAlerta: 5 } })).status === 400, 'meta incoerente recusada');
  ok((await fun('GET', '/api/configuracoes')).data.empresa.nome === 'Goiaba Teste', 'funcionário lê as configurações');

  grupo('Usuários e senha');
  r = await adm('POST', '/api/usuarios', { nome: 'Carla', usuario: 'carla', senha: 'segredo1', role: 'colaborador' });
  ok(r.status === 201 && r.data.usuario === 'carla', 'admin cria usuário');
  const carla = r.data;
  ok((await adm('POST', '/api/usuarios', { nome: 'X', usuario: 'carla', senha: 'segredo1', role: 'colaborador' })).status === 409, 'usuário duplicado');
  ok((await adm('POST', '/api/usuarios', { nome: 'X', usuario: 'zé', senha: '123', role: 'colaborador' })).status === 400, 'usuário/senha inválidos');
  const c1 = cliente();
  ok((await c1('POST', '/api/auth/login', { usuario: 'carla', senha: 'segredo1' })).status === 200, 'novo usuário entra');
  ok((await c1('POST', '/api/auth/senha', { atual: 'errada', nova: 'outra123' })).status === 400, 'minha senha: atual errada');
  ok((await c1('POST', '/api/auth/senha', { atual: 'segredo1', nova: 'outra123' })).status === 200, 'minha senha: trocada');
  ok((await cliente()('POST', '/api/auth/login', { usuario: 'carla', senha: 'outra123' })).status === 200, 'entra com a nova senha');
  await adm('PUT', '/api/usuarios/' + carla.id, { nome: 'Carla', role: 'colaborador', ativo: 'nao' });
  ok((await c1('GET', '/api/bootstrap')).status === 401, 'desativar derruba a sessão');
  ok((await cliente()('POST', '/api/auth/login', { usuario: 'carla', senha: 'outra123' })).status === 401, 'desativado não entra');
  const eu = D.usuarios.find((u) => u.usuario === 'admin');
  ok((await adm('PUT', '/api/usuarios/' + eu.id, { nome: 'Adm', role: 'colaborador', ativo: 'sim' })).status === 409, 'admin não rebaixa a si mesmo');

  grupo('Histórico de alterações');
  r = await adm('GET', '/api/auditoria?limite=500');
  const acoes = r.data.map((a) => `${a.recurso}:${a.acao}`);
  ok(acoes.includes('pedidos:criou') && acoes.includes('pedidos:alterou') && acoes.includes('clientes:alterou') && acoes.includes('configuracoes:alterou') && acoes.includes('usuarios:criou'), 'registra criações e alterações', [...new Set(acoes)]);
  const ren = r.data.find((a) => a.recurso === 'clientes' && a.acao === 'alterou');
  ok(ren && ren.depois.nome === 'Vila Nova Ltda' && ren.antes.nome === 'Minimercado Vila Nova' && ren.userNome === 'Administrador', 'guarda antes/depois e autor');
  ok(!JSON.stringify(r.data).includes('senhaHash'), 'nunca guarda hash de senha');
  ok((await adm('GET', '/api/auditoria?recurso=pedidos')).data.every((a) => a.recurso === 'pedidos'), 'filtro por recurso');

  grupo('Backup');
  r = await adm('GET', '/api/backup');
  ok(r.status === 200 && /attachment/.test(r.headers.get('content-disposition') || ''), 'download do backup');
  const bk = r.data;
  ok(bk.app === 'imperio-crm' && bk.tabelas.pedidos.length === 11 && bk.tabelas.users.length === 3 && !bk.tabelas.sessions, 'backup completo e sem sessões', Object.fromEntries(Object.entries(bk.tabelas).map(([k, v]) => [k, v.length])));
  const arq = path.join(TMP, 'backup.json');
  fs.writeFileSync(arq, JSON.stringify(bk));
  await adm('DELETE', '/api/pedidos/' + encodeURIComponent(pedFun));
  return { arq, contagem: bk.tabelas };
}

async function main() {
  console.log(`banco temporário: ${TMP}`);
  if (!fs.existsSync(path.join(RAIZ, '.next', 'BUILD_ID'))) {
    console.log('sem build — rodando next build…');
    const b = node([NEXT, 'build'], { stdio: 'inherit' });
    if (b.status !== 0) throw new Error('build falhou');
  }
  const demo = node([TSX, 'scripts/db.ts', 'demo']);
  if (demo.status !== 0) throw new Error('falha ao carregar demonstração:\n' + demo.stderr + demo.stdout);
  await subirServidor();
  let res;
  try { res = await testes(); } finally { pararServidor(); }

  grupo('Restauração (CLI)');
  const rest = node([TSX, 'scripts/db.ts', 'restore', res.arq]);
  ok(rest.status === 0 && /pedidos: 11/.test(rest.stdout), 'restore do backup', rest.stderr || rest.stdout);
  await subirServidor();
  try {
    const adm = cliente();
    ok((await adm('POST', '/api/auth/login', { usuario: 'admin', senha: 'admin123' })).status === 200, 'login depois de restaurar');
    const d = (await adm('GET', '/api/bootstrap')).data;
    ok(d.data.pedidos.length === 11 && d.config.empresa.nome === 'Goiaba Teste', 'dados e configurações restaurados');
    const r = await adm('POST', '/api/pedidos', { cliente: 'Mercado Central', dataPedido: hoje, entrega: hoje, itens: [] });
    ok(r.data.id === '#2052', 'sequências continuam depois do restaurado', r.data.id);
    const c = await adm('POST', '/api/clientes', { nome: 'Novo depois do restore' });
    ok(c.status === 201, 'ids seriais continuam (sem conflito)', c.data);
  } finally { pararServidor(); }
}

main()
  .catch((e) => { falhas++; total++; console.error('\nERRO:', e.message); })
  .finally(() => {
    pararServidor();
    try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* arquivo preso no Windows */ }
    console.log(`\n${total - falhas}/${total} ok${falhas ? ` — ${falhas} falha(s)` : ''}`);
    process.exit(falhas ? 1 : 0);
  });
