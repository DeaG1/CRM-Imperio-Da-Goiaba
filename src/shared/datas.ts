/** Fuso da operação. O servidor (Cloudflare) roda em UTC; as datas do negócio são de Brasília. */
export const FUSO = 'America/Sao_Paulo';

const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' });

/** Data de hoje (aaaa-mm-dd) no fuso de Brasília, independente do relógio do servidor. */
export function hojeBR(agora: Date = new Date()): string {
  return fmt.format(agora); // en-CA já formata como aaaa-mm-dd
}
