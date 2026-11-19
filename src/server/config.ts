/**
 * Configurações da empresa: metas dos indicadores, limites de alerta e listas.
 * Ficam numa linha única (id = 1) da tabela `configuracoes`; o que não foi
 * salvo usa o padrão abaixo (os mesmos números do estudo/design).
 */
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Db } from './db';
import { configuracoes } from './db/schema';

import { CONFIG_PADRAO, type Config } from '../shared/config-padrao';

export { CONFIG_PADRAO, type Config };

const n = (min: number, max: number) => z.coerce.number({ error: 'Número inválido.' }).min(min).max(max);
const metasSchema = z.object({
  perdaMax: n(0, 100), perdaAlerta: n(0, 100), markupMin: n(0, 1000),
  minimercadosMeta: n(0, 100000), minimercadosAlerta: n(0, 100000), minimercadosEquilibrio: n(0, 100000),
  ticketMesMin: n(0, 1e9), ticketMesMax: n(0, 1e9), ticketMesAlerta: n(0, 1e9),
  ticketEntregaMin: n(0, 1e9), ticketEntregaRisco: n(0, 1e9),
  inadMax: n(0, 100), inadAlerta: n(0, 100),
  giroMaxDias: n(0, 365), cicloMaxDias: n(0, 365), cicloAlertaDias: n(0, 365),
  variacaoAlerta: n(0, 1000), variacaoRisco: n(0, 1000), concentracaoMax: n(0, 100),
  cenarioPessimista: n(0, 10), cenarioOtimista: n(0, 10),
}).partial();

export const configSchema = z.object({
  metas: metasSchema.default({}),
  rotas: z.array(z.string().trim().min(1).max(60)).min(1, 'Cadastre ao menos uma rota.').max(100).optional(),
  empresa: z.object({ nome: z.string().trim().min(1, 'Informe o nome da empresa.').max(120) }).partial().optional(),
});

/** Junta o salvo com o padrão (campos novos ganham o valor padrão). */
export function mesclar(salvo: Record<string, unknown> | null | undefined): Config {
  const s = (salvo || {}) as Partial<Config>;
  return {
    metas: { ...CONFIG_PADRAO.metas, ...(s.metas || {}) },
    rotas: Array.isArray(s.rotas) && s.rotas.length ? s.rotas : CONFIG_PADRAO.rotas,
    empresa: { ...CONFIG_PADRAO.empresa, ...(s.empresa || {}) },
  };
}

export async function lerConfig(db: Db): Promise<Config> {
  const [row] = await db.select().from(configuracoes).where(eq(configuracoes.id, 1)).limit(1);
  return mesclar(row?.dados);
}

export async function salvarConfig(db: Db, entrada: unknown, por: string): Promise<{ antes: Config; depois: Config }> {
  const antes = await lerConfig(db);
  const d = configSchema.parse(entrada);
  const depois = mesclar({
    metas: { ...antes.metas, ...d.metas },
    rotas: d.rotas ? [...new Set(d.rotas)] : antes.rotas,
    empresa: { ...antes.empresa, ...(d.empresa || {}) },
  });
  const m = depois.metas;
  const erro = (msg: string) => { throw new z.ZodError([{ code: 'custom', path: ['metas'], message: msg, input: null }]); };
  if (m.perdaAlerta < m.perdaMax) erro('O alerta de perda deve ser maior ou igual à meta de perda.');
  if (m.inadAlerta < m.inadMax) erro('O alerta de inadimplência deve ser maior ou igual à meta.');
  if (m.ticketMesMax < m.ticketMesMin) erro('O ticket mensal máximo deve ser maior ou igual ao mínimo.');
  if (m.ticketEntregaRisco > m.ticketEntregaMin) erro('O ticket de risco por entrega deve ser menor que a meta.');
  if (m.cicloAlertaDias < m.cicloMaxDias) erro('O alerta do ciclo de caixa deve ser maior ou igual à meta.');
  if (m.variacaoRisco < m.variacaoAlerta) erro('A variação de risco deve ser maior ou igual à de alerta.');
  await db.insert(configuracoes).values({ id: 1, dados: depois, atualizadoPor: por })
    .onConflictDoUpdate({ target: configuracoes.id, set: { dados: depois, atualizadoEm: new Date(), atualizadoPor: por } });
  return { antes, depois };
}
