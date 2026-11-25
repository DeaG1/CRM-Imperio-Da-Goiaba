/**
 * Recursos da API REST (`/api/<recurso>` e `/api/<recurso>/<id>`).
 *
 * Cada recurso define:
 *  - quem pode ler / gravar / excluir;
 *  - `parse`: valida o corpo vindo da interface e devolve os valores da tabela
 *    (campos desconhecidos são descartados; totais e regras são recalculados aqui);
 *  - `toClient`: converte a linha do banco no formato que a interface usa
 *    (o mesmo do protótipo: datas ISO, `''` para vínculo vazio, `'sim'/'nao'`…).
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { asc, desc, eq, sql, type SQL } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import type { Db } from './db';
import * as s from './db/schema';
import { hojeBR } from '../shared/datas';
import { totalItens } from '../shared/dinheiro';
import { HttpError, notFound } from './http';
import type { Role, SessionUser } from './session';

// ------------------------------------------------------------------ constantes do negócio
export const LANC_CATS = ['Diária', 'Frete', 'Gasolina', 'Manutenção dos Carros', 'Multa', 'Salário',
  'Adiantamento de salário', 'Vale-alimentação', 'Vale-transporte', 'FGTS', 'INSS', 'Simples Nacional',
  'Parcelamento Impostos', 'Pagamento de conta de sócio', 'Outros'] as const;
export const VEIC_CATS = ['Gasolina', 'Manutenção dos Carros', 'Multa'];
export const UNIDADES = ['KG', 'CX', 'BANDEJA', 'UNIDADE', 'SACO', 'MAÇO'] as const;

// ------------------------------------------------------------------ helpers de validação
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Aceita ISO (aaaa-mm-dd) e o formato antigo dd/mm(/aaaa) do protótipo. */
function normDate(v: unknown): unknown {
  if (v == null) return null;
  const t = String(v).trim();
  if (t === '' || t === '—') return null;
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = t.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (m) {
    const y = m[3] ? (m[3].length === 2 ? `20${m[3]}` : m[3]) : hojeBR().slice(0, 4);
    return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  return t;
}
const toNum = (v: unknown) => {
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return v;
  return Number(String(v).trim().replace(',', '.'));
};
const numero = (label: string) =>
  z.number({ error: `${label}: número inválido.` }).finite().max(1e10, `${label}: valor alto demais.`);
const num = (label: string) => z.preprocess(toNum, numero(label).min(0, `${label} não pode ser negativo.`));
const numSigned = (label: string) => z.preprocess(toNum, numero(label));
const numOpt = (label: string) =>
  z.preprocess((v) => (v == null || v === '' || toNum(v) === 0 ? null : toNum(v)), numero(label).min(0).nullable());
const int = (label: string, min: number, max: number) =>
  z.preprocess(toNum, numero(label).int(`${label}: use um número inteiro.`).min(min, `${label}: mínimo ${min}.`).max(max, `${label}: máximo ${max}.`));
const txt = (max = 300) =>
  z.preprocess((v) => (v == null ? '' : String(v)), z.string().trim().max(max, `Texto muito longo (máx. ${max} caracteres).`));
const obrig = (label: string, max = 200) =>
  z.preprocess((v) => (v == null ? '' : String(v)), z.string().trim().min(1, `Informe ${label}.`).max(max, `Texto muito longo (máx. ${max} caracteres).`));
const dataObrig = (label: string) =>
  z.preprocess(normDate, z.string({ error: `Informe ${label}.` }).regex(ISO, `${label}: data inválida.`));
const dataOpt = (label: string) =>
  z.preprocess(normDate, z.string().regex(ISO, `${label}: data inválida.`).nullable());
const fk = z.preprocess((v) => (v === '' || v == null ? null : toNum(v)), z.number().int().positive().nullable());
const simNao = z.preprocess((v) => !(v === 'nao' || v === false), z.boolean());
const unidade = z.preprocess((v) => (v ? String(v).toUpperCase() : 'KG'), z.enum(UNIDADES, { error: 'Unidade inválida.' }));

const item = z.object({
  produtoId: fk,
  nome: txt(120),
  un: unidade,
  kg: num('Quantidade'),
  preco: num('Preço'),
  perdaKg: num('Perda'),
}).refine((i) => i.produtoId != null || i.nome !== '', { message: 'Escolha o produto de cada item.' });
const itens = z.array(item).max(200, 'Itens demais neste lançamento.').default([]);

function totais(lista: s.Item[]) {
  return {
    pesoKg: lista.reduce((a, i) => a + (i.kg || 0), 0),
    // centavos importam (ex.: goiaba a R$ 2,35/kg): soma dos subtotais arredondados ao centavo
    valor: totalItens(lista),
    perdaKg: lista.reduce((a, i) => a + (i.perdaKg || 0), 0),
  };
}
// "hoje" no fuso de Brasília (o servidor na Cloudflare roda em UTC)
const hojeIso = () => hojeBR();
const diasEntre = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
const dm = (iso: string | null) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : '');
const str = (v: number | null) => (v == null ? '' : String(v));
const semMeta = ({ criadoEm: _c, ...r }: any) => r;

