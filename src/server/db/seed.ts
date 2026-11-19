/**
 * Dados iniciais.
 * - `ensureDefaultUsers`: cria os usuários admin/funcionario se não houver nenhum.
 * - `seedDemo`: carrega os dados de exemplo do design (só em banco vazio).
 */
import { count, sql } from 'drizzle-orm';
import type { Db } from './index';
import * as s from './schema';
import { hashPassword } from '../password';

export async function ensureDefaultUsers(db: Db, log = false) {
  const [{ n }] = await db.select({ n: count() }).from(s.users);
  if (n > 0) return false;
  const adminPass = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const funcPass = process.env.SEED_FUNC_PASSWORD || 'func123';
  await db.insert(s.users).values([
    { nome: 'Administrador', usuario: 'admin', senhaHash: await hashPassword(adminPass), role: 'admin' },
    { nome: 'Funcionário', usuario: 'funcionario', senhaHash: await hashPassword(funcPass), role: 'colaborador' },
  ]);
  if (log) console.log('usuários criados: admin / funcionario (troque as senhas!)');
  return true;
}

export async function seedDemo(db: Db) {
  const [{ n }] = await db.select({ n: count() }).from(s.clientes);
  if (n > 0) {
    console.log('banco já tem dados — demo não carregada');
    return false;
  }
  await db.transaction(async (tx) => {
    await tx.insert(s.clientes).values([
      { nome: 'Mercado Bom Preço', resp: 'Sônia Alves', cnpj: '12.345.678/0001-90', tel: '(41) 99812-3344', email: 'compras@bompreco.com.br', endereco: 'R. das Flores, 210 — Boqueirão, Curitiba/PR', rota: 'Sul A', freq: '2×/sem · Seg e Qui', status: 'ativo', forma: 'PIX', limite: 6000, prazo: 14, tend: '↑', obs: 'Cliente fiel, volume crescendo há 3 meses. Avaliar aumento de limite.' },
      { nome: 'Minimercado Vila Nova', resp: 'Carlos Teixeira', cnpj: '23.456.789/0001-01', tel: '(41) 99765-1122', endereco: 'Av. Vila Nova, 89 — Pinheirinho, Curitiba/PR', rota: 'Sul A', freq: '2×/sem · Seg e Qui', status: 'ativo', forma: 'Boleto', limite: 5000, prazo: 14, tend: '→', obs: 'Estável e pontual. Bom candidato para testar itens premium.' },
      { nome: 'Empório da Esquina', resp: 'Renata Lima', cnpj: '34.567.890/0001-12', tel: '(41) 99654-7788', endereco: 'R. XV de Outubro, 540 — Cristo Rei, Curitiba/PR', rota: 'Leste B', freq: '1×/sem · Qua', status: 'negociacao', forma: 'PIX', limite: 3000, prazo: 7, tend: '→', obs: 'Em negociação para subir para 2×/semana.' },
      { nome: 'Mini Atacado Real', resp: 'Fábio Nunes', cnpj: '89.012.345/0001-67', tel: '(41) 99109-5577', endereco: 'Av. Industrial, 980 — CIC, Curitiba/PR', rota: 'Norte C', freq: '2×/sem · Ter e Sex', status: 'ativo', forma: 'PIX', limite: 7000, prazo: 21, tend: '↑', obs: 'Maior cliente da carteira. Excelente histórico de pagamento.' },
      { nome: 'Mercearia Santa Rita', resp: 'Pedro Gomes', cnpj: '56.789.012/0001-34', tel: '(41) 99432-5566', endereco: 'R. Santa Rita, 77 — Portão, Curitiba/PR', rota: 'Oeste D', freq: '2×/sem · Seg e Qui', status: 'ativo', cobranca: 'Atrasado', forma: 'Boleto', limite: 4500, prazo: 14, tend: '↓', obs: 'Um atraso este mês. Acompanhar o próximo vencimento de perto.' },
      { nome: 'Mercado Central', resp: 'Lúcia Prado', cnpj: '90.123.456/0001-78', tel: '(41) 99098-6611', endereco: 'R. Marechal, 450 — Centro, Curitiba/PR', rota: 'Oeste D', freq: '2×/sem · Seg e Qui', status: 'ativo', forma: 'PIX', limite: 5000, prazo: 14, tend: '→', obs: 'Constante, sem ocorrências relevantes.' },
      { nome: 'Quitanda do Zé', resp: 'José Martins', cnpj: '78.901.234/0001-56', tel: '(41) 99210-3434', endereco: 'R. das Hortênsias, 15 — Cajuru, Curitiba/PR', rota: 'Leste B', freq: '1×/sem · Qua', status: 'inadimplente', cobranca: 'Em cobrança', forma: 'Dinheiro', limite: 2500, prazo: 7, tend: '↓', obs: 'Ticket baixo e atrasos recorrentes. Reavaliar atendimento da rota.' },
    ]);

    const prods = await tx.insert(s.produtos).values([
      { nome: 'Batata', un: 'KG' }, { nome: 'Cebola', un: 'KG' }, { nome: 'Tomate', un: 'CX' },
      { nome: 'Alface', un: 'CX' }, { nome: 'Banana', un: 'KG' }, { nome: 'Maçã', un: 'CX' },
    ]).returning({ id: s.produtos.id, nome: s.produtos.nome, un: s.produtos.un });
    const P = (nome: string) => prods.find((p) => p.nome === nome)!;
    const it = (nome: string, kg: number, preco: number, perdaKg = 0): s.Item =>
      ({ produtoId: P(nome).id, nome, un: P(nome).un, kg, preco, perdaKg });

    await tx.insert(s.fornecedores).values([
      { nome: 'Fazenda Boa Terra', regiao: 'Londrina — Norte do PR', contato: '(43) 99811-2020', produtos: ['Batata', 'Cebola'] },
      { nome: 'Sítio Recanto Verde', regiao: 'Maringá — Norte do PR', contato: '(44) 99722-3131', produtos: ['Alface', 'Tomate'] },
      { nome: 'Cooperativa Norte PR', regiao: 'Apucarana — Norte do PR', contato: '(43) 99633-4242', produtos: ['Banana', 'Maçã'] },
    ]);

    await tx.insert(s.entradas).values([
      { id: 'C-1040', fornecedor: 'Fazenda Boa Terra', data: '2026-06-08', pesoKg: 2250, valor: 4350, perdaKg: 140, motivo: 'transporte', pago: 'Pago', dataPag: '2026-06-10', formaPag: 'PIX', itens: [it('Batata', 1500, 1.85, 85), it('Cebola', 750, 2.10, 55)] },
      { id: 'C-1041', fornecedor: 'Sítio Recanto Verde', data: '2026-06-11', pesoKg: 135, valor: 4275, perdaKg: 9, motivo: 'armazenagem', pago: 'Pago', dataPag: '2026-06-13', formaPag: 'Boleto', itens: [it('Alface', 90, 25, 6), it('Tomate', 45, 45, 3)] },
      { id: 'C-1042', fornecedor: 'Cooperativa Norte PR', data: '2026-06-15', pesoKg: 636, valor: 3168, perdaKg: 36, motivo: 'vencimento', pago: 'Pago', dataPag: '2026-06-18', formaPag: 'PIX', itens: [it('Banana', 600, 2.40, 34), it('Maçã', 36, 48, 2)] },
      { id: 'C-1043', fornecedor: 'Fazenda Boa Terra', data: '2026-06-22', pesoKg: 1350, valor: 2610, perdaKg: 76, motivo: 'manuseio', pago: 'Pago', dataPag: '2026-06-24', formaPag: 'PIX', itens: [it('Batata', 900, 1.85, 48), it('Cebola', 450, 2.10, 28)] },
      { id: 'C-1044', fornecedor: 'Sítio Recanto Verde', data: '2026-06-25', pesoKg: 111, valor: 3606, perdaKg: 8, motivo: 'transporte', pago: 'Pendente', formaPag: 'PIX', itens: [it('Alface', 75, 26, 5), it('Tomate', 36, 46, 3)] },
      { id: 'C-1045', fornecedor: 'Cooperativa Norte PR', data: '2026-06-27', pesoKg: 504, valor: 2352, perdaKg: 27, motivo: 'armazenagem', pago: 'Pendente', formaPag: 'Boleto', itens: [it('Banana', 480, 2.45, 26), it('Maçã', 24, 49, 1)] },
    ]);
    await tx.execute(sql`select setval('entrada_codigo_seq', 1045)`);

    await tx.insert(s.pedidos).values([
      { id: '#2041', cliente: 'Mercado Bom Preço', rota: 'Sul A', dataPedido: '2026-06-09', entrega: '2026-06-10', pesoKg: 510, valor: 3960, status: 'Entregue', pag: 'Pago', recebDias: 2, dataPag: '2026-06-12', formaPag: 'PIX', itens: [it('Batata', 450, 3.20), it('Alface', 60, 42)] },
      { id: '#2042', cliente: 'Mini Atacado Real', rota: 'Norte C', dataPedido: '2026-06-11', entrega: '2026-06-12', pesoKg: 930, valor: 5160, status: 'Entregue', pag: 'Pago', recebDias: 3, dataPag: '2026-06-15', formaPag: 'Boleto', itens: [it('Batata', 600, 3.20), it('Cebola', 300, 3.60), it('Tomate', 30, 72)] },
      { id: '#2043', cliente: 'Minimercado Vila Nova', rota: 'Sul A', dataPedido: '2026-06-15', entrega: '2026-06-16', pesoKg: 570, valor: 4554, status: 'Entregue', pag: 'Pago', recebDias: 2, dataPag: '2026-06-18', formaPag: 'PIX', itens: [it('Banana', 540, 4.10), it('Maçã', 30, 78)] },
      { id: '#2044', cliente: 'Mercado Central', rota: 'Oeste D', dataPedido: '2026-06-17', entrega: '2026-06-18', pesoKg: 672, valor: 3125, status: 'Entregue', pag: 'Pago', recebDias: 4, dataPag: '2026-06-22', formaPag: 'Boleto', itens: [it('Batata', 540, 3.20), it('Cebola', 108, 3.60), it('Alface', 24, 42)] },
      { id: '#2045', cliente: 'Mercearia Santa Rita', rota: 'Oeste D', dataPedido: '2026-06-22', entrega: '2026-06-23', pesoKg: 384, valor: 3348, status: 'Entregue', pag: 'Atrasado', venc: '2026-07-07', itens: [it('Banana', 360, 4.10), it('Maçã', 24, 78)] },
      { id: '#2046', cliente: 'Empório da Esquina', rota: 'Leste B', dataPedido: '2026-06-24', entrega: '2026-06-25', pesoKg: 285, valor: 2754, status: 'Entregue', pag: 'Pago', recebDias: 5, dataPag: '2026-06-30', formaPag: 'PIX', itens: [it('Alface', 45, 42), it('Cebola', 240, 3.60)] },
      { id: '#2047', cliente: 'Quitanda do Zé', rota: 'Leste B', dataPedido: '2026-06-24', entrega: '2026-06-25', pesoKg: 108, valor: 443, status: 'Entregue', pag: 'Atrasado', venc: '2026-07-01', itens: [it('Banana', 108, 4.10)] },
      { id: '#2048', cliente: 'Mercado Bom Preço', rota: 'Sul A', dataPedido: '2026-06-26', entrega: '2026-06-27', pesoKg: 636, valor: 4512, status: 'Entregue', pag: 'Pago', recebDias: 3, dataPag: '2026-06-30', formaPag: 'PIX', itens: [it('Batata', 600, 3.20), it('Tomate', 36, 72)] },
      { id: '#2049', cliente: 'Mini Atacado Real', rota: 'Norte C', dataPedido: '2026-06-27', entrega: '2026-06-28', pesoKg: 471, valor: 2502, status: 'Em rota', pag: 'Pendente', venc: '2026-07-19', itens: [it('Cebola', 450, 3.60), it('Alface', 21, 42)] },
    ]);
    await tx.execute(sql`select setval('pedido_codigo_seq', 2049)`);
    // vínculos com os cadastros e vencimentos (as mesmas regras da API)
    await tx.execute(sql`update pedidos p set cliente_id = c.id from clientes c where c.nome = p.cliente`);
    await tx.execute(sql`update entradas e set fornecedor_id = f.id from fornecedores f where f.nome = e.fornecedor`);
    await tx.execute(sql`update pedidos p set venc = p.entrega + c.prazo from clientes c where c.id = p.cliente_id and p.venc is null`);
    await tx.execute(sql`update entradas set venc = data where venc is null`);

    await tx.insert(s.perdas).values([
      { data: '2026-06-19', produtoId: P('Alface').id, nome: 'Alface', un: 'CX', qtd: 4, motivo: 'vencimento', obs: 'Sobra da rota Leste que não vendeu' },
      { data: '2026-06-26', produtoId: P('Tomate').id, nome: 'Tomate', un: 'CX', qtd: 3, motivo: 'armazenagem', obs: 'Caixa amassada no empilhamento' },
    ]);

    const funcs = await tx.insert(s.funcionarios).values([
      { nome: 'João Pereira', cargo: 'Motorista', salario: 2200, tel: '(41) 99900-1122', diaPag: 5 },
      { nome: 'Maria Souza', cargo: 'Auxiliar de depósito', salario: 1800, tel: '(41) 99911-3344', diaPag: 5 },
    ]).returning({ id: s.funcionarios.id });
    const bks = await tx.insert(s.bancos).values([
      { instituicao: 'Sicredi', agencia: '0718', conta: '45120-3', apelido: 'Conta principal', saldoInicial: 8200 },
      { instituicao: 'Caixa Econômica Federal', agencia: '1532', conta: '00987-1', apelido: 'Folha de pagamento', saldoInicial: 3500 },
      { instituicao: 'XP Investimentos', agencia: '0001', conta: '3349821-0', apelido: 'Reserva', saldoInicial: 12000 },
    ]).returning({ id: s.bancos.id });
    const vcs = await tx.insert(s.veiculos).values([
      { placa: 'BRA2E19', marca: 'Fiat', modelo: 'Fiorino', ano: 2021, obs: 'Entregas urbanas' },
      { placa: 'QTX4B71', marca: 'Mercedes', modelo: 'Accelo 815', ano: 2018, obs: 'Coleta no Norte do PR' },
      { placa: 'AKD8C02', marca: 'VW', modelo: 'Saveiro', ano: 2014, ativo: false },
    ]).returning({ id: s.veiculos.id });

    const L = (data: string, categoria: string, descricao: string, valor: number, ref: { f?: number; v?: number; b?: number; diarista?: string; aPagar?: boolean } = {}) => ({
      data, categoria, descricao, valor, diarista: ref.diarista ?? '',
      funcionarioId: ref.f ? funcs[ref.f - 1].id : null,
      veiculoId: ref.v ? vcs[ref.v - 1].id : null,
      bancoId: ref.b ? bks[ref.b - 1].id : null,
      pago: (ref.aPagar ? 'Pendente' : 'Pago') as 'Pago' | 'Pendente',
      dataPag: ref.aPagar ? null : data,
    });
    await tx.insert(s.lancamentos).values([
      L('2026-06-08', 'Frete', 'Coleta Norte PR → Curitiba', 1280),
      L('2026-06-11', 'Gasolina', 'Entregas urbanas da semana', 620),
      L('2026-06-15', 'Adiantamento de salário', 'Adiantamento da quinzena', 700, { f: 2 }),
      L('2026-06-18', 'Manutenção dos Carros', 'Troca de óleo e filtro do caminhão', 480),
      L('2026-06-20', 'Simples Nacional', 'Guia de junho (4% s/ receita)', 1114),
      L('2026-06-25', 'Vale-transporte', 'Recarga dos cartões', 320),
      L('2026-06-30', 'Salário', 'Folha de junho (saldo)', 1100, { f: 2 }),
      L('2026-06-05', 'Gasolina', 'Tanque cheio', 310, { v: 1 }),
      L('2026-06-14', 'Gasolina', 'Diesel — coleta Norte PR', 890, { v: 2 }),
      L('2026-06-20', 'Manutenção dos Carros', 'Troca de óleo e filtros', 540, { v: 2 }),
      L('2026-07-02', 'Multa', 'Estacionamento em local proibido', 195, { v: 1 }),
      L('2026-07-09', 'Gasolina', 'Tanque cheio', 325, { v: 1 }),
      L('2026-11-03', 'Diária', 'Descarga do caminhão da CEASA', 120, { diarista: 'João Pereira', b: 1 }),
      L('2026-11-08', 'Diária', 'Separação de pedidos', 110, { diarista: 'Carla Mendes', b: 1 }),
      L('2026-11-14', 'Diária', 'Descarga do caminhão da CEASA', 120, { diarista: 'João Pereira', b: 2 }),
      L('2026-11-15', 'Diária', 'Entregas de sábado', 150, { diarista: 'Rafael Souza', aPagar: true }),
    ]);
  });
  console.log('dados de demonstração carregados');
  return true;
}
