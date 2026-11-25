/**
 * Dinheiro com centavos exatos (usado pelo servidor e pela interface).
 *
 * `Math.round(x * 100) / 100` erra por causa do ponto flutuante:
 * 33,3 kg × R$ 2,15 = 71,595 vira 71,59 (o certo é 71,60). Aqui o arredondamento
 * é feito na representação decimal ("71.595e2" → 7159,5 → 7160 → 71,60).
 */
export function centavos(x: number): number {
  const n = Number(x) || 0;
  return Number(Math.round(Number(Number(n.toPrecision(12)) + 'e2')) + 'e-2');
}

type ItemValor = { kg?: number | string; preco?: number | string };

/** Subtotal de um item (quantidade × preço), arredondado ao centavo. */
export function subtotalItem(i: ItemValor): number {
  return centavos((Number(i.kg) || 0) * (Number(i.preco) || 0));
}

/** Total = soma dos subtotais já arredondados (bate com o que se vê linha a linha). */
export function totalItens(itens: ItemValor[]): number {
  return centavos(itens.reduce((s, i) => s + subtotalItem(i), 0));
}