// ------------------------------------------------------------------ definição
type Ctx = { user: SessionUser; db: Db; existing?: any };
export type ResourceDef = {
  table: PgTable & { id: any };
  idType: 'int' | 'text';
  read: readonly Role[];
  write: readonly Role[];
  remove: readonly Role[];
  order: (t: any) => SQL[];
  parse: (body: any, ctx: Ctx) => Promise<Record<string, unknown>> | Record<string, unknown>;
  toClient: (row: any) => any;
  /** Roda na mesma transação do PUT (ex.: renomear propaga para o histórico). */
  afterUpdate?: (tx: Db, before: any, after: any) => Promise<void>;
  /** Pode recusar a exclusão (lança HttpError). */
  beforeDelete?: (db: Db, id: any) => Promise<void>;
  /** Mensagem quando a exclusão esbarra num vínculo do banco. */
  emUso?: string;
};

const addDias = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
/** Pendente com vencimento passado é "Atrasado" (cancelado/devolvido não é dívida). */
const situacaoPedido = (r: any) => {
  if (r.pag === 'Pago') return 'Pago';
  if (r.status === 'Cancelado' || r.status === 'Devolvido') return '—';
  if (r.pag === 'Atrasado') return 'Atrasado';
  return r.venc && r.venc < hojeIso() ? 'Atrasado' : 'Pendente';
};
const erroCampo = (path: string, message: string) =>
  new z.ZodError([{ code: 'custom', path: [path], message, input: null }]);

const TODOS = ['admin', 'colaborador'] as const;
const ADMIN = ['admin'] as const;

