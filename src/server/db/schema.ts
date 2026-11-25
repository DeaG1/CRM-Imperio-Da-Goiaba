/**
 * Schema do banco (PostgreSQL) — uma tabela por coleção do design.
 *
 * Os nomes e formatos acompanham o que a interface usa (ex.: pedido.cliente e
 * entrada.fornecedor guardam o NOME, como no protótipo; ids de pedido/entrada
 * são códigos "#2041" / "C-1040" gerados por sequência).
 */
import { sql } from 'drizzle-orm';
import {
  boolean, date, index, integer, jsonb, numeric, pgSequence, pgTable, serial, text, timestamp,
} from 'drizzle-orm/pg-core';

const money = (name: string) => numeric(name, { precision: 14, scale: 2, mode: 'number' });
const qty = (name: string) => numeric(name, { precision: 14, scale: 3, mode: 'number' });
const dia = (name: string) => date(name, { mode: 'string' });
const criadoEm = () => timestamp('criado_em', { withTimezone: true }).notNull().defaultNow();

export type Item = {
  produtoId: number | null;
  nome: string;
  un: string;
  kg: number;
  preco: number;
  perdaKg: number;
};

// ------------------------------------------------------------------ acesso
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  usuario: text('usuario').notNull().unique(),
  senhaHash: text('senha_hash').notNull(),
  role: text('role', { enum: ['admin', 'colaborador'] }).notNull().default('colaborador'),
  ativo: boolean('ativo').notNull().default(true),
  criadoEm: criadoEm(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(), // sha-256 do token do cookie
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiraEm: timestamp('expira_em', { withTimezone: true }).notNull(),
  criadoEm: criadoEm(),
}, (t) => [index('sessions_user_idx').on(t.userId)]);

/** Tentativas de login erradas por usuário (bloqueio temporário, vale para todas as instâncias). */
export const loginFalhas = pgTable('login_falhas', {
  usuario: text('usuario').primaryKey(),
  falhas: integer('falhas').notNull().default(0),
  desde: timestamp('desde', { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------------------------------------------ cadastros
export const clientes = pgTable('clientes', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  resp: text('resp').notNull().default(''),
  cnpj: text('cnpj').notNull().default(''),
  tel: text('tel').notNull().default(''),
  email: text('email').notNull().default(''),
  endereco: text('endereco').notNull().default(''),
  rota: text('rota').notNull().default('Sul A'),
  freq: text('freq').notNull().default(''),
  status: text('status', { enum: ['ativo', 'negociacao', 'inadimplente', 'inativo'] }).notNull().default('ativo'),
  cobranca: text('cobranca').notNull().default('Em dia'),
  forma: text('forma').notNull().default('PIX'),
  limite: money('limite').notNull().default(0),
  prazo: integer('prazo').notNull().default(14),
  tend: text('tend').notNull().default('→'),
  ult: text('ult').notNull().default('—'),
  obs: text('obs').notNull().default(''),
  criadoEm: criadoEm(),
});

export const produtos = pgTable('produtos', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  un: text('un').notNull().default('KG'),
  compra: money('compra'), // preço de referência (usado quando não há compras)
  venda: money('venda'),
  criadoEm: criadoEm(),
});

export const fornecedores = pgTable('fornecedores', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  regiao: text('regiao').notNull().default(''),
  contato: text('contato').notNull().default(''),
  prazo: integer('prazo').notNull().default(0), // dias para pagar o produtor (vencimento da compra)
  produtos: jsonb('produtos').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  criadoEm: criadoEm(),
});

export const funcionarios = pgTable('funcionarios', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  cargo: text('cargo').notNull().default(''),
  salario: money('salario').notNull().default(0),
  tel: text('tel').notNull().default(''),
  diaPag: integer('dia_pag').notNull().default(5),
  criadoEm: criadoEm(),
});

