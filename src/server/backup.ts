/**
 * Backup completo em JSON (funciona igual no PGlite e no PostgreSQL).
 * - exportar: todas as tabelas (menos sessões), em ordem de dependência.
 * - importar: APAGA os dados atuais e grava os do arquivo, numa transação.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import type { Db } from './db';
import * as s from './db/schema';

// ordem de inserção (quem é referenciado vem antes)
const TABELAS: [string, PgTable, string][] = [
  ['users', s.users, 'users'],
  ['clientes', s.clientes, 'clientes'],
  ['produtos', s.produtos, 'produtos'],
  ['fornecedores', s.fornecedores, 'fornecedores'],
  ['funcionarios', s.funcionarios, 'funcionarios'],
  ['bancos', s.bancos, 'bancos'],
  ['veiculos', s.veiculos, 'veiculos'],
  ['entradas', s.entradas, 'entradas'],
  ['pedidos', s.pedidos, 'pedidos'],
  ['perdas', s.perdas, 'perdas'],
  ['lancamentos', s.lancamentos, 'lancamentos'],
  ['interacoes', s.interacoes, 'interacoes'],
  ['configuracoes', s.configuracoes, 'configuracoes'],
  ['auditoria', s.auditoria, 'auditoria'],
];
const SERIAIS = ['users', 'clientes', 'produtos', 'fornecedores', 'funcionarios', 'bancos', 'veiculos', 'perdas', 'lancamentos', 'interacoes', 'auditoria'];
const CAMPOS_DATA_HORA = new Set(['criadoEm', 'quando', 'atualizadoEm', 'expiraEm']);

export const VERSAO_BACKUP = 1;

export async function exportar(db: Db) {
  const tabelas: Record<string, unknown[]> = {};
  for (const [nome, t] of TABELAS) tabelas[nome] = await db.select().from(t as any);
  return { app: 'imperio-crm', versao: VERSAO_BACKUP, geradoEm: new Date().toISOString(), tabelas };
}

export async function importar(db: Db, backup: any) {
  if (!backup || backup.app !== 'imperio-crm' || !backup.tabelas) throw new Error('Arquivo de backup inválido.');
  if (backup.versao > VERSAO_BACKUP) throw new Error('Backup gerado por uma versão mais nova do sistema.');
  if (!Array.isArray(backup.tabelas.users) || !backup.tabelas.users.length) throw new Error('O backup não tem usuários — restaurar deixaria o sistema sem acesso.');
  const resumo: Record<string, number> = {};
  await db.transaction(async (tx) => {
    await tx.delete(s.sessions);
    for (const [, t] of [...TABELAS].reverse()) await tx.delete(t as any);
    for (const [nome, t] of TABELAS) {
      const linhas = (backup.tabelas[nome] || []).map((r: any) => {
        const o = { ...r };
        for (const k of Object.keys(o)) if (CAMPOS_DATA_HORA.has(k) && o[k] != null) o[k] = new Date(o[k]);
        return o;
      });
      for (let i = 0; i < linhas.length; i += 500) await tx.insert(t as any).values(linhas.slice(i, i + 500));
      resumo[nome] = linhas.length;
    }
    // sequências continuam depois do maior id restaurado
    for (const nome of SERIAIS) {
      await tx.execute(sql.raw(`select setval(pg_get_serial_sequence('"${nome}"', 'id'), coalesce((select max(id) from "${nome}"), 0) + 1, false)`));
    }
    await tx.execute(sql`select setval('entrada_codigo_seq', greatest(1039, coalesce((select max(substring(id from '[0-9]+')::int) from entradas), 1039)))`);
    await tx.execute(sql`select setval('pedido_codigo_seq', greatest(2040, coalesce((select max(substring(id from '[0-9]+')::int) from pedidos), 2040)))`);
  });
  return resumo;
}