export const resources: Record<string, ResourceDef> = {
  clientes: {
    table: s.clientes, idType: 'int', read: TODOS, write: ADMIN, remove: ADMIN,
    order: (t) => [asc(t.id)],
    parse: (b) => z.object({
      nome: obrig('o nome do estabelecimento'),
      resp: txt(120), cnpj: txt(30), tel: txt(40), email: txt(160), endereco: txt(300),
      rota: txt(60), freq: txt(80),
      status: z.enum(['ativo', 'negociacao', 'inadimplente', 'inativo'], { error: 'Status inválido.' }).default('ativo'),
      cobranca: txt(40), forma: txt(40),
      limite: num('Limite de crédito'),
      prazo: int('Prazo de pagamento', 0, 365),
      tend: z.preprocess((v) => v || '→', z.enum(['↑', '→', '↓'])),
      ult: txt(40), obs: txt(2000),
    }).parse(b),
    // `desde`: data do cadastro (a ficha usa o que vier antes: cadastro ou 1º pedido)
    toClient: (r) => ({ ...semMeta(r), desde: r.criadoEm ? hojeBR(new Date(r.criadoEm)) : '' }),
    afterUpdate: async (tx, antes, depois) => {
      if (antes.nome !== depois.nome) await tx.update(s.pedidos).set({ cliente: depois.nome }).where(eq(s.pedidos.clienteId, depois.id));
    },
    emUso: 'Este cliente tem pedidos registrados. Mude o status para "Inativo" em vez de excluir.',
  },

  interacoes: {
    table: s.interacoes, idType: 'int', read: ADMIN, write: ADMIN, remove: ADMIN,
    order: (t) => [desc(t.data), desc(t.id)],
    parse: async (b, { user, db, existing }) => {
      const d = z.object({
        clienteId: z.preprocess(toNum, z.number().int().positive('Cliente inválido.')),
        data: dataObrig('a data'),
        tipo: z.enum(s.TIPOS_INTERACAO, { error: 'Tipo de interação inválido.' }),
        texto: z.preprocess((v) => (v == null ? '' : String(v)), z.string().trim().min(1, 'Descreva a interação.').max(2000, 'Texto muito longo (máx. 2000 caracteres).')),
      }).parse(b);
      const [c] = await db.select({ id: s.clientes.id }).from(s.clientes).where(eq(s.clientes.id, d.clienteId)).limit(1);
      if (!c) throw notFound('Cliente não encontrado.');
      // o autor é quem registrou; editar não troca o autor
      return existing ? d : { ...d, autorId: user.id, autorNome: user.nome };
    },
    toClient: semMeta,
  },

  produtos: {
    table: s.produtos, idType: 'int', read: TODOS, write: ADMIN, remove: ADMIN,
    order: (t) => [asc(t.id)],
    parse: (b) => z.object({
      nome: obrig('o nome do produto', 120), un: unidade,
      compra: numOpt('Preço de compra'), venda: numOpt('Preço de venda'),
    }).parse(b),
    toClient: semMeta,
    // renomear o produto atualiza vínculos de fornecedor, perdas e itens de compras/vendas
    afterUpdate: async (tx, antes, depois) => {
      if (antes.nome === depois.nome && antes.un === depois.un) return;
      if (antes.nome !== depois.nome) {
        const forns = await tx.select().from(s.fornecedores);
        for (const f of forns) {
          if ((f.produtos || []).includes(antes.nome)) {
            await tx.update(s.fornecedores).set({ produtos: f.produtos.map((n) => (n === antes.nome ? depois.nome : n)) }).where(eq(s.fornecedores.id, f.id));
          }
        }
        await tx.update(s.perdas).set({ nome: depois.nome }).where(eq(s.perdas.produtoId, depois.id));
      }
      const usaProduto = (t: typeof s.entradas | typeof s.pedidos) =>
        sql`${t.itens} @> ${JSON.stringify([{ produtoId: depois.id }])}::jsonb`;
      for (const t of [s.entradas, s.pedidos] as const) {
        const rows = await tx.select({ id: t.id, itens: t.itens }).from(t as any).where(usaProduto(t));
        for (const r of rows as { id: string; itens: s.Item[] }[]) {
          const itensNovos = r.itens.map((i) => (i.produtoId === depois.id ? { ...i, nome: depois.nome } : i));
          await tx.update(t as any).set({ itens: itensNovos }).where(eq(t.id, r.id));
        }
      }
    },
    beforeDelete: async (db, id) => {
      for (const t of [s.entradas, s.pedidos] as const) {
        const [r] = await db.select({ id: t.id }).from(t as any)
          .where(sql`${t.itens} @> ${JSON.stringify([{ produtoId: id }])}::jsonb`).limit(1);
        if (r) throw new HttpError(409, 'Este produto aparece em compras ou vendas e não pode ser excluído.');
      }
    },
  },

  fornecedores: {
    table: s.fornecedores, idType: 'int', read: TODOS, write: ADMIN, remove: ADMIN,
    order: (t) => [asc(t.id)],
    parse: (b) => z.object({
      nome: obrig('o nome do fornecedor'), regiao: txt(160), contato: txt(80),
      prazo: int('Prazo de pagamento', 0, 365),
      produtos: z.array(txt(120)).max(200).default([]),
    }).parse(b),
    toClient: semMeta,
    afterUpdate: async (tx, antes, depois) => {
      if (antes.nome !== depois.nome) await tx.update(s.entradas).set({ fornecedor: depois.nome }).where(eq(s.entradas.fornecedorId, depois.id));
    },
    emUso: 'Este fornecedor tem compras registradas e não pode ser excluído.',
  },

  funcionarios: {
    table: s.funcionarios, idType: 'int', read: ADMIN, write: ADMIN, remove: ADMIN,
    order: (t) => [asc(t.id)],
    parse: (b) => z.object({
      nome: obrig('o nome do funcionário'), cargo: txt(80), salario: num('Salário'), tel: txt(40),
      diaPag: int('Dia do pagamento', 1, 28),
    }).parse(b),
    toClient: semMeta,
  },

  bancos: {
    table: s.bancos, idType: 'int', read: ADMIN, write: ADMIN, remove: ADMIN,
    order: (t) => [asc(t.id)],
    parse: (b) => z.object({
      instituicao: obrig('o banco'), agencia: txt(20), conta: txt(30), apelido: txt(80),
      ativo: simNao, saldoInicial: numSigned('Saldo inicial'),
    }).parse(b),
    toClient: (r) => ({ ...semMeta(r), ativo: r.ativo ? 'sim' : 'nao' }),
    emUso: 'Esta conta tem movimentações (recebimentos ou pagamentos). Marque como inativa em vez de excluir.',
  },

  veiculos: {
    table: s.veiculos, idType: 'int', read: ADMIN, write: ADMIN, remove: ADMIN,
    order: (t) => [asc(t.id)],
    parse: (b) => z.object({
      placa: z.preprocess((v) => String(v ?? '').toUpperCase().replace(/\s+/g, ''), z.string().min(1, 'Informe a placa.').max(10, 'Placa inválida.')),
      marca: txt(60), modelo: txt(60),
      ano: z.preprocess((v) => (v === '' || v == null ? null : toNum(v)), numero('Ano').int().min(1950, 'Ano inválido.').max(2100, 'Ano inválido.').nullable()),
      ativo: simNao, obs: txt(500),
    }).parse(b),
    toClient: (r) => ({ ...semMeta(r), ativo: r.ativo ? 'sim' : 'nao', ano: r.ano ?? '' }),
  },

  lancamentos: {
    table: s.lancamentos, idType: 'int', read: ADMIN, write: ADMIN, remove: ADMIN,
    order: (t) => [asc(t.data), asc(t.id)],
    parse: (b) => {
      const d = z.object({
        data: dataObrig('a data'),
        categoria: z.enum(LANC_CATS, { error: 'Categoria inválida.' }),
        descricao: txt(300),
        valor: z.preprocess(toNum, numero('Valor').positive('Informe um valor maior que zero.')),
        diarista: txt(120),
        funcionarioId: fk, veiculoId: fk, bancoId: fk,
        pago: z.enum(['Pago', 'Pendente'], { error: 'Situação de pagamento inválida.' }).default('Pago'),
        dataPag: dataOpt('Data do pagamento'),
      }).parse(b);
      if (d.categoria === 'Diária' && !d.diarista) throw new z.ZodError([{ code: 'custom', path: ['diarista'], message: 'Informe o nome do diarista.', input: d.diarista }]);
      if (!VEIC_CATS.includes(d.categoria)) d.veiculoId = null;
      if (d.categoria !== 'Diária') d.diarista = '';
      // pago sem data: considera pago na data do lançamento; pendente não tem data de pagamento
      if (d.pago === 'Pago' && !d.dataPag) d.dataPag = d.data;
      if (d.pago !== 'Pago') d.dataPag = null;
      if (d.dataPag && d.dataPag < d.data) {
        throw new z.ZodError([{ code: 'custom', path: ['dataPag'], message: 'O pagamento não pode ser antes da data do lançamento.', input: d.dataPag }]);
      }
      return d;
    },
    toClient: (r) => ({ ...semMeta(r), funcionarioId: str(r.funcionarioId), veiculoId: str(r.veiculoId), bancoId: str(r.bancoId), dataPag: r.dataPag ?? '' }),
  },

  perdas: {
    table: s.perdas, idType: 'int', read: TODOS, write: TODOS, remove: ADMIN,
    order: (t) => [asc(t.data), asc(t.id)],
    parse: async (b, { db }) => {
      const d = z.object({
        data: dataObrig('a data'), produtoId: fk, nome: txt(120), un: unidade,
        qtd: z.preprocess(toNum, numero('Quantidade').positive('Informe a quantidade perdida.')),
        motivo: txt(60), obs: txt(500),
      }).parse(b);
      if (d.produtoId != null) {
        const [p] = await db.select().from(s.produtos).where(eq(s.produtos.id, d.produtoId)).limit(1);
        if (!p) throw notFound('Produto não encontrado.');
        d.nome = p.nome;
      } else if (!d.nome) {
        throw new z.ZodError([{ code: 'custom', path: ['produtoId'], message: 'Escolha o produto.', input: null }]);
      }
      return d;
    },
    toClient: (r) => ({ ...semMeta(r), produtoId: r.produtoId ?? '' }),
  },

  entradas: {
    table: s.entradas, idType: 'text', read: TODOS, write: TODOS, remove: ADMIN,
    order: (t) => [asc(t.data), asc(t.id)],
    parse: async (b, { db }) => {
      const d = z.object({
        fornecedorId: fk, fornecedor: txt(200), data: dataObrig('a data da coleta'),
        venc: dataOpt('Vencimento'),
        pesoKg: num('Peso'), valor: num('Valor'), perdaKg: num('Perda'),
        motivo: txt(60), pago: z.enum(['Pago', 'Pendente'], { error: 'Situação de pagamento inválida.' }).default('Pendente'),
        dataPag: dataOpt('Data do pagamento'), formaPag: txt(40), bancoId: fk, itens,
      }).parse(b);
      // vínculo com o cadastro: pelo id ou, se vier só o nome, pelo nome
      const [f] = d.fornecedorId != null
        ? await db.select().from(s.fornecedores).where(eq(s.fornecedores.id, d.fornecedorId)).limit(1)
        : d.fornecedor ? await db.select().from(s.fornecedores).where(eq(s.fornecedores.nome, d.fornecedor)).limit(1) : [];
      if (!f) throw erroCampo('fornecedor', d.fornecedor ? 'Fornecedor não encontrado no cadastro.' : 'Informe o fornecedor.');
      const out = { ...(d.itens.length ? { ...d, ...totais(d.itens as s.Item[]) } : d), fornecedorId: f.id, fornecedor: f.nome };
      if (!out.venc) out.venc = addDias(out.data, f.prazo || 0); // vencimento padrão: coleta + prazo do fornecedor
      if (out.pago === 'Pago' && !out.dataPag) out.dataPag = hojeIso();
      if (out.pago !== 'Pago') { out.dataPag = null; out.bancoId = null; }
      if (out.dataPag && out.dataPag < out.data) throw erroCampo('dataPag', 'O pagamento não pode ser antes da coleta.');
      return out;
    },
    toClient: (r) => ({ ...semMeta(r), dataPag: r.dataPag ?? '', venc: r.venc ?? '', bancoId: str(r.bancoId), fornecedorId: r.fornecedorId ?? '' }),
  },

  pedidos: {
    table: s.pedidos, idType: 'text', read: TODOS, write: TODOS, remove: ADMIN,
    order: (t) => [desc(t.dataPedido), desc(t.id)],
    parse: async (b, { user, existing, db }) => {
      const body = { ...(b || {}), dataPag: b?.dataPagIso || b?.dataPag, pag: b?.pag === '—' ? 'Pendente' : b?.pag };
      const d = z.object({
        clienteId: fk, cliente: txt(200), rota: txt(60),
        dataPedido: dataObrig('a data do pedido'), entrega: dataObrig('a data de entrega'),
        pesoKg: num('Peso'), valor: num('Valor'), perdaKg: num('Perda'),
        status: z.enum(['Pendente', 'Em rota', 'Entregue', 'Devolvido', 'Cancelado'], { error: 'Status inválido.' }).default('Pendente'),
        pag: z.enum(['Pago', 'Pendente', 'Atrasado'], { error: 'Situação de pagamento inválida.' }).default('Pendente'),
        venc: dataOpt('Vencimento'), recebDias: int('Dias até receber', 0, 3650),
        motivo: txt(60), dataPag: dataOpt('Data do pagamento'), formaPag: txt(40), bancoId: fk, itens,
      }).parse(body);
      // vínculo com o cadastro: pelo id ou, se vier só o nome, pelo nome
      const [c] = d.clienteId != null
        ? await db.select().from(s.clientes).where(eq(s.clientes.id, d.clienteId)).limit(1)
        : d.cliente ? await db.select().from(s.clientes).where(eq(s.clientes.nome, d.cliente)).limit(1) : [];
      if (!c) throw erroCampo('cliente', d.cliente ? 'Cliente não encontrado no cadastro.' : 'Informe o cliente.');
      const out = { ...(d.itens.length ? { ...d, ...totais(d.itens as s.Item[]) } : d), clienteId: c.id, cliente: c.nome };
      if (!out.rota) out.rota = c.rota;
      // vencimento padrão: entrega + prazo do cliente
      if (!out.venc) out.venc = addDias(out.entrega, c.prazo || 0);
      // funcionário não mexe no financeiro do pedido
      if (user.role !== 'admin') {
        out.pag = existing?.pag ?? 'Pendente';
        out.dataPag = existing?.dataPag ?? null;
        out.formaPag = existing?.formaPag ?? '';
        out.recebDias = existing?.recebDias ?? 0;
        out.bancoId = existing?.bancoId ?? null;
      }
      // "Atrasado" é calculado pelo vencimento; no banco fica Pendente/Pago
      if (out.pag === 'Atrasado') out.pag = 'Pendente';
      if (out.pag === 'Pago' && !out.dataPag) out.dataPag = hojeIso();
      if (out.pag !== 'Pago') { out.dataPag = null; out.bancoId = null; }
      if (out.pag === 'Pago' && out.dataPag) {
        const dias = diasEntre(out.entrega, out.dataPag);
        out.recebDias = dias >= 0 ? Math.max(dias, 1) : 1;
      }
      return out;
    },
    toClient: (r) => ({
      ...semMeta(r), pag: situacaoPedido(r), venc: r.venc ?? '—', dataPagIso: r.dataPag ?? '', dataPag: dm(r.dataPag),
      bancoId: str(r.bancoId), clienteId: r.clienteId ?? '',
    }),
  },
};

export function getResource(name: string): ResourceDef {
  const def = Object.prototype.hasOwnProperty.call(resources, name) ? resources[name] : undefined;
  if (!def) throw notFound('Recurso desconhecido.');
  return def;
}

export function parseId(def: ResourceDef, raw: string): number | string {
  let id = raw;
  try { id = decodeURIComponent(raw); } catch { /* já decodificado */ }
  if (def.idType === 'text') return id;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw notFound();
  return n;
}