export const bancos = pgTable('bancos', {
  id: serial('id').primaryKey(),
  instituicao: text('instituicao').notNull(),
  agencia: text('agencia').notNull().default(''),
  conta: text('conta').notNull().default(''),
  apelido: text('apelido').notNull().default(''),
  ativo: boolean('ativo').notNull().default(true),
  saldoInicial: money('saldo_inicial').notNull().default(0),
  criadoEm: criadoEm(),
});

export const veiculos = pgTable('veiculos', {
  id: serial('id').primaryKey(),
  placa: text('placa').notNull(),
  marca: text('marca').notNull().default(''),
  modelo: text('modelo').notNull().default(''),
  ano: integer('ano'),
  ativo: boolean('ativo').notNull().default(true),
  obs: text('obs').notNull().default(''),
  criadoEm: criadoEm(),
});

export const TIPOS_INTERACAO = ['Visita comercial', 'Ligação', 'Ligação de cobrança', 'WhatsApp', 'E-mail', 'Reclamação', 'Outro'] as const;

/** Histórico de contato com o cliente (ficha do cliente). */
export const interacoes = pgTable('interacoes', {
  id: serial('id').primaryKey(),
  clienteId: integer('cliente_id').notNull().references(() => clientes.id, { onDelete: 'cascade' }),
  data: dia('data').notNull(),
  tipo: text('tipo', { enum: TIPOS_INTERACAO }).notNull(),
  texto: text('texto').notNull().default(''),
  autorId: integer('autor_id').references(() => users.id, { onDelete: 'set null' }),
  autorNome: text('autor_nome').notNull().default(''),
  criadoEm: criadoEm(),
}, (t) => [index('interacoes_cliente_idx').on(t.clienteId)]);

// ------------------------------------------------------------------ movimento
export const entradaSeq = pgSequence('entrada_codigo_seq', { startWith: 1040 });
export const pedidoSeq = pgSequence('pedido_codigo_seq', { startWith: 2041 });

/** Entradas = compras/coletas dos fornecedores. */
export const entradas = pgTable('entradas', {
  id: text('id').primaryKey().default(sql`'C-' || nextval('entrada_codigo_seq')`),
  // nome mantido em sincronia com o cadastro (renomear o fornecedor atualiza aqui)
  fornecedorId: integer('fornecedor_id').references(() => fornecedores.id, { onDelete: 'restrict' }),
  fornecedor: text('fornecedor').notNull(),
  data: dia('data').notNull(),
  venc: dia('venc'), // vencimento do pagamento ao produtor
  pesoKg: qty('peso_kg').notNull().default(0),
  // valor = total A PAGAR ao produtor = soma dos itens − desconto
  valor: money('valor').notNull().default(0),
  // desconto na compra (ex.: R$ 2,00 por caixa quando o caminhão da empresa busca a fruta)
  desconto: money('desconto').notNull().default(0),
  perdaKg: qty('perda_kg').notNull().default(0),
  motivo: text('motivo').notNull().default('—'),
  pago: text('pago', { enum: ['Pago', 'Pendente'] }).notNull().default('Pendente'),
  dataPag: dia('data_pag'),
  formaPag: text('forma_pag').notNull().default('PIX'),
  bancoId: integer('banco_id').references(() => bancos.id, { onDelete: 'restrict' }), // conta que pagou (null = caixa)
  itens: jsonb('itens').$type<Item[]>().notNull().default(sql`'[]'::jsonb`),
  criadoEm: criadoEm(),
}, (t) => [index('entradas_data_idx').on(t.data)]);

