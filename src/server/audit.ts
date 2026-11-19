/**
 * Histórico de alterações. Cada criação/alteração/exclusão feita pela API
 * grava quem fez, quando, o registro e os campos que mudaram.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Db } from './db';
import { auditoria } from './db/schema';
import type { SessionUser } from './session';

const OCULTOS = new Set(['senhaHash', 'criadoEm']);

function limpar(obj: any) {
  if (!obj || typeof obj !== 'object') return obj ?? null;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) if (!OCULTOS.has(k)) out[k] = v instanceof Date ? v.toISOString() : v;
  return out;
}

/** Só os campos que mudaram (para alterações). */
function diferenca(antes: any, depois: any) {
  const a = limpar(antes) || {}, d = limpar(depois) || {};
  const ra: Record<string, unknown> = {}, rd: Record<string, unknown> = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(d)])) {
    if (JSON.stringify(a[k]) !== JSON.stringify(d[k])) { ra[k] = a[k]; rd[k] = d[k]; }
  }
  return { antes: ra, depois: rd };
}

/** Texto curto para a lista do histórico (ex.: "Mercado Bom Preço", "#2050 — R$ 320"). */
function resumoDe(row: any): string {
  if (!row) return '';
  const nome = row.nome || row.instituicao || row.placa || row.fornecedor || row.cliente || row.diarista || row.usuario || row.categoria || '';
  const valor = typeof row.valor === 'number' && row.valor ? ` — R$ ${row.valor.toLocaleString('pt-BR')}` : '';
  return `${nome}${valor}`.slice(0, 200);
}

export async function registrar(
  db: Db, user: SessionUser | null, recurso: string, registroId: string | number,
  acao: 'criou' | 'alterou' | 'excluiu', antes: any, depois: any,
) {
  try {
    const dif = acao === 'alterou' ? diferenca(antes, depois) : { antes: limpar(antes), depois: limpar(depois) };
    if (acao === 'alterou' && Object.keys(dif.antes || {}).length === 0) return; // nada mudou
    await db.insert(auditoria).values({
      userId: user?.id ?? null, userNome: user?.nome ?? 'sistema', recurso, registroId: String(registroId ?? ''),
      acao, resumo: resumoDe(depois || antes), antes: dif.antes, depois: dif.depois,
    });
  } catch (e) {
    // o histórico nunca deve derrubar a operação principal
    console.error('[auditoria]', e);
  }
}
