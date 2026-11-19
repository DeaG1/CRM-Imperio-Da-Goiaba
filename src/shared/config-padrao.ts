/** Metas, limites e listas padrão (usado pelo servidor e pela interface). */
export const CONFIG_PADRAO = {
  metas: {
    perdaMax: 10, // % — na meta até aqui
    perdaAlerta: 15, // % — amarelo até aqui; acima, vermelho
    markupMin: 60, // %
    minimercadosMeta: 35,
    minimercadosAlerta: 25,
    minimercadosEquilibrio: 20, // ponto de equilíbrio
    ticketMesMin: 3500, // R$ por minimercado/mês (meta: mín–máx)
    ticketMesMax: 3800,
    ticketMesAlerta: 3000,
    ticketEntregaMin: 430, // R$ por entrega
    ticketEntregaRisco: 150,
    inadMax: 1, // %
    inadAlerta: 2,
    giroMaxDias: 4,
    cicloMaxDias: 13,
    cicloAlertaDias: 16,
    variacaoAlerta: 4, // % de variação de preço de compra
    variacaoRisco: 7,
    concentracaoMax: 15, // % do faturamento num cliente só
    cenarioPessimista: 0.55, // multiplicadores do lucro nos cenários
    cenarioOtimista: 1.5,
  },
  rotas: ['Sul A', 'Leste B', 'Norte C', 'Oeste D'],
  empresa: { nome: 'Império da Goiaba' },
};
export type Config = typeof CONFIG_PADRAO;
export type Metas = Config['metas'];