/** Pedidos = saídas/vendas aos minimercados. */
export const pedidos = pgTable('pedidos', {
  id: text('id').primaryKey().default(sql`'#' || nextval('pedido_codigo_seq')`),
  // nome mantido em sincronia com o cadastro (renomear o cliente atualiza aqui)
  clienteId: integer('cliente_id').references(() => clientes.id, { onDelete: 'restrict' }),
  cliente: text('cliente').notNull(),
  rota: text('rota').notNull().default(''),
  dataPedido: dia('data_pedido').notNull(),
  entrega: dia('entrega').notNull(),
  pesoKg: qty('peso_kg').notNull().default(0),
  valor: money('valor').notNull().default(0),
  status: text('status', { enum: ['Pendente', 'Em rota', 'Entregue', 'Devolvido', 'Cancelado'] }).notNull().default('Pendente'),
  pag: text('pag', { enum: ['Pago', 'Pendente', 'Atrasado'] }).notNull().default('Pendente'),
  venc: dia('venc'),
  recebDias: integer('receb_dias').notNull().default(0),
  perdaKg: qty('perda_kg').notNull().default(0),
  motivo: text('motivo').notNull().default('—'),
  dataPag: dia('data_pag'),
  formaPag: text('forma_pag').notNull().default(''),
  bancoId: integer('banco_id').references(() => bancos.id, { onDelete: 'restrict' }), // conta que recebeu (null = caixa)
  itens: jsonb('itens').$type<Item[]>().notNull().default(sql`'[]'::jsonb`),
  criadoEm: criadoEm(),
}, (t) => [index('pedidos_entrega_idx').on(t.entrega), index('pedidos_cliente_idx').on(t.cliente)]);

/** Perdas lançadas no depósito (fora da coleta). */
export const perdas = pgTable('perdas', {
  id: serial('id').primaryKey(),
  data: dia('data').notNull(),
  produtoId: integer('produto_id').references(() => produtos.id, { onDelete: 'set null' }),
  nome: text('nome').notNull().default(''),
  un: text('un').notNull().default('KG'),
  qtd: qty('qtd').notNull().default(0),
  motivo: text('motivo').notNull().default('armazenagem'),
  obs: text('obs').notNull().default(''),
  criadoEm: criadoEm(),
});

/** Lançamentos de custo (diárias, frete, combustível, salários, impostos…). */
export const lancamentos = pgTable('lancamentos', {
  id: serial('id').primaryKey(),
  data: dia('data').notNull(),
  categoria: text('categoria').notNull(),
  descricao: text('descricao').notNull().default(''),
  valor: money('valor').notNull().default(0),
  diarista: text('diarista').notNull().default(''),
  funcionarioId: integer('funcionario_id').references(() => funcionarios.id, { onDelete: 'set null' }),
  veiculoId: integer('veiculo_id').references(() => veiculos.id, { onDelete: 'set null' }),
  bancoId: integer('banco_id').references(() => bancos.id, { onDelete: 'restrict' }),
  // contas a pagar: 'Pendente' é custo do período mas ainda não saiu do caixa/banco
  pago: text('pago', { enum: ['Pago', 'Pendente'] }).notNull().default('Pago'),
  dataPag: dia('data_pag'),
  criadoEm: criadoEm(),
}, (t) => [index('lancamentos_data_idx').on(t.data)]);

// ------------------------------------------------------------------ sistema
/** Configurações da empresa (linha única, id = 1): metas, limites e listas. */
export const configuracoes = pgTable('configuracoes', {
  id: integer('id').primaryKey(),
  dados: jsonb('dados').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).notNull().defaultNow(),
  atualizadoPor: text('atualizado_por').notNull().default(''),
});

/** Histórico de alterações: quem criou/alterou/excluiu o quê e quando. */
export const auditoria = pgTable('auditoria', {
  id: serial('id').primaryKey(),
  quando: timestamp('quando', { withTimezone: true }).notNull().defaultNow(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  userNome: text('user_nome').notNull().default(''),
  recurso: text('recurso').notNull(),
  registroId: text('registro_id').notNull().default(''),
  acao: text('acao', { enum: ['criou', 'alterou', 'excluiu'] }).notNull(),
  resumo: text('resumo').notNull().default(''),
  antes: jsonb('antes'),
  depois: jsonb('depois'),
}, (t) => [index('auditoria_quando_idx').on(t.quando), index('auditoria_registro_idx').on(t.recurso, t.registroId)]);
