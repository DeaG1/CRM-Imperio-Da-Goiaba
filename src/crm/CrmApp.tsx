'use client';

/**
 * Lógica do CRM Império da Goiaba — portada do design
 * "Imperio da Goiaba CRM v2.dc.html" (bloco <script type="text/x-dc">).
 *
 * Mantém o mesmo estado, as mesmas regras de negócio e a mesma persistência
 * em localStorage do protótipo. `renderVals()` calcula tudo o que as telas
 * exibem; os componentes em ./screens, ./modals e ./layout só desenham.
 */
import { Component } from 'react';
import { AppView } from './AppView';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class CrmApp extends Component<Record<string, never>, any> {
  /** Dados do CSV do relatório ativo (preenchido em renderVals). */
  _csv: any = null;

  state = {
    logged: false, loginRole: 'admin', loginPass: '', loginErr: '',
    screen: 'dashboard', clienteView: 'list', clienteId: 1, periodo: 'all', role: 'admin', relView: 'clientes',
    modal: null, draft: null, isEditing: false, funcAberto: null, veicAberto: null,
    bancos: this._load('crm_hf_bancos_d1', () => this.seedBancos(), a => Array.isArray(a)).map(b => b.saldoInicial == null ? { ...b, saldoInicial: (this.seedBancos().find(s=>s.id===b.id && s.instituicao===b.instituicao)||{saldoInicial:0}).saldoInicial } : b),
    veiculos: this._load('crm_hf_veic_d1', () => this.seedVeiculos(), a => Array.isArray(a)),
    clientes: this._load('crm_hf_clientes_d3', () => this.seedClientes(), a => Array.isArray(a)),
    pedidos: this._load('crm_hf_pedidos_d2', () => this.seedPedidos(), a => Array.isArray(a)),
    fornecedores: this._load('crm_hf_fornec_d2', () => this.seedFornecedores(), a => Array.isArray(a)),
    produtos: this._load('crm_hf_produtos_d3', () => this.seedProdutos(), a => Array.isArray(a)),
    lancamentos: (() => { const a = this._load('crm_hf_lanc_d3', () => this.seedLancamentos(), x => Array.isArray(x)); const ids = new Set(a.map(x => x.id)); return a.concat(this.seedLancamentos().filter(x => (x.veiculoId || x.categoria==='Diária') && !ids.has(x.id))); })(),
    funcionarios: this._load('crm_hf_func_d2', () => this.seedFuncionarios(), a => Array.isArray(a)),
    perdas: this._load('crm_hf_perdas_d1', () => this.seedPerdas(), a => Array.isArray(a)),
    entradas: this._load('crm_hf_entradas_d2', () => this.seedEntradas(), a => Array.isArray(a))
  };

  GREEN = '#2e8b4a'; AMBER = '#c79320'; RED = '#d6334a';
  GBG = '#e7f1e8'; ABG = '#f6efd8'; RBG = '#fbe7ea';

  componentDidMount() {
    this._save('crm_hf_clientes_d3', this.state.clientes);
    this._save('crm_hf_pedidos_d2', this.state.pedidos);
    this._save('crm_hf_fornec_d2', this.state.fornecedores);
    this._save('crm_hf_produtos_d3', this.state.produtos);
    this._save('crm_hf_lanc_d3', this.state.lancamentos);
    this._save('crm_hf_func_d2', this.state.funcionarios);
    this._save('crm_hf_veic_d1', this.state.veiculos);
    this._save('crm_hf_bancos_d1', this.state.bancos);
    this._save('crm_hf_perdas_d1', this.state.perdas);
    this._save('crm_hf_entradas_d2', this.state.entradas);
  }

  SENHAS = { admin:'admin123', colaborador:'func123' };
  setLoginRole = (e) => this.setState({ loginRole: e.target.value, loginErr:'' });
  setLoginPass = (e) => this.setState({ loginPass: e.target.value, loginErr:'' });
  doLogin = () => {
    const r = this.state.loginRole;
    
    this.setState({ logged:true, role:r, loginPass:'', loginErr:'', screen: r==='admin' ? 'dashboard' : 'entradas' });
  };
  loginOnKey = (e) => { if (e.key === 'Enter') this.doLogin(); };
  logout = () => this.setState({ logged:false, loginPass:'', loginErr:'', modal:null, draft:null });

  seedPerdas() { return [
    {id:1,data:'2026-06-19',produtoId:4,nome:'Alface',un:'CX',qtd:4,motivo:'vencimento',obs:'Sobra da rota Leste que não vendeu'},
    {id:2,data:'2026-06-26',produtoId:3,nome:'Tomate',un:'CX',qtd:3,motivo:'armazenagem',obs:'Caixa amassada no empilhamento'}
  ]; }
  seedClientes() { return [
    {id:1,nome:'Mercado Bom Preço',resp:'Sônia Alves',cnpj:'12.345.678/0001-90',tel:'(41) 99812-3344',email:'compras@bompreco.com.br',endereco:'R. das Flores, 210 — Boqueirão, Curitiba/PR',rota:'Sul A',freq:'2×/sem · Seg e Qui',status:'ativo',ticketMes:0,ticketEntrega:0,volume:0,cobranca:'Em dia',forma:'PIX',limite:6000,prazo:14,tend:'↑',ult:'—',obs:'Cliente fiel, volume crescendo há 3 meses. Avaliar aumento de limite.'},
    {id:2,nome:'Minimercado Vila Nova',resp:'Carlos Teixeira',cnpj:'23.456.789/0001-01',tel:'(41) 99765-1122',email:'',endereco:'Av. Vila Nova, 89 — Pinheirinho, Curitiba/PR',rota:'Sul A',freq:'2×/sem · Seg e Qui',status:'ativo',ticketMes:0,ticketEntrega:0,volume:0,cobranca:'Em dia',forma:'Boleto',limite:5000,prazo:14,tend:'→',ult:'—',obs:'Estável e pontual. Bom candidato para testar itens premium.'},
    {id:3,nome:'Empório da Esquina',resp:'Renata Lima',cnpj:'34.567.890/0001-12',tel:'(41) 99654-7788',email:'',endereco:'R. XV de Outubro, 540 — Cristo Rei, Curitiba/PR',rota:'Leste B',freq:'1×/sem · Qua',status:'negociacao',ticketMes:0,ticketEntrega:0,volume:0,cobranca:'Em dia',forma:'PIX',limite:3000,prazo:7,tend:'→',ult:'—',obs:'Em negociação para subir para 2×/semana.'},
    {id:4,nome:'Mini Atacado Real',resp:'Fábio Nunes',cnpj:'89.012.345/0001-67',tel:'(41) 99109-5577',email:'',endereco:'Av. Industrial, 980 — CIC, Curitiba/PR',rota:'Norte C',freq:'2×/sem · Ter e Sex',status:'ativo',ticketMes:0,ticketEntrega:0,volume:0,cobranca:'Em dia',forma:'PIX',limite:7000,prazo:21,tend:'↑',ult:'—',obs:'Maior cliente da carteira. Excelente histórico de pagamento.'},
    {id:5,nome:'Mercearia Santa Rita',resp:'Pedro Gomes',cnpj:'56.789.012/0001-34',tel:'(41) 99432-5566',email:'',endereco:'R. Santa Rita, 77 — Portão, Curitiba/PR',rota:'Oeste D',freq:'2×/sem · Seg e Qui',status:'ativo',ticketMes:0,ticketEntrega:0,volume:0,cobranca:'Atrasado',forma:'Boleto',limite:4500,prazo:14,tend:'↓',ult:'—',obs:'Um atraso este mês. Acompanhar o próximo vencimento de perto.'},
    {id:6,nome:'Mercado Central',resp:'Lúcia Prado',cnpj:'90.123.456/0001-78',tel:'(41) 99098-6611',email:'',endereco:'R. Marechal, 450 — Centro, Curitiba/PR',rota:'Oeste D',freq:'2×/sem · Seg e Qui',status:'ativo',ticketMes:0,ticketEntrega:0,volume:0,cobranca:'Em dia',forma:'PIX',limite:5000,prazo:14,tend:'→',ult:'—',obs:'Constante, sem ocorrências relevantes.'},
    {id:7,nome:'Quitanda do Zé',resp:'José Martins',cnpj:'78.901.234/0001-56',tel:'(41) 99210-3434',email:'',endereco:'R. das Hortênsias, 15 — Cajuru, Curitiba/PR',rota:'Leste B',freq:'1×/sem · Qua',status:'inadimplente',ticketMes:0,ticketEntrega:0,volume:0,cobranca:'Em cobrança',forma:'Dinheiro',limite:2500,prazo:7,tend:'↓',ult:'—',obs:'Ticket baixo e atrasos recorrentes. Reavaliar atendimento da rota.'}
  ]; }
  seedProdutos() { return [
    {id:1,nome:'Batata',un:'KG'},{id:2,nome:'Cebola',un:'KG'},{id:3,nome:'Tomate',un:'CX'},
    {id:4,nome:'Alface',un:'CX'},{id:5,nome:'Banana',un:'KG'},{id:6,nome:'Maçã',un:'CX'}
  ]; }
  seedFornecedores() { return [
    {id:1,nome:'Fazenda Boa Terra',regiao:'Londrina — Norte do PR',contato:'(43) 99811-2020',produtos:['Batata','Cebola']},
    {id:2,nome:'Sítio Recanto Verde',regiao:'Maringá — Norte do PR',contato:'(44) 99722-3131',produtos:['Alface','Tomate']},
    {id:3,nome:'Cooperativa Norte PR',regiao:'Apucarana — Norte do PR',contato:'(43) 99633-4242',produtos:['Banana','Maçã']}
  ]; }
  seedEntradas() { return [
    {id:'C-1040',fornecedor:'Fazenda Boa Terra',data:'2026-06-08',pesoKg:2250,valor:4350,perdaKg:140,motivo:'transporte',pago:'Pago',dataPag:'2026-06-10',formaPag:'PIX',itens:[{produtoId:1,nome:'Batata',un:'KG',kg:1500,preco:1.85,perdaKg:85},{produtoId:2,nome:'Cebola',un:'KG',kg:750,preco:2.10,perdaKg:55}]},
    {id:'C-1041',fornecedor:'Sítio Recanto Verde',data:'2026-06-11',pesoKg:135,valor:4275,perdaKg:9,motivo:'armazenagem',pago:'Pago',dataPag:'2026-06-13',formaPag:'Boleto',itens:[{produtoId:4,nome:'Alface',un:'CX',kg:90,preco:25,perdaKg:6},{produtoId:3,nome:'Tomate',un:'CX',kg:45,preco:45,perdaKg:3}]},
    {id:'C-1042',fornecedor:'Cooperativa Norte PR',data:'2026-06-15',pesoKg:636,valor:3168,perdaKg:36,motivo:'vencimento',pago:'Pago',dataPag:'2026-06-18',formaPag:'PIX',itens:[{produtoId:5,nome:'Banana',un:'KG',kg:600,preco:2.40,perdaKg:34},{produtoId:6,nome:'Maçã',un:'CX',kg:36,preco:48,perdaKg:2}]},
    {id:'C-1043',fornecedor:'Fazenda Boa Terra',data:'2026-06-22',pesoKg:1350,valor:2610,perdaKg:76,motivo:'manuseio',pago:'Pago',dataPag:'2026-06-24',formaPag:'PIX',itens:[{produtoId:1,nome:'Batata',un:'KG',kg:900,preco:1.85,perdaKg:48},{produtoId:2,nome:'Cebola',un:'KG',kg:450,preco:2.10,perdaKg:28}]},
    {id:'C-1044',fornecedor:'Sítio Recanto Verde',data:'2026-06-25',pesoKg:111,valor:3606,perdaKg:8,motivo:'transporte',pago:'Pendente',dataPag:'',formaPag:'PIX',itens:[{produtoId:4,nome:'Alface',un:'CX',kg:75,preco:26,perdaKg:5},{produtoId:3,nome:'Tomate',un:'CX',kg:36,preco:46,perdaKg:3}]},
    {id:'C-1045',fornecedor:'Cooperativa Norte PR',data:'2026-06-27',pesoKg:504,valor:2352,perdaKg:27,motivo:'armazenagem',pago:'Pendente',dataPag:'',formaPag:'Boleto',itens:[{produtoId:5,nome:'Banana',un:'KG',kg:480,preco:2.45,perdaKg:26},{produtoId:6,nome:'Maçã',un:'CX',kg:24,preco:49,perdaKg:1}]}
  ]; }
  seedPedidos() { return [
    {id:'#2041',cliente:'Mercado Bom Preço',rota:'Sul A',dataPedido:'2026-06-09',entrega:'2026-06-10',pesoKg:510,valor:3960,status:'Entregue',pag:'Pago',venc:'—',recebDias:2,perdaKg:0,motivo:'—',dataPag:'2026-06-12',formaPag:'PIX',itens:[{produtoId:1,nome:'Batata',un:'KG',kg:450,preco:3.20,perdaKg:0},{produtoId:4,nome:'Alface',un:'CX',kg:60,preco:42,perdaKg:0}]},
    {id:'#2042',cliente:'Mini Atacado Real',rota:'Norte C',dataPedido:'2026-06-11',entrega:'2026-06-12',pesoKg:930,valor:5160,status:'Entregue',pag:'Pago',venc:'—',recebDias:3,perdaKg:0,motivo:'—',dataPag:'2026-06-15',formaPag:'Boleto',itens:[{produtoId:1,nome:'Batata',un:'KG',kg:600,preco:3.20,perdaKg:0},{produtoId:2,nome:'Cebola',un:'KG',kg:300,preco:3.60,perdaKg:0},{produtoId:3,nome:'Tomate',un:'CX',kg:30,preco:72,perdaKg:0}]},
    {id:'#2043',cliente:'Minimercado Vila Nova',rota:'Sul A',dataPedido:'2026-06-15',entrega:'2026-06-16',pesoKg:570,valor:4554,status:'Entregue',pag:'Pago',venc:'—',recebDias:2,perdaKg:0,motivo:'—',dataPag:'2026-06-18',formaPag:'PIX',itens:[{produtoId:5,nome:'Banana',un:'KG',kg:540,preco:4.10,perdaKg:0},{produtoId:6,nome:'Maçã',un:'CX',kg:30,preco:78,perdaKg:0}]},
    {id:'#2044',cliente:'Mercado Central',rota:'Oeste D',dataPedido:'2026-06-17',entrega:'2026-06-18',pesoKg:672,valor:3125,status:'Entregue',pag:'Pago',venc:'—',recebDias:4,perdaKg:0,motivo:'—',dataPag:'2026-06-22',formaPag:'Boleto',itens:[{produtoId:1,nome:'Batata',un:'KG',kg:540,preco:3.20,perdaKg:0},{produtoId:2,nome:'Cebola',un:'KG',kg:108,preco:3.60,perdaKg:0},{produtoId:4,nome:'Alface',un:'CX',kg:24,preco:42,perdaKg:0}]},
    {id:'#2045',cliente:'Mercearia Santa Rita',rota:'Oeste D',dataPedido:'2026-06-22',entrega:'2026-06-23',pesoKg:384,valor:3348,status:'Entregue',pag:'Atrasado',venc:'2026-07-07',recebDias:0,perdaKg:0,motivo:'—',itens:[{produtoId:5,nome:'Banana',un:'KG',kg:360,preco:4.10,perdaKg:0},{produtoId:6,nome:'Maçã',un:'CX',kg:24,preco:78,perdaKg:0}]},
    {id:'#2046',cliente:'Empório da Esquina',rota:'Leste B',dataPedido:'2026-06-24',entrega:'2026-06-25',pesoKg:285,valor:2754,status:'Entregue',pag:'Pago',venc:'—',recebDias:5,perdaKg:0,motivo:'—',dataPag:'2026-06-30',formaPag:'PIX',itens:[{produtoId:4,nome:'Alface',un:'CX',kg:45,preco:42,perdaKg:0},{produtoId:2,nome:'Cebola',un:'KG',kg:240,preco:3.60,perdaKg:0}]},
    {id:'#2047',cliente:'Quitanda do Zé',rota:'Leste B',dataPedido:'2026-06-24',entrega:'2026-06-25',pesoKg:108,valor:443,status:'Entregue',pag:'Atrasado',venc:'2026-07-01',recebDias:0,perdaKg:0,motivo:'—',itens:[{produtoId:5,nome:'Banana',un:'KG',kg:108,preco:4.10,perdaKg:0}]},
    {id:'#2048',cliente:'Mercado Bom Preço',rota:'Sul A',dataPedido:'2026-06-26',entrega:'2026-06-27',pesoKg:636,valor:4512,status:'Entregue',pag:'Pago',venc:'—',recebDias:3,perdaKg:0,motivo:'—',dataPag:'2026-06-30',formaPag:'PIX',itens:[{produtoId:1,nome:'Batata',un:'KG',kg:600,preco:3.20,perdaKg:0},{produtoId:3,nome:'Tomate',un:'CX',kg:36,preco:72,perdaKg:0}]},
    {id:'#2049',cliente:'Mini Atacado Real',rota:'Norte C',dataPedido:'2026-06-27',entrega:'2026-06-28',pesoKg:471,valor:2502,status:'Em rota',pag:'Pendente',venc:'2026-07-19',recebDias:0,perdaKg:0,motivo:'—',itens:[{produtoId:2,nome:'Cebola',un:'KG',kg:450,preco:3.60,perdaKg:0},{produtoId:4,nome:'Alface',un:'CX',kg:21,preco:42,perdaKg:0}]}
  ]; }
  seedFuncionarios() { return [
    {id:1,nome:'João Pereira',cargo:'Motorista',salario:2200,tel:'(41) 99900-1122',diaPag:5},
    {id:2,nome:'Maria Souza',cargo:'Auxiliar de depósito',salario:1800,tel:'(41) 99911-3344',diaPag:5}
  ]; }
  seedBancos() { return [
    {id:1,instituicao:'Sicredi',agencia:'0718',conta:'45120-3',apelido:'Conta principal',ativo:'sim',saldoInicial:8200},
    {id:2,instituicao:'Caixa Econômica Federal',agencia:'1532',conta:'00987-1',apelido:'Folha de pagamento',ativo:'sim',saldoInicial:3500},
    {id:3,instituicao:'XP Investimentos',agencia:'0001',conta:'3349821-0',apelido:'Reserva',ativo:'sim',saldoInicial:12000}
  ]; }
  BANCOS_BR = [['001','Banco do Brasil'],['104','Caixa Econômica Federal'],['237','Bradesco'],['341','Itaú Unibanco'],['033','Santander'],['748','Sicredi'],['756','Sicoob'],['260','Nubank'],['077','Banco Inter'],['336','C6 Bank'],['102','XP Investimentos'],['208','BTG Pactual'],['290','PagBank'],['323','Mercado Pago'],['380','PicPay'],['212','Banco Original'],['041','Banrisul'],['070','BRB'],['004','Banco do Nordeste'],['085','Ailos'],['136','Unicred'],['422','Safra'],['655','Banco Votorantim'],['403','Cora'],['197','Stone'],['623','Banco Pan'],['746','Modal'],['218','BS2'],['999','Outro']];
  newBanco = () => {
    const id = (this.state.bancos.reduce((m,x)=>Math.max(m,x.id||0),0) || 0) + 1;
    this.setState({ modal:'banco', isEditing:false, draft:{ id, instituicao:'Sicredi', apelido:'', ativo:'sim', saldoInicial:'' } });
  };
  editBanco = (id) => { const b = this.state.bancos.find(x=>x.id===id); if (b) this.setState({ modal:'banco', isEditing:true, draft:{ ...b } }); };
  seedVeiculos() { return [
    {id:1,placa:'BRA2E19',marca:'Fiat',modelo:'Fiorino',ano:2021,ativo:'sim',obs:'Entregas urbanas'},
    {id:2,placa:'QTX4B71',marca:'Mercedes',modelo:'Accelo 815',ano:2018,ativo:'sim',obs:'Coleta no Norte do PR'},
    {id:3,placa:'AKD8C02',marca:'VW',modelo:'Saveiro',ano:2014,ativo:'nao',obs:''}
  ]; }
  seedLancamentos() { return [
    {id:201,data:'2026-11-03',categoria:'Diária',diarista:'João Pereira',descricao:'Descarga do caminhão da CEASA',valor:120,funcionarioId:'',veiculoId:'',bancoId:'1'},
    {id:202,data:'2026-11-08',categoria:'Diária',diarista:'Carla Mendes',descricao:'Separação de pedidos',valor:110,funcionarioId:'',veiculoId:'',bancoId:'1'},
    {id:203,data:'2026-11-14',categoria:'Diária',diarista:'João Pereira',descricao:'Descarga do caminhão da CEASA',valor:120,funcionarioId:'',veiculoId:'',bancoId:'2'},
    {id:204,data:'2026-11-15',categoria:'Diária',diarista:'Rafael Souza',descricao:'Entregas de sábado',valor:150,funcionarioId:'',veiculoId:'',bancoId:''},
    {id:101,data:'2026-06-05',categoria:'Gasolina',descricao:'Tanque cheio',valor:310,funcionarioId:'',veiculoId:'1'},
    {id:102,data:'2026-06-14',categoria:'Gasolina',descricao:'Diesel — coleta Norte PR',valor:890,funcionarioId:'',veiculoId:'2'},
    {id:103,data:'2026-06-20',categoria:'Manutenção dos Carros',descricao:'Troca de óleo e filtros',valor:540,funcionarioId:'',veiculoId:'2'},
    {id:104,data:'2026-07-02',categoria:'Multa',descricao:'Estacionamento em local proibido',valor:195,funcionarioId:'',veiculoId:'1'},
    {id:105,data:'2026-07-09',categoria:'Gasolina',descricao:'Tanque cheio',valor:325,funcionarioId:'',veiculoId:'1'},
    {id:1,data:'2026-06-08',categoria:'Frete',descricao:'Coleta Norte PR → Curitiba',valor:1280,funcionarioId:''},
    {id:2,data:'2026-06-11',categoria:'Gasolina',descricao:'Entregas urbanas da semana',valor:620,funcionarioId:''},
    {id:3,data:'2026-06-15',categoria:'Adiantamento de salário',descricao:'Adiantamento da quinzena',valor:700,funcionarioId:'2'},
    {id:4,data:'2026-06-18',categoria:'Manutenção dos Carros',descricao:'Troca de óleo e filtro do caminhão',valor:480,funcionarioId:''},
    {id:5,data:'2026-06-20',categoria:'Simples Nacional',descricao:'Guia de junho (4% s/ receita)',valor:1114,funcionarioId:''},
    {id:6,data:'2026-06-25',categoria:'Vale-transporte',descricao:'Recarga dos cartões',valor:320,funcionarioId:''},
    {id:7,data:'2026-06-30',categoria:'Salário',descricao:'Folha de junho (saldo)',valor:1100,funcionarioId:'2'}
  ]; }
  _fmtDate(s) { return this._fmtDM(s); }
  monthOf(d) { const s=String(d||''); const iso=s.match(/^\d{4}-(\d{2})/); if(iso)return iso[1]; const m=s.match(/\/(\d{2})/); return m ? m[1] : null; }
  setPeriodo = (e) => this.setState({ periodo: e.target.value });
  _load(key, fallback, validate) {
    try {
      const s = localStorage.getItem(key);
      if (s) { const v = JSON.parse(s); if (!validate || validate(v)) return v; }
    } catch (e) {}
    const d = fallback();
    this._save(key, d);
    return d;
  }
  _save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  ADMIN_ONLY_SCREENS = ['dashboard','clientes','fornecedores','produtos','financeiro','relatorios','funcionarios','veiculos','bancos'];
  nav(key) { this.setState({ screen: key, clienteView: 'list' }); }
  setRelClientes = () => this.setState({ relView:'clientes' });
  setRelPedidos = () => this.setState({ relView:'pedidos' });
  setRelLanc = () => this.setState({ relView:'lanc' });
  setRelCompras = () => this.setState({ relView:'compras' });
  setRelProdutos = () => this.setState({ relView:'produtos' });
  setRelInad = () => this.setState({ relView:'inad' });
  setRelPerdas = () => this.setState({ relView:'perdas' });
  imprimirRelatorio = () => { window.print(); };
  exportarCSV = () => {
    const c = this._csv;
    if (!c || !c.rows) return;
    const esc = v => { const s = String(v==null?'':v); return /[";\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; };
    const linhas = [c.header].concat(c.rows).map(r => r.map(esc).join(';'));
    const blob = new Blob(['\ufeff'+linhas.join('\r\n')], { type:'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = c.nome + '.csv';
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 200);
  };
  setRoleAdmin = () => this.setState({ role:'admin' });
  setRoleColab = () => this.setState(s => ({ role:'colaborador', screen: this.ADMIN_ONLY_SCREENS.includes(s.screen) ? 'entradas' : s.screen }));
  openCliente(id) { this.setState({ screen: 'clientes', clienteView: 'detail', clienteId: id }); }

  healthOf(c, inadPct, ticketEntrega) {
    if (!c || !c.status) return 'green';
    if (c.status === 'inadimplente' || c.status === 'inativo') return 'red';
    const inad = inadPct || 0, te = ticketEntrega || 0;
    if (inad > 2 || (te > 0 && te < 150)) return 'red';
    if (inad > 1 || (te > 0 && te < 430) || c.tend === '↓' || c.status === 'negociacao') return 'amber';
    return 'green';
  }

  newCliente = () => {
    const id = (this.state.clientes.reduce((m,x)=>Math.max(m,x.id),0) || 0) + 1;
    this.setState({ modal:'cliente', isEditing:false, draft:{ id, nome:'', resp:'', cnpj:'', tel:'', email:'', endereco:'', rota:'Sul A', freq:'2×/sem · Seg e Qui', status:'ativo', ticketMes:0, ticketEntrega:0, volume:0,  cobranca:'Em dia', forma:'PIX', limite:0, prazo:14, tend:'→', ult:'—', obs:'' } });
  };
  editCliente = (id) => { const c = this.state.clientes.find(x=>x.id===id); if (c) this.setState({ modal:'cliente', isEditing:true, draft:{ ...c } }); };
  editCurrentCliente = () => this.editCliente(this.state.clienteId);
  deleteCurrentCliente = () => {
    const list = this.state.clientes.filter(x=>x.id!==this.state.clienteId);
    this._save('crm_hf_clientes_d3', list);
    this.setState({ clientes:list, clienteView:'list', modal:null, draft:null });
  };

  newPedido = () => {
    const nums = this.state.pedidos.map(p=>parseInt(String(p.id).replace('#',''))||0);
    const id = '#' + ((nums.length?Math.max.apply(null,nums):2040) + 1);
    const c0 = this.state.clientes[0];
    const _h = new Date(); const _hIso = _h.getFullYear()+'-'+String(_h.getMonth()+1).padStart(2,'0')+'-'+String(_h.getDate()).padStart(2,'0');
    this.setState({ modal:'pedido', isEditing:false, draft:{ id, cliente:c0?c0.nome:'', rota:c0?c0.rota:'Sul A', dataPedido:_hIso, entrega:_hIso, pesoKg:0, valor:0, status:'Pendente', pag:'Pendente', venc:'—', recebDias:0, perdaKg:0, motivo:'—', itens:[] } });
  };
  editPedido = (id) => { const p = this.state.pedidos.find(x=>x.id===id); if (p) this.setState({ modal:'pedido', isEditing:true, draft:{ ...p, itens:(p.itens||[]).map(i=>({...i})) } }); };

  newEntrada = () => {
    const nums = this.state.entradas.map(e=>parseInt(String(e.id).replace(/\D/g,''))||0);
    const id = 'C-' + ((nums.length?Math.max.apply(null,nums):1041) + 1);
    const f0 = this.state.fornecedores[0];
    const nowd = new Date(); const hoje = String(nowd.getDate()).padStart(2,'0')+'/'+String(nowd.getMonth()+1).padStart(2,'0');
    this.setState({ modal:'entrada', isEditing:false, draft:{ id, fornecedor:f0?f0.nome:'', data:hoje, pesoKg:0, valor:0, perdaKg:0, motivo:'—', pago:'Pendente', dataPag:'', formaPag:'PIX', itens:[] } });
  };
  editEntrada = (id) => { const e = this.state.entradas.find(x=>x.id===id); if (e) this.setState({ modal:'entrada', isEditing:true, draft:{ ...e, itens:(e.itens||[]).map(i=>({...i})) } }); };
  marcarEntradaPaga = (id, ev) => {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    const list = this.state.entradas.map(e => e.id===id ? { ...e, pago:'Pago' } : e);
    this._save('crm_hf_entradas_d2', list);
    this.setState({ entradas:list });
  };
  _parseDate(s){
    s = String(s||'');
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); // ISO yyyy-mm-dd (calendário)
    if (m) return new Date(parseInt(m[1]), parseInt(m[2])-1, parseInt(m[3])).getTime();
    m = s.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/); // dd/mm(/aaaa) legado
    if (m) return new Date(m[3]?(m[3].length===2?2000+parseInt(m[3]):parseInt(m[3])):2026, parseInt(m[2])-1, parseInt(m[1])).getTime();
    return null;
  }
  _daysBetween(a,b){ const pa=this._parseDate(a), pb=this._parseDate(b); if(pa==null||pb==null)return null; const d=Math.round((pb-pa)/86400000); return d>=0?d:null; }
  _fmtDM(s){ const m=String(s||'').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); return m ? (m[3].padStart(2,'0')+'/'+m[2].padStart(2,'0')) : String(s||''); }
  openPagamento = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const p = this.state.pedidos.find(x=>x.id===id); if (!p) return;
    const now = new Date();
    const hoje = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    this.setState({ modal:'pagamento', isEditing:false, draft:{ id, dataPag: p.dataPagIso || hoje, forma: p.formaPag || 'PIX' } });
  };

  addItem = () => this.setState(s => ({ draft:{ ...s.draft, itens:[ ...(s.draft.itens||[]), { produtoId:'', nome:'', un:'KG', kg:0, preco:0, perdaKg:0 } ] } }));

  newPerda = () => {
    const id = (this.state.perdas.reduce((m,x)=>Math.max(m,x.id||0),0) || 0) + 1;
    const p0 = this.state.produtos[0];
    this.setState({ modal:'perda', isEditing:false, draft:{ id, data:this._hojeIso(), produtoId:p0?String(p0.id):'', nome:p0?p0.nome:'', un:p0?(p0.un||'KG'):'KG', qtd:0, motivo:'armazenagem', obs:'' } });
  };
  editPerda = (id) => { const p = this.state.perdas.find(x=>x.id===id); if (p) this.setState({ modal:'perda', isEditing:true, draft:{ ...p, produtoId:String(p.produtoId||'') } }); };
  removeItem = (idx) => this.setState(s => ({ draft:{ ...s.draft, itens:(s.draft.itens||[]).filter((_,i)=>i!==idx) } }));
  updateItem = (e) => {
    const idx = parseInt(e.target.dataset.idx), f = e.target.dataset.f, v = e.target.value;
    this.setState(s => {
      const itens = (s.draft.itens||[]).map((it,i)=> i===idx ? { ...it } : it);
      const it = itens[idx]; if (!it) return {};
      if (f === 'produtoId') {
        const p = this.state.produtos.find(x=>String(x.id)===String(v));
        it.produtoId = v;
        if (p) { it.nome = p.nome; it.un = p.un || 'KG'; }
      } else if (f === 'un') {
        it.un = v;
      } else {
        it[f] = parseFloat(String(v).replace(',','.')) || 0;
      }
      return { draft:{ ...s.draft, itens } };
    });
  };

  newFornecedor = () => {
    const id = (this.state.fornecedores.reduce((m,x)=>Math.max(m,x.id||0),0) || 0) + 1;
    this.setState({ modal:'fornecedor', isEditing:false, draft:{ id, nome:'', regiao:'', contato:'', produtos:[] } });
  };
  editFornecedor = (id) => { const f = this.state.fornecedores.find(x=>x.id===id); if (f) this.setState({ modal:'fornecedor', isEditing:true, draft:{ ...f, produtos:(f.produtos||[]).slice() } }); };
  toggleProdForn = (nome) => this.setState(s => {
    const atual = (s.draft.produtos||[]).slice();
    const i = atual.indexOf(nome);
    if (i>=0) atual.splice(i,1); else atual.push(nome);
    return { draft:{ ...s.draft, produtos:atual } };
  });

  newProduto = () => {
    const id = (this.state.produtos.reduce((m,x)=>Math.max(m,x.id||0),0) || 0) + 1;
    this.setState({ modal:'produto', isEditing:false, draft:{ id, nome:'', un:'KG' } });
  };
  editProduto = (id) => { const p = this.state.produtos.find(x=>x.id===id); if (p) this.setState({ modal:'produto', isEditing:true, draft:{ ...p } }); };

  LANC_CATS = ['Diária','Frete','Gasolina','Manutenção dos Carros','Multa','Salário','Adiantamento de salário','Vale-alimentação','Vale-transporte','FGTS','INSS','Simples Nacional','Parcelamento Impostos','Pagamento de conta de sócio','Outros'];
  VEIC_CATS = ['Gasolina','Manutenção dos Carros','Multa'];
  newVeiculo = () => {
    const id = (this.state.veiculos.reduce((m,x)=>Math.max(m,x.id||0),0) || 0) + 1;
    this.setState({ modal:'veiculo', isEditing:false, draft:{ id, placa:'', marca:'', modelo:'', ano:'', ativo:'sim', obs:'' } });
  };
  editVeiculo = (id, ev) => { if (ev && ev.stopPropagation) ev.stopPropagation(); const v = this.state.veiculos.find(x=>x.id===id); if (v) this.setState({ modal:'veiculo', isEditing:true, draft:{ ...v } }); };
  toggleVeic = (id) => this.setState(s => ({ veicAberto: s.veicAberto===id ? null : id }));
  lancarVeiculo = (id, categoria, ev) => { if (ev && ev.stopPropagation) ev.stopPropagation(); this.newLancamento({ categoria, veiculoId:String(id) }); };
  _hojeIso() { const n = new Date(); return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0'); }
  newLancamento = (pre) => {
    const p = (pre && !pre.target) ? pre : null;
    const id = (this.state.lancamentos.reduce((m,x)=>Math.max(m,x.id||0),0) || 0) + 1;
    this.setState({ modal:'lancamento', isEditing:false, draft: Object.assign({ id, data:this._hojeIso(), categoria:'Gasolina', descricao:'', valor:0, funcionarioId:'', veiculoId:'', bancoId:'' }, p||{}) });
  };
  editLancamento = (id) => { const l = this.state.lancamentos.find(x=>x.id===id); if (l) this.setState({ modal:'lancamento', isEditing:true, draft:{ ...l } }); };
  toggleFunc = (id, ev) => {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    this.setState(s => ({ funcAberto: s.funcAberto===id ? null : id }));
  };
  newDiaria = () => {
    const id = (this.state.lancamentos.reduce((m,x)=>Math.max(m,x.id||0),0) || 0) + 1;
    this.setState({ modal:'diaria', isEditing:false, draft:{ id, data:this._hojeIso(), categoria:'Diária', diarista:'', descricao:'', valor:'', funcionarioId:'', veiculoId:'', bancoId:'' } });
  };
  editDiaria = (id) => { const l = this.state.lancamentos.find(x=>x.id===id); if (l) this.setState({ modal:'diaria', isEditing:true, draft:{ ...l } }); };
  newFuncionario = () => {
    const id = (this.state.funcionarios.reduce((m,x)=>Math.max(m,x.id||0),0) || 0) + 1;
    this.setState({ modal:'funcionario', isEditing:false, draft:{ id, nome:'', cargo:'', salario:0, tel:'', diaPag:5 } });
  };
  pagarSalario = (id, valor, ev) => {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    this.newLancamento({ categoria:'Salário', funcionarioId:String(id), valor: valor||0, descricao:'Salário — '+this._mesAtualNome() });
  };
  _mesAtualNome() {
    const M = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    return M[new Date().getMonth()];
  }
  // próxima data de pagamento: o dia escolhido no cadastro, no mês seguinte ao último salário pago
  _proximoPag(diaPag, ultimoPagIso) {
    const dia = Math.min(Math.max(parseInt(diaPag)||5,1),28);
    let base;
    if (ultimoPagIso) {
      const t = this._parseDate(ultimoPagIso);
      base = t!=null ? new Date(t) : new Date();
      base = new Date(base.getFullYear(), base.getMonth()+1, dia);
    } else {
      const h = new Date();
      base = new Date(h.getFullYear(), h.getMonth(), dia);
      if (base.getTime() < h.getTime()) base = new Date(h.getFullYear(), h.getMonth()+1, dia);
    }
    return base.getFullYear()+'-'+String(base.getMonth()+1).padStart(2,'0')+'-'+String(base.getDate()).padStart(2,'0');
  }
  editFuncionario = (id) => { const f = this.state.funcionarios.find(x=>x.id===id); if (f) this.setState({ modal:'funcionario', isEditing:true, draft:{ ...f } }); };
  adiantarFuncionario = (id, ev) => { if (ev && ev.stopPropagation) ev.stopPropagation(); this.newLancamento({ categoria:'Adiantamento de salário', funcionarioId:String(id) }); };

  updateDraft = (e) => {
    const t = e.target, f = t.dataset ? t.dataset.field : null; if (!f) return;
    const v = t.value;
    if (f === 'cliente') {
      const cli = this.state.clientes.find(x=>x.nome===v);
      this.setState(s => ({ draft: { ...s.draft, cliente:v, rota: cli?cli.rota:s.draft.rota } }));
      return;
    }
    if (f === 'produtoId' && this.state.modal === 'perda') {
      const p = this.state.produtos.find(x=>String(x.id)===String(v));
      this.setState(s => ({ draft: { ...s.draft, produtoId:v, nome: p?p.nome:'', un: p?(p.un||'KG'):s.draft.un } }));
      return;
    }
    this.setState(s => ({ draft: { ...s.draft, [f]: v } }));
  };

  _upsert(list, d, keyfn) { const i = list.findIndex(keyfn); if (i>=0) list[i]=d; else list.push(d); return list; }

  saveDraft = () => {
    const M = this.state.modal;
    if (M === 'cliente') {
      const d = { ...this.state.draft };
      ['ticketMes','ticketEntrega','volume','limite','prazo','inad'].forEach(k => { d[k] = parseFloat(String(d[k]).replace(',','.')) || 0; });
      const list = this.state.clientes.slice();
      const i = list.findIndex(x=>x.id===d.id);
      if (i>=0) list[i]=d; else list.push(d);
      this._save('crm_hf_clientes_d3', list);
      this.setState({ clientes:list, modal:null, draft:null, screen:'clientes', clienteView:'detail', clienteId:d.id });
    } else if (M === 'pedido') {
      const d = { ...this.state.draft };
      ['recebDias'].forEach(k => { d[k] = parseFloat(String(d[k]).replace(',','.')) || 0; });
      if (d.itens && d.itens.length) {
        d.pesoKg = d.itens.reduce((s,i)=>s+(+i.kg||0),0);
        d.valor = Math.round(d.itens.reduce((s,i)=>s+(+i.kg||0)*(+i.preco||0),0));
        d.perdaKg = d.itens.reduce((s,i)=>s+(+i.perdaKg||0),0);
      } else {
        ['pesoKg','valor','perdaKg'].forEach(k => { d[k] = parseFloat(String(d[k]).replace(',','.')) || 0; });
      }
      const list = this.state.pedidos.slice();
      const i = list.findIndex(x=>x.id===d.id);
      if (i>=0) list[i]=d; else list.unshift(d);
      this._save('crm_hf_pedidos_d2', list);
      this.setState({ pedidos:list, modal:null, draft:null, screen:'pedidos', periodo:'all' });
    } else if (M === 'fornecedor') {
      const d = { ...this.state.draft };
      d.produtos = (d.produtos||[]).slice(); delete d.produtosTxt;
      const list = this._upsert(this.state.fornecedores.slice(), d, x=>x.id===d.id);
      this._save('crm_hf_fornec_d2', list);
      this.setState({ fornecedores:list, modal:null, draft:null });
    } else if (M === 'produto') {
      const d = { ...this.state.draft };
      ['compra','venda'].forEach(k => { d[k] = parseFloat(String(d[k]).replace(',','.')) || 0; });
      const list = this._upsert(this.state.produtos.slice(), d, x=>x.id===d.id);
      this._save('crm_hf_produtos_d3', list);
      this.setState({ produtos:list, modal:null, draft:null });
    } else if (M === 'perda') {
      const d = { ...this.state.draft };
      d.qtd = parseFloat(String(d.qtd).replace(',','.')) || 0;
      const list = this._upsert(this.state.perdas.slice(), d, x=>x.id===d.id);
      this._save('crm_hf_perdas_d1', list);
      this.setState({ perdas:list, modal:null, draft:null });
    } else if (M === 'lancamento') {
      const d = { ...this.state.draft };
      d.valor = parseFloat(String(d.valor).replace(',','.')) || 0;
      if (!this.VEIC_CATS.includes(d.categoria)) d.veiculoId = '';
      const list = this._upsert(this.state.lancamentos.slice(), d, x=>x.id===d.id);
      this._save('crm_hf_lanc_d3', list);
      this.setState({ lancamentos:list, modal:null, draft:null });
    } else if (M === 'diaria') {
      const d = { ...this.state.draft, categoria:'Diária' };
      d.valor = parseFloat(String(d.valor||'0').replace(/\./g,'').replace(',','.')) || 0;
      d.diarista = String(d.diarista||'').trim();
      const list = this._upsert(this.state.lancamentos.slice(), d, x=>x.id===d.id);
      this._save('crm_hf_lanc_d3', list);
      this.setState({ lancamentos:list, modal:null, draft:null });
    } else if (M === 'banco') {
      const d = { ...this.state.draft };
      d.saldoInicial = parseFloat(String(d.saldoInicial||'0').replace(/\./g,'').replace(',','.')) || 0;
      const list = this._upsert(this.state.bancos.slice(), d, x=>x.id===d.id);
      this._save('crm_hf_bancos_d1', list);
      this.setState({ bancos:list, modal:null, draft:null });
    } else if (M === 'veiculo') {
      const d = { ...this.state.draft };
      d.placa = String(d.placa||'').toUpperCase().trim(); d.ano = parseInt(d.ano,10) || '';
      const list = this._upsert(this.state.veiculos.slice(), d, x=>x.id===d.id);
      this._save('crm_hf_veic_d1', list);
      this.setState({ veiculos:list, modal:null, draft:null });
    } else if (M === 'funcionario') {
      const d = { ...this.state.draft };
      d.salario = parseFloat(String(d.salario).replace(',','.')) || 0;
      const list = this._upsert(this.state.funcionarios.slice(), d, x=>x.id===d.id);
      this._save('crm_hf_func_d2', list);
      this.setState({ funcionarios:list, modal:null, draft:null });
    } else if (M === 'entrada') {
      const d = { ...this.state.draft };
      if (d.itens && d.itens.length) {
        d.pesoKg = d.itens.reduce((s,i)=>s+(+i.kg||0),0);
        d.valor = Math.round(d.itens.reduce((s,i)=>s+(+i.kg||0)*(+i.preco||0),0));
        d.perdaKg = d.itens.reduce((s,i)=>s+(+i.perdaKg||0),0);
      } else {
        ['pesoKg','valor','perdaKg'].forEach(k => { d[k] = parseFloat(String(d[k]).replace(',','.')) || 0; });
      }
      const list = this._upsert(this.state.entradas.slice(), d, x=>x.id===d.id);
      this._save('crm_hf_entradas_d2', list);
      this.setState({ entradas:list, modal:null, draft:null, screen:'entradas', periodo:'all' });
    } else if (M === 'pagamento') {
      const d = this.state.draft;
      const list = this.state.pedidos.map(p => {
        if (p.id !== d.id) return p;
        const rec = this._daysBetween(p.entrega, d.dataPag);
        return { ...p, pag:'Pago', dataPagIso:d.dataPag, dataPag:this._fmtDM(d.dataPag), formaPag:d.forma, recebDias: (rec!=null? rec : (p.recebDias>0? p.recebDias : 1)) };
      });
      this._save('crm_hf_pedidos_d2', list);
      this.setState({ pedidos:list, modal:null, draft:null });
    }
  };

  deleteFromModal = () => {
    const d = this.state.draft, M = this.state.modal; if (!d) return;
    if (M === 'diaria') {
      const list = this.state.lancamentos.filter(x=>x.id!==d.id);
      this._save('crm_hf_lanc_d3', list);
      this.setState({ lancamentos:list, modal:null, draft:null });
      return;
    }
    if (M === 'banco') {
      const list = this.state.bancos.filter(x=>x.id!==d.id);
      const lancs = this.state.lancamentos.map(l => String(l.bancoId||'')===String(d.id) ? { ...l, bancoId:'' } : l);
      this._save('crm_hf_bancos_d1', list); this._save('crm_hf_lanc_d3', lancs);
      this.setState({ bancos:list, lancamentos:lancs, modal:null, draft:null });
      return;
    }
    if (M === 'veiculo') {
      const list = this.state.veiculos.filter(x=>x.id!==d.id);
      const lancs = this.state.lancamentos.map(l => String(l.veiculoId||'')===String(d.id) ? { ...l, veiculoId:'' } : l);
      this._save('crm_hf_veic_d1', list); this._save('crm_hf_lanc_d3', lancs);
      this.setState({ veiculos:list, lancamentos:lancs, modal:null, draft:null });
      return;
    }
    if (M === 'cliente') {
      const list = this.state.clientes.filter(x=>x.id!==d.id);
      this._save('crm_hf_clientes_d3', list);
      this.setState({ clientes:list, modal:null, draft:null, clienteView:'list' });
    } else if (M === 'pedido') {
      const list = this.state.pedidos.filter(x=>x.id!==d.id);
      this._save('crm_hf_pedidos_d2', list);
      this.setState({ pedidos:list, modal:null, draft:null });
    } else if (M === 'fornecedor') {
      const list = this.state.fornecedores.filter(x=>x.id!==d.id);
      this._save('crm_hf_fornec_d2', list);
      this.setState({ fornecedores:list, modal:null, draft:null });
    } else if (M === 'produto') {
      const list = this.state.produtos.filter(x=>x.id!==d.id);
      this._save('crm_hf_produtos_d3', list);
      this.setState({ produtos:list, modal:null, draft:null });
    } else if (M === 'perda') {
      const list = this.state.perdas.filter(x=>x.id!==d.id);
      this._save('crm_hf_perdas_d1', list);
      this.setState({ perdas:list, modal:null, draft:null });
    } else if (M === 'lancamento') {
      const list = this.state.lancamentos.filter(x=>x.id!==d.id);
      this._save('crm_hf_lanc_d3', list);
      this.setState({ lancamentos:list, modal:null, draft:null });
    } else if (M === 'funcionario') {
      const list = this.state.funcionarios.filter(x=>x.id!==d.id);
      this._save('crm_hf_func_d2', list);
      this.setState({ funcionarios:list, modal:null, draft:null });
    } else if (M === 'entrada') {
      const list = this.state.entradas.filter(x=>x.id!==d.id);
      this._save('crm_hf_entradas_d2', list);
      this.setState({ entradas:list, modal:null, draft:null });
    }
  };

  closeModal = () => this.setState({ modal:null, draft:null });
  closeModalBackdrop = (e) => { if (e && e.target === e.currentTarget) this.closeModal(); };
  stopProp = (e) => { if (e && e.stopPropagation) e.stopPropagation(); };

  statusMap(s) {
    return ({ ativo:{l:'Ativo',c:this.GREEN}, negociacao:{l:'Em negociação',c:this.AMBER}, inadimplente:{l:'Inadimplente',c:this.RED}, inativo:{l:'Inativo',c:'#6b7a6f'} })[s];
  }
  healthMap(h) {
    return ({ green:{c:this.GREEN,bg:this.GBG,l:'Saudável',f:'Verde · Saudável'}, amber:{c:this.AMBER,bg:this.ABG,l:'Atenção',f:'Amarelo · Atenção'}, red:{c:this.RED,bg:this.RBG,l:'Risco',f:'Vermelho · Risco'} })[h];
  }
  money(n) { return 'R$ ' + n.toLocaleString('pt-BR'); }

  pStatusColor(s){ return ({Entregue:this.GREEN,'Em rota':'#2f6fb0',Pendente:this.AMBER,Devolvido:this.RED,Cancelado:'#6b7a6f'})[s]; }
  pStatusBg(s){ return ({Entregue:this.GBG,'Em rota':'#e3eef8',Pendente:this.ABG,Devolvido:this.RBG,Cancelado:'#f0f3ed'})[s]; }
  pPagColor(s){ return ({Pago:this.GREEN,Pendente:this.AMBER,Atrasado:this.RED,'—':'#6b7a6f'})[s]; }
  pPagBg(s){ return ({Pago:this.GBG,Pendente:this.ABG,Atrasado:this.RBG,'—':'#f0f3ed'})[s]; }

  renderVals() {
    const S = (this.ADMIN_ONLY_SCREENS.includes(this.state.screen) && this.state.role!=='admin') ? 'entradas' : this.state.screen;
    const isAdmin = this.state.role === 'admin';
    let navDefs = [
      { key:'dashboard', label:'Saúde do Negócio', badge:'' },
      { key:'clientes', label:'Clientes', badge:String(this.state.clientes.filter(x=>x.status==='ativo').length) },
      { key:'entradas', label:'Entradas (Compras)', badge:'' },
      { key:'pedidos', label:'Saídas (Vendas)', badge:'' },
      { key:'estoque', label:'Estoque', badge:'' },
      { key:'fornecedores', label:'Fornecedores', badge:'' },
      { key:'produtos', label:'Produtos', badge:'' },
      { key:'funcionarios', label:'Funcionários', badge:'' },
      { key:'veiculos', label:'Veículos', badge:'' },
      { key:'bancos', label:'Bancos', badge:'' },
      { key:'financeiro', label:'Financeiro', badge:'' },
      { key:'relatorios', label:'Relatórios', badge:'' }
    ];
    if (!isAdmin) navDefs = navDefs.filter(n => !this.ADMIN_ONLY_SCREENS.includes(n.key));
    const navItems = navDefs.map(n => {
      const active = S === n.key;
      return { label:n.label, badge:n.badge, onClick:() => this.nav(n.key),
        bg: active ? 'rgba(227,179,65,0.18)' : 'transparent',
        fg: active ? '#ffffff' : '#b9cdbd',
        dot: active ? '#e3b341' : 'rgba(255,255,255,0.18)',
        weight: active ? 600 : 500 };
    });

    const titles = {
      dashboard:['Saúde do Negócio','Visão geral da operação — meta vs. realizado'],
      clientes: this.state.clienteView==='detail' ? ['Ficha do cliente','Cadastro, métricas, crédito e histórico'] : ['Clientes — Minimercados', this.state.clientes.filter(x=>x.status==='ativo').length+' ativos · carteira completa e health score'],
      pedidos:['Saídas (Vendas)','Entregas aos minimercados — logística, financeiro e perdas'],
      entradas:['Entradas (Compras)','Coletas e compras dos fornecedores — alimenta a Compra de mercadoria'],
      fornecedores:['Fornecedores — Produtores Rurais','Norte do PR · preços de compra e variação'],
      produtos:['Produtos','Preço, margem e perda — calculados das compras e vendas'],
      estoque:['Estoque','Quantidade por produto — entradas − perdas − saídas'],
      funcionarios:['Funcionários','Salários, adiantamentos e valores a pagar'],
      veiculos:['Veículos','Frota — gasolina, manutenção e multas por carro'],
      bancos:['Bancos','Contas da empresa — de onde sai cada lançamento'],
      financeiro:['Financeiro','Resultado, ciclo de caixa e lançamentos de custos'],
      relatorios:['Relatórios','Clientes, pedidos e lançamentos do período']
    };

    // ---- clientes ----
    const clientesRaw = this.state.clientes;
    const pedidosRaw = this.state.pedidos;
    const avg = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0;
    const fmtPct1 = n => n.toFixed(1).replace('.',',')+'%';
    const totalTicket = clientesRaw.reduce((s,x)=>s+(x.ticketMes||0),0) || 1;
    const ativos = clientesRaw.filter(x=>x.status==='ativo');
    const nAtivos = ativos.length;
    const periodo = this.state.periodo;
    const periodOptions = [ {v:'all',l:'Todos os períodos'}, {v:'06',l:'Junho 2026'}, {v:'05',l:'Maio 2026'}, {v:'04',l:'Abril 2026'} ];
    const periodLabel = (periodOptions.find(o=>o.v===periodo)||periodOptions[1]).l;
    const pedidosPeriodo = periodo==='all' ? pedidosRaw : pedidosRaw.filter(p=>this.monthOf(p.entrega)===periodo);
    const entregues = pedidosPeriodo.filter(p=>p.status==='Entregue');
    const receitaFat = entregues.reduce((s,p)=>s+(p.valor||0),0);
    const aReceber = pedidosPeriodo.filter(p=>p.pag==='Atrasado'||p.pag==='Pendente').reduce((s,p)=>s+(p.valor||0),0);
    const nAtraso = pedidosPeriodo.filter(p=>p.pag==='Atrasado').length;
    // inadimplência: quanto do faturado está atrasado (vivo, vem dos pedidos)
    const valorAtraso = pedidosPeriodo.filter(p=>p.pag==='Atrasado').reduce((s,p)=>s+(p.valor||0),0);
    const inadMedia = receitaFat>0 ? valorAtraso/receitaFat*100 : 0;
    // perda sobre o que foi COMPRADO: na coleta (entrada) + no depósito depois
    const entradasRaw = this.state.entradas;
    const entradasPeriodo = periodo==='all' ? entradasRaw : entradasRaw.filter(en=>this.monthOf(en.data)===periodo);
    const entKgTot = entradasPeriodo.reduce((s,en)=>s+(en.pesoKg||0),0);
    const perdasDep = periodo==='all' ? (this.state.perdas||[]) : (this.state.perdas||[]).filter(p=>this.monthOf(p.data)===periodo);
    const perdaDepTot = perdasDep.reduce((s,p)=>s+(+p.qtd||0),0);
    const entPerdaTot = entradasPeriodo.reduce((s,en)=>s+(en.perdaKg||0),0) + perdaDepTot;
    const perdaMedia = entKgTot ? (entPerdaTot/entKgTot*100) : 0;
    // Tickets calculados a partir dos pedidos entregues no período
    const nEntregas = entregues.length;
    const clientesAtendidos = new Set(entregues.map(p=>p.cliente)).size;
    const ticketEntregaReal = nEntregas ? receitaFat / nEntregas : 0;
    const ticketMesReal = clientesAtendidos ? receitaFat / clientesAtendidos : 0;
    const cd = clientesRaw;
    // faturado e nº de entregas por cliente (pedidos entregues no período)
    const fatByClient = {}, entByClient = {}, atrasoByClient = {};
    entregues.forEach(p => { fatByClient[p.cliente] = (fatByClient[p.cliente]||0) + (p.valor||0); entByClient[p.cliente] = (entByClient[p.cliente]||0) + 1; });
    pedidosPeriodo.filter(p=>p.pag==='Atrasado').forEach(p => { atrasoByClient[p.cliente] = (atrasoByClient[p.cliente]||0) + (p.valor||0); });
    // inadimplência por cliente: % do faturado dele que está atrasado
    const inadOf = nome => { const f = fatByClient[nome]||0; return f>0 ? (atrasoByClient[nome]||0)/f*100 : 0; };
    const clientes = cd.map(c => {
      const cFat = fatByClient[c.nome] || 0, cEnt = entByClient[c.nome] || 0;
      const cTE = cEnt ? Math.round(cFat/cEnt) : 0;
      const cIn = inadOf(c.nome);
      const st = this.statusMap(c.status), hm = this.healthMap(this.healthOf(c, cIn, cTE));
      return { nome:c.nome, resp:c.resp, rota:c.rota, freq:c.freq, statusLabel:st.l,
        ticketMes: !isAdmin? '—' : (cFat? 'R$ '+cFat.toLocaleString('pt-BR'):'—'),
        ticketEntrega: !isAdmin? '—' : (cTE? 'R$ '+cTE.toLocaleString('pt-BR'):'—'),
        entregaColor: !isAdmin? '#6b7a6f' : (cTE>=430? this.GREEN : (cTE>=150? this.AMBER : this.RED)),
        part: !isAdmin? '—' : (receitaFat? Math.round(cFat/receitaFat*100):0)+'%',
        inad: !isAdmin? '—' : cIn.toFixed(1).replace('.',',')+'%',
        inadColor: !isAdmin? '#6b7a6f' : (cIn<=1? this.GREEN : (cIn<=2? this.AMBER : this.RED)),
        tend:c.tend, healthColor:hm.c, healthBg:hm.bg, healthLabel:hm.l,
        open:() => this.openCliente(c.id) };
    });

    const cnt = st => clientesRaw.filter(x=>x.status===st).length;
    const statusFilters = [
      { label:'Todos', color:'#6b7a6f', count:clientesRaw.length },
      { label:'Ativo', color:this.GREEN, count:cnt('ativo') },
      { label:'Em negociação', color:this.AMBER, count:cnt('negociacao') },
      { label:'Inadimplente', color:this.RED, count:cnt('inadimplente') },
      { label:'Inativo', color:'#6b7a6f', count:cnt('inativo') }
    ];

    // ---- selected cliente detail ----
    const c = {  limite:0, prazo:0, ticketMes:0, ticketEntrega:0, volume:0, nome:'', resp:'', cnpj:'—', tel:'—', endereco:'—', ult:'—', tend:'→', rota:'—', freq:'—', forma:'—', cobranca:'—', obs:'', status:'ativo', ...(cd.find(x => x.id === this.state.clienteId) || cd[0] || {}) };
    // métricas do cliente calculadas dos pedidos entregues no período
    const cEntregues = entregues.filter(p => p.cliente === c.nome);
    const cFaturado = cEntregues.reduce((s,p)=>s+(p.valor||0),0);
    const cVolume = cEntregues.reduce((s,p)=>s+(p.pesoKg||0),0);
    const cTicketEntrega = cEntregues.length ? Math.round(cFaturado/cEntregues.length) : 0;
    const cPart = receitaFat ? Math.round(cFaturado/receitaFat*100) : 0;
    const cAllPeds = pedidosRaw.filter(p=>p.cliente===c.nome);
    const cAtrasados = cAllPeds.filter(p=>p.pag==='Atrasado');
    const cInad = inadOf(c.nome);
    const cCobranca = cAtrasados.length>0 ? 'Atrasado' : 'Em dia';
    const stc = this.statusMap(c.status) || {l:''}, hmc = this.healthMap(this.healthOf(c, cInad, cTicketEntrega));
    // TODO5: última compra automática
    const cUltPed = cAllPeds.filter(p=>p.status==='Entregue').sort((a,b)=>(b.entrega||'').localeCompare(a.entrega||''))[0];
    const cUlt = cUltPed ? this._fmtDate(cUltPed.entrega) : '—';
    const initials = (c.nome||'').split(' ').filter(w=>w.length>2).slice(0,2).map(w=>w[0]).join('').toUpperCase();
    const sel = {
      nome:c.nome, resp:c.resp, cnpj:c.cnpj, tel:c.tel, endereco:c.endereco, initials,
      statusLabel:stc.l, healthColor:hmc.c, healthBg:hmc.bg, healthFull:hmc.f, obs:c.obs,
      metricas:[
        { label:'Qtd no período', value:cVolume.toLocaleString('pt-BR'), sub:cEntregues.length+' entrega(s)', color:'#16241b' },
        { label:'Faturado / mês', value:'R$ '+cFaturado.toLocaleString('pt-BR'), sub:'meta R$ 3.500–3.800', color: cFaturado>=3500?this.GREEN:(cFaturado>=2000?this.AMBER:this.RED) },
        { label:'Ticket/entrega', value:'R$ '+cTicketEntrega.toLocaleString('pt-BR'), sub:'meta ≥ R$ 430', color: cTicketEntrega>=430?this.GREEN:(cTicketEntrega>=150?this.AMBER:this.RED) },
        { label:'% do faturamento', value:cPart+'%', sub:'risco de concentração', color:'#16241b' },
        { label:'Última compra', value:cUlt, sub:'do último pedido entregue', color:'#16241b' },
        { label:'Inadimplência', value:cInad.toFixed(1).replace('.',',')+'%', sub:'meta ≤ 1% · '+cAtrasados.length+' atraso(s)', color: cInad<=1?this.GREEN:(cInad<=2?this.AMBER:this.RED) }
      ],
      cadastro:[
        { k:'Região / rota', v:c.rota }, { k:'Frequência', v:c.freq },
        { k:'Status', v:stc.l }, { k:'Forma de pagto', v:c.forma },
        { k:'Cliente desde', v:'mar/2025' }, { k:'Sequência na rota', v:'#'+c.id }
      ],
      credito:[
        { k:'Limite de crédito', v:'R$ '+c.limite.toLocaleString('pt-BR'), color:'#16241b' },
        { k:'Prazo de pagamento', v:c.prazo+' dias', color:'#16241b' },
        { k:'Taxa de inadimplência', v:cInad.toFixed(1).replace('.',',')+'%', color: cInad<=1?this.GREEN:(cInad<=2?this.AMBER:this.RED) },
        { k:'Status de cobrança', v:cCobranca, color: cCobranca==='Em dia'?this.GREEN:this.RED },
        { k:'Histórico de atrasos', v: cAtrasados.length===0 ? '0 atrasos' : (cAtrasados.length+' pedido(s) · R$ '+cAtrasados.reduce((s,p)=>s+(p.valor||0),0).toLocaleString('pt-BR')), color: cAtrasados.length? this.RED : '#16241b' }
      ],
      pedidos: pedidosRaw.filter(p => p.cliente===c.nome).slice(0,4).map(p => ({
        id:p.id, data:p.entrega, peso:(p.pesoKg||0).toLocaleString('pt-BR'), valor:'R$ '+(p.valor||0).toLocaleString('pt-BR'), status:p.status,
        statusColor:this.pStatusColor(p.status), statusBg:this.pStatusBg(p.status)
      })),
      interacoes:[
        { tipo:'Visita comercial', data:c.ult, por:'Equipe', texto:'Conferência de gôndola e ajuste de pedido. Cliente pediu mais folhosas.', color:this.GREEN },
        { tipo:'Ligação de cobrança', data:'19/06', por:'Admin', texto: cAtrasados.length>0?'Boleto em atraso — combinado pagamento via PIX até sexta.':'Confirmação de recebimento — tudo em dia.', color: cAtrasados.length>0?this.RED:this.GREEN },
        { tipo:'WhatsApp', data:'10/06', por:'Admin', texto:'Envio da tabela de preços da semana e disponibilidade de batata.', color:'#2f6fb0' }
      ]
    };
    if (sel.pedidos.length === 0) sel.pedidos = [{ id:'—', data:'—', peso:'—', valor:'sem pedidos no período', status:'—', statusColor:'#6b7a6f', statusBg:'#f0f3ed' }];

    // ---- disponibilidade em estoque (para avisar venda a descoberto) ----
    const _prodName = {}; this.state.produtos.forEach(p => _prodName[String(p.id)] = p.nome);
    const _k = it => String(it.produtoId||it.nome)+'|'+(it.un||'KG');
    const availMap = {};
    const _bump = (k, campo, v) => { if(!availMap[k]) availMap[k]={entrou:0,perda:0,saiu:0}; availMap[k][campo]+=v; };
    entradasRaw.forEach(en => (en.itens||[]).forEach(it => { _bump(_k(it),'entrou',+it.kg||0); _bump(_k(it),'perda',+it.perdaKg||0); }));
    (this.state.perdas||[]).forEach(pe => _bump(String(pe.produtoId||pe.nome)+'|'+(pe.un||'KG'),'perda',+pe.qtd||0));
    const draftPedidoId = (this.state.modal==='pedido' && this.state.draft) ? this.state.draft.id : null;
    pedidosRaw.filter(p=>p.status!=='Cancelado'&&p.status!=='Devolvido'&&p.id!==draftPedidoId).forEach(p => (p.itens||[]).forEach(it => _bump(_k(it),'saiu',+it.kg||0)));
    const dispDe = it => { const o = availMap[_k(it)]; return o ? o.entrou-o.perda-o.saiu : 0; };

    // ---- itens do pedido (form) ----
    let itemRows = [], noItens = false, pedTotals = { peso:'0 kg', valor:'R$ 0', perdaKg:'0 kg', perdaPct:'0%', perdaColor:this.GREEN };
    let entTotals = { peso:'0 kg', valor:'R$ 0' };
    let estoqueAlertas = [], temAlertaEstoque = false;
    if ((this.state.modal === 'pedido' || this.state.modal === 'entrada') && this.state.draft) {
      const its = this.state.draft.itens || [];
      const isVenda = this.state.modal === 'pedido';
      noItens = its.length === 0;
      itemRows = its.map((it,i) => {
        const pct = it.kg ? (it.perdaKg/it.kg*100) : 0;
        const disp = isVenda && it.produtoId ? dispDe(it) : null;
        const falta = disp!=null && (+it.kg||0) > disp;
        if (falta) estoqueAlertas.push({ txt:(it.nome||'item')+': pedindo '+(+it.kg||0).toLocaleString('pt-BR')+' '+(it.un||'KG')+', disponível '+disp.toLocaleString('pt-BR') });
        return { idx:i, produtoId:String(it.produtoId||''), un:it.un||'KG', kg:it.kg, preco:it.preco, perdaKg:it.perdaKg,
          perdaPct: it.kg ? pct.toFixed(1).replace('.',',')+'%' : '—',
          perdaColor: pct<=10?this.GREEN:(pct<=15?this.AMBER:this.RED),
          dispTxt: disp==null ? '' : (disp.toLocaleString('pt-BR')+' disp.'),
          dispColor: falta ? this.RED : '#6b7a6f',
          kgBorder: falta ? '#d6334a' : '#d3dbcf',
          subtotal:'R$ '+Math.round((+it.kg||0)*(+it.preco||0)).toLocaleString('pt-BR'),
          remove:()=>this.removeItem(i) };
      });
      temAlertaEstoque = estoqueAlertas.length > 0;
      const pk = its.reduce((s,i)=>s+(+i.kg||0),0);
      const pv = its.reduce((s,i)=>s+(+i.kg||0)*(+i.preco||0),0);
      const pp = its.reduce((s,i)=>s+(+i.perdaKg||0),0);
      const ppct = pk ? pp/pk*100 : 0;
      pedTotals = { peso:pk.toLocaleString('pt-BR'), valor:'R$ '+Math.round(pv).toLocaleString('pt-BR'),
        perdaKg:pp.toLocaleString('pt-BR'), perdaPct:ppct.toFixed(1).replace('.',',')+'%',
        perdaColor: ppct<=10?this.GREEN:(ppct<=15?this.AMBER:this.RED) };
      entTotals = { peso:pk.toLocaleString('pt-BR'), valor:'R$ '+Math.round(pv).toLocaleString('pt-BR'),
        perdaKg:pp.toLocaleString('pt-BR'), perdaPct:ppct.toFixed(1).replace('.',',')+'%',
        perdaColor: ppct<=10?this.GREEN:(ppct<=15?this.AMBER:this.RED) };
    }

    // ---- financeiro (vivo, a partir dos pedidos + lançamentos) ----
    const fmtBR = n => Math.round(n).toLocaleString('pt-BR');
    const compraMercadoria = entradasPeriodo.reduce((s,en)=>s+(en.valor||0),0);
    const lancRaw = this.state.lancamentos;
    const lancPeriodo = periodo==='all' ? lancRaw : lancRaw.filter(l=>this.monthOf(l.data)===periodo);
    const VCOR = { 'Gasolina':['#8a5a2a','#f7f4ec'], 'Manutenção dos Carros':['#17642f','#e7f1e8'], 'Multa':['#b3283d','#fbe7ea'] };
    const brMoney = n => 'R$ ' + Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:2, maximumFractionDigits:2});
    const ddmm = iso => { const m = String(iso||'').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? m[3]+'/'+m[2] : String(iso||''); };
    const lancVeicPer = lancPeriodo.filter(l => String(l.veiculoId||'') !== '');
    const veicRows = this.state.veiculos.map(v => {
      const meus = lancVeicPer.filter(l => String(l.veiculoId)===String(v.id)).slice().sort((a,b)=>String(b.data||'').localeCompare(String(a.data||'')));
      const gasto = meus.reduce((s,l)=>s+(l.valor||0),0);
      const aberto = this.state.veicAberto === v.id;
      return {
        nome: [v.marca, v.modelo].filter(Boolean).join(' ') || v.placa, placa: v.placa, ano: v.ano || '—', inativo: v.ativo === 'nao', obs: v.obs || '',
        gasto: brMoney(gasto), qtd: String(meus.length), aberto, seta: aberto ? '▾' : '▸',
        resumo: meus.length ? meus.length + ' lançamento(s) no período' : 'Nenhum lançamento no período', semLancs: meus.length === 0,
        lancs: meus.map(l => ({ data: ddmm(l.data), categoria: l.categoria === 'Manutenção dos Carros' ? 'Manutenção' : l.categoria, descricao: l.descricao || '—', valor: brMoney(l.valor),
          corCat: (VCOR[l.categoria]||['#2c3a31'])[0], bgCat: (VCOR[l.categoria]||[0,'#f4f7f1'])[1], edit: () => this.editLancamento(l.id) })),
        toggle: () => this.toggleVeic(v.id),
        gasolina: ev => this.lancarVeiculo(v.id, 'Gasolina', ev),
        manutencao: ev => this.lancarVeiculo(v.id, 'Manutenção dos Carros', ev),
        multa: ev => this.lancarVeiculo(v.id, 'Multa', ev),
        edit: ev => this.editVeiculo(v.id, ev)
      };
    });
    const somaCat = c => lancVeicPer.filter(l=>l.categoria===c).reduce((s,l)=>s+(l.valor||0),0);
    const perLbl = periodLabel;
    const veicStats = [
      { label:'Veículos', value:String(this.state.veiculos.length), sub: this.state.veiculos.filter(v=>v.ativo!=='nao').length + ' ativo(s) · cadastro completo' },
      { label:'Gasto da frota', value: brMoney(lancVeicPer.reduce((s,l)=>s+(l.valor||0),0)), sub: perLbl },
      { label:'Gasolina', value: brMoney(somaCat('Gasolina')), sub: perLbl },
      { label:'Manutenção', value: brMoney(somaCat('Manutenção dos Carros')), sub: perLbl },
      { label:'Multa', value: brMoney(somaCat('Multa')), sub: perLbl }
    ];
    const noVeic = this.state.veiculos.length === 0;
    const bCod = n => (this.BANCOS_BR.find(x=>x[1]===n)||['—'])[0];
    const bancoRows = this.state.bancos.map(b => {
      const meus = lancPeriodo.filter(l => String(l.bancoId||'')===String(b.id));
      const sig = String(b.instituicao||'?').split(/\s+/).filter(w=>w.length>2||/^[A-Z]/.test(w)).slice(0,2).map(w=>w[0]).join('').toUpperCase();
      return { nome:b.instituicao, codigo:'Cód. '+bCod(b.instituicao), sigla:sig, conta:[b.agencia,b.conta].filter(Boolean).join(' / ')||'—', apelido:b.apelido||'—', inativo:b.ativo==='nao',
        saidas:brMoney(meus.reduce((s,l)=>s+(l.valor||0),0)), qtd:String(meus.length), edit:()=>this.editBanco(b.id),
        ...(() => { const v = (+b.saldoInicial||0) - this.state.lancamentos.filter(l=>String(l.bancoId||'')===String(b.id)).reduce((s,l)=>s+(l.valor||0),0); return { saldo:(v<0?'−R$ ':'R$ ')+Number(Math.abs(v)).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}), saldoColor: v<0?'#b3283d':'#16241b' }; })() };
    });
    const semB = lancPeriodo.filter(l => !l.bancoId);
    const WDS = ['dom','seg','ter','qua','qui','sex','sáb'];
    const diarPer = lancPeriodo.filter(l => l.categoria==='Diária').slice().sort((a,b)=>String(b.data||'').localeCompare(String(a.data||'')));
    const diariaRows = diarPer.map(l => { const bk = this.state.bancos.find(b=>String(b.id)===String(l.bancoId||'')); const dt = new Date(String(l.data)+'T12:00:00').getTime();
      return { data: ddmm(l.data), semana: isNaN(dt) ? '' : WDS[new Date(dt).getDay()], diarista: l.diarista || '—', servico: l.descricao || '—', valor: brMoney(l.valor),
        banco: bk ? bk.instituicao : 'Sem banco', bancoColor: bk ? '#435349' : '#9aa69d', edit: () => this.editDiaria(l.id) }; });
    const diariaStats = [
      { label:'Diárias lançadas', value:String(diarPer.length), sub: periodLabel },
      { label:'Total em diárias', value: brMoney(diarPer.reduce((s,l)=>s+(l.valor||0),0)), sub: periodLabel },
      { label:'Diaristas', value:String(new Set(diarPer.map(l=>l.diarista).filter(Boolean)).size), sub:'pessoas diferentes' }
    ];
    const diaristaNomes = [...new Set(this.state.lancamentos.filter(l=>l.categoria==='Diária' && l.diarista).map(l=>l.diarista))].map(v=>({ v }));
    const fv = this.state.funcView || 'equipe';
    const lancTotal = lancPeriodo.reduce((s,l)=>s+(l.valor||0),0);
    const receitaBruta = receitaFat; // vem dos pedidos entregues no período
    const custoTotal = compraMercadoria + lancTotal;
    const lucroLiquido = receitaBruta - custoTotal;
    const pctLucro = receitaBruta ? lucroLiquido/receitaBruta*100 : 0;
    // saldo em caixa (todas as épocas): vendas pagas − compras pagas − lançamentos
    const cashAll = pedidosRaw.filter(p=>p.pag==='Pago').reduce((s,p)=>s+(p.valor||0),0)
      - entradasRaw.filter(e=>e.pago==='Pago').reduce((s,e)=>s+(e.valor||0),0)
      - lancRaw.reduce((s,l)=>s+(l.valor||0),0);
    // preço médio por produto: compra das entradas, venda das saídas
    const compraByProd = {}, vendaByProd = {};
    entradasRaw.forEach(en => (en.itens||[]).forEach(it => { const k=String(it.produtoId||it.nome); if(!compraByProd[k])compraByProd[k]={q:0,t:0}; compraByProd[k].q+=(+it.kg||0); compraByProd[k].t+=(+it.kg||0)*(+it.preco||0); }));
    pedidosRaw.filter(p=>p.status!=='Cancelado').forEach(p => (p.itens||[]).forEach(it => { const k=String(it.produtoId||it.nome); if(!vendaByProd[k])vendaByProd[k]={q:0,t:0}; vendaByProd[k].q+=(+it.kg||0); vendaByProd[k].t+=(+it.kg||0)*(+it.preco||0); }));
    const markups = this.state.produtos.map(p => {
      const cb = compraByProd[String(p.id)]||compraByProd[p.nome], vb = vendaByProd[String(p.id)]||vendaByProd[p.nome];
      const cm = cb&&cb.q? cb.t/cb.q : (p.compra||0), vm = vb&&vb.q? vb.t/vb.q : (p.venda||0);
      return cm>0&&vm>0 ? (vm-cm)/cm*100 : null;
    }).filter(v=>v!=null);
    const markupMedio = markups.length ? markups.reduce((a,b)=>a+b,0)/markups.length : 0;

    // ---- ciclo de caixa (recebimento vem dos pedidos; estoque, do giro dos produtos) ----
    const pagosPeriodo = pedidosPeriodo.filter(p=>p.status==='Entregue' && p.recebDias>0);
    const cicloReceb = pagosPeriodo.length ? Math.round(avg(pagosPeriodo.map(p=>p.recebDias))) : 12;
    // giro de estoque: dias que o saldo atual duraria no ritmo de saída
    let qEnt=0, qPer=0, qSai=0;
    entradasRaw.forEach(en => (en.itens||[]).forEach(it => { qEnt+=(+it.kg||0); qPer+=(+it.perdaKg||0); }));
    pedidosRaw.filter(p=>p.status!=='Cancelado'&&p.status!=='Devolvido').forEach(p => (p.itens||[]).forEach(it => { qSai+=(+it.kg||0); }));
    const cicloEst = qSai>0 ? Math.max(1, Math.round(Math.max(0,qEnt-qPer-qSai)/(qSai/30))) : 4;
    const cicloPag = 3; // prazo de pagamento ao produtor (referência do estudo)
    const cicloDias = cicloEst + cicloReceb - cicloPag;
    const cicloColor = cicloDias<=13 ? this.GREEN : (cicloDias<=16 ? this.AMBER : this.RED);
    const cicloSum = cicloPag + cicloEst + cicloReceb || 1;

    // ---- dashboard ----
    const statCards = [
      { label:'Receita bruta', value:'R$ '+fmtBR(receitaBruta), delta:entregues.length+' pedido(s) entregue(s) · '+periodLabel, deltaColor:this.GREEN },
      { label:'Lucro líquido op.', value:'R$ '+fmtBR(lucroLiquido), delta:pctLucro.toFixed(1).replace('.',',')+'% s/ receita', deltaColor: lucroLiquido>0?this.GREEN:this.RED },
      { label:'Ciclo de caixa', value:cicloDias+(cicloDias===1?' dia':' dias'), delta:'meta ≤ 13 dias', deltaColor: cicloColor },
      { label:'Minimercados ativos', value:String(nAtivos), delta:(nAtivos-20>=0?'+'+(nAtivos-20):String(nAtivos-20))+' vs. equilíbrio (20)', deltaColor: nAtivos>=20?this.GREEN:this.RED }
    ];
    const kpis = [
      { label:'Índice de perdas (%)', real:fmtPct1(perdaMedia), meta:'≤ 10%', pct:Math.min(100,Math.round(perdaMedia/10*100))+'%', color: perdaMedia<=10?this.GREEN:(perdaMedia<=13?this.AMBER:this.RED), tag: perdaMedia<=10?'na meta':'fora' },
      { label:'Markup médio (venda/compra)', real:Math.round(markupMedio)+'%', meta:'≥ 60%', pct:Math.min(100,Math.round(markupMedio/60*100))+'%', color: markupMedio>=60?this.GREEN:this.RED, tag: markupMedio>=60?'na meta':'fora' },
      { label:'Nº de minimercados ativos', real:String(nAtivos), meta:'~35', pct:Math.min(100,Math.round(nAtivos/35*100))+'%', color: nAtivos>=35?this.GREEN:(nAtivos>=25?this.AMBER:this.RED), tag:(nAtivos-35>=0?'+':'')+(nAtivos-35) },
      { label:'Ticket médio / minimercado', real:'R$ '+Math.round(ticketMesReal).toLocaleString('pt-BR'), meta:'3,5–3,8k', pct:Math.min(100,Math.round(ticketMesReal/3800*100))+'%', color: ticketMesReal>=3500?this.GREEN:(ticketMesReal>=3000?this.AMBER:this.RED), tag: ticketMesReal>=3500?'na meta':'quase' },
      { label:'Ticket médio por entrega', real:'R$ '+Math.round(ticketEntregaReal).toLocaleString('pt-BR'), meta:'≥ R$ 430', pct:Math.min(100,Math.round(ticketEntregaReal/430*100))+'%', color: ticketEntregaReal>=430?this.GREEN:(ticketEntregaReal>=150?this.AMBER:this.RED), tag:(ticketEntregaReal>=430?'na meta':'-R$'+Math.round(430-ticketEntregaReal)) },
      { label:'Inadimplência por cliente', real:fmtPct1(inadMedia), meta:'≤ 1%', pct:Math.min(100,Math.round(inadMedia*100))+'%', color: inadMedia<=1?this.GREEN:(inadMedia<=2?this.AMBER:this.RED), tag: inadMedia<=1?'na meta':'fora' },
      { label:'Giro de estoque (dias)', real:cicloEst.toString().replace('.',','), meta:'≤ 4 d', pct:Math.min(100,Math.round(cicloEst/4*100))+'%', color: cicloEst<=4?this.GREEN:this.AMBER, tag: cicloEst<=4?'na meta':'+'+(cicloEst-4)+'d' },
      { label:'Ciclo de caixa (dias)', real:String(cicloDias), meta:'≤ 13 d', pct:Math.min(100,Math.round(cicloDias/13*100))+'%', color: cicloColor, tag: cicloDias<=13?'na meta':'+'+(cicloDias-13)+'d' }
    ];
    const cartArr = Object.keys(fatByClient).map(nome => ({ nome, fat:fatByClient[nome] })).filter(x=>x.fat>0).sort((a,b)=>b.fat-a.fat);
    const cartDen = receitaFat || 1;
    const cartTop = cartArr.slice(0,5);
    const cartRest = cartArr.slice(5).reduce((s,x)=>s+x.fat,0);
    const cartMax = cartTop.length ? cartTop[0].fat/cartDen*100 : 1;
    const carteira = cartTop.map(x => { const sh = x.fat/cartDen*100; return { nome:x.nome, pct:Math.round(sh)+'%', bar:(cartMax?Math.round(sh/cartMax*100):0)+'%', color: sh>15?this.RED:'#1d7a3e' }; });
    if (cartRest > 0) carteira.push({ nome:'Demais '+(cartArr.length-5)+' clientes', pct:Math.round(cartRest/cartDen*100)+'%', bar:'100%', color:'#c3cdbf' });
    const top5Txt = 'Top 5 = ' + Math.round(cartTop.reduce((s,x)=>s+x.fat,0)/cartDen*100) + '% do faturamento';
    const cenBase = Math.max(lucroLiquido, 1);
    const cenPess = Math.round(cenBase*0.55), cenOtim = Math.round(cenBase*1.5);
    const cenScale = Math.max(cenOtim, lucroLiquido, 1);
    const cenarios = [
      { nome:'Pessimista', valor:'R$ '+fmtBR(cenPess), bar:Math.round(cenPess/cenScale*100)+'%', color:'#d8c9a8', txtColor:'#66756a', weight:500 },
      { nome:'Realista', valor:'R$ '+fmtBR(lucroLiquido), bar:Math.round(Math.max(0,lucroLiquido)/cenScale*100)+'%', color:this.GREEN, txtColor:this.GREEN, weight:700 },
      { nome:'Otimista', valor:'R$ '+fmtBR(cenOtim), bar:'100%', color:'#f0cc6e', txtColor:'#1d7a3e', weight:500 }
    ];
    const realizadoTxt = 'Realizado (lucro líquido) — R$ '+fmtBR(lucroLiquido)+' ('+pctLucro.toFixed(1).replace('.',',')+'% s/ receita).';
    const mixDots = [
      { nome:'Batata', x:'82%', y:'68%', size:'30px', color:this.GREEN },
      { nome:'Cebola', x:'78%', y:'70%', size:'26px', color:this.GREEN },
      { nome:'Cenoura', x:'74%', y:'62%', size:'22px', color:this.GREEN },
      { nome:'Banana', x:'76%', y:'66%', size:'24px', color:this.GREEN },
      { nome:'Tomate', x:'66%', y:'52%', size:'22px', color:this.GREEN },
      { nome:'Folhosas', x:'33%', y:'22%', size:'24px', color:this.AMBER },
      { nome:'Maçã premium', x:'28%', y:'26%', size:'18px', color:'#7a5d8f' },
      { nome:'Pimentão premium', x:'38%', y:'30%', size:'18px', color:'#7a5d8f' }
    ];

    // ---- pedidos ----
    const pedidoStats = [
      { label:'Pedidos no período', value:String(pedidosPeriodo.length), sub:periodLabel, color:'#66756a' },
      { label:'Faturado (entregue)', value: isAdmin? 'R$ '+Math.round(receitaFat).toLocaleString('pt-BR') : '—', sub:entregues.length+' pedidos entregues', color:this.GREEN },
      { label:'A receber / atrasado', value: isAdmin? 'R$ '+Math.round(aReceber).toLocaleString('pt-BR') : '—', sub:nAtraso+' pedido(s) em atraso', color: aReceber>0?this.RED:this.GREEN },
      { label:'Qtd entregue', value:pedidosPeriodo.filter(p=>p.status==='Entregue').reduce((s,p)=>s+(p.pesoKg||0),0).toLocaleString('pt-BR'), sub:'no período', color:'#66756a' }
    ];
    const pedidos = pedidosPeriodo.map(p => {
      const pct = p.pesoKg ? p.perdaKg/p.pesoKg*100 : 0;
      return { id:p.id, cliente:p.cliente, rota:p.rota, entrega:this._fmtDate(p.entrega),
        itensTxt: (p.itens||[]).map(i=>(i.nome||'—')+' '+(+i.kg||0).toLocaleString('pt-BR')+' '+(i.un||'KG')).join(' · '),
        peso:(p.pesoKg||0).toLocaleString('pt-BR'), valor: isAdmin? 'R$ '+(p.valor||0).toLocaleString('pt-BR') : '—',
        status:p.status, pag: isAdmin? p.pag : '—',
        receb: !isAdmin? '—' : ((p.status==='Entregue' && p.recebDias>0) ? p.recebDias+' d' : '—'),
        recebColor: !isAdmin? '#6b7a6f' : (p.pag==='Pago'?this.GREEN:(p.pag==='Atrasado'?this.RED:'#6b7a6f')),
        perda:pct.toFixed(1).replace('.',',')+'%',
        perdaColor: pct<=10?this.GREEN:(pct<=15?this.AMBER:this.RED),
        statusColor:this.pStatusColor(p.status), statusBg:this.pStatusBg(p.status),
        pagColor: isAdmin? this.pPagColor(p.pag) : '#6b7a6f', pagBg: isAdmin? this.pPagBg(p.pag) : '#f0f3ed',
        canMarkPago: isAdmin && p.pag!=='Pago' && p.status!=='Cancelado',
        isPago: isAdmin && p.pag==='Pago',
        pagInfo: p.pag==='Pago' && p.dataPag ? (p.formaPag||'')+' · '+p.dataPag : '',
        markPago:(e)=>this.openPagamento(p.id, e),
        edit:()=>this.editPedido(p.id) };
    });

    // ---- fornecedores ----
    // preço médio de compra por fornecedor, a partir das entradas (compras)
    const avgCompraByForn = {};
    entradasRaw.forEach(en => {
      let kg=0, tot=0;
      (en.itens||[]).forEach(it => { kg+=(+it.kg||0); tot+=(+it.kg||0)*(+it.preco||0); });
      if (kg>0) { if(!avgCompraByForn[en.fornecedor]) avgCompraByForn[en.fornecedor]={kg:0,tot:0}; avgCompraByForn[en.fornecedor].kg+=kg; avgCompraByForn[en.fornecedor].tot+=tot; }
    });
    // variação = preço médio da última compra vs. a compra anterior do mesmo fornecedor
    const precoMedioEntrada = en => { let kg=0,tot=0; (en.itens||[]).forEach(it=>{kg+=(+it.kg||0); tot+=(+it.kg||0)*(+it.preco||0);}); return kg>0? tot/kg : null; };
    const variaOf = f => {
      const es = entradasRaw.filter(en=>en.fornecedor===f.nome).slice().sort((a,b)=>String(b.data||'').localeCompare(String(a.data||'')));
      if (es.length < 2) return null;
      const atual = precoMedioEntrada(es[0]), ant = precoMedioEntrada(es[1]);
      if (atual==null || !ant) return null;
      return (atual - ant)/ant*100;
    };
    const variasComDados = this.state.fornecedores.map(variaOf).filter(v => v!=null);
    const variaMedia = variasComDados.length ? variasComDados.reduce((s,v)=>s+v,0)/variasComDados.length : 0;
    const fornecedores = this.state.fornecedores.map(f => {
      const v = variaOf(f);
      const vTxt = v==null ? '—' : (v>0?'+':'')+v.toFixed(1).replace('.',',')+'%';
      const vColor = v==null ? '#6b7a6f' : (Math.abs(v)>=7?this.RED:(Math.abs(v)>=4?this.AMBER:this.GREEN));
      const a = avgCompraByForn[f.nome];
      const precoReal = a && a.kg>0 ? a.tot/a.kg : 0;
      // última coleta e aproveitamento das entradas
      const entsF = entradasRaw.filter(en=>en.fornecedor===f.nome);
      const ultColeta = entsF.length ? entsF.sort((a,b)=>(b.data||'').localeCompare(a.data||''))[0].data : '—';
      const fKg = entsF.reduce((s,en)=>s+(en.pesoKg||0),0);
      const fPerda = entsF.reduce((s,en)=>s+(en.perdaKg||0),0);
      const aproveit = fKg>0 ? ((fKg-fPerda)/fKg*100) : 0;
      return { nome:f.nome, regiao:f.regiao, contato:f.contato,
        produtos:f.produtos||[], preco: precoReal>0 ? 'R$ '+precoReal.toFixed(2).replace('.',',') : '—',
        varia:vTxt, varColor:vColor,
        coleta: ultColeta==='—' ? '—' : this._fmtDate(ultColeta), qualidade: fKg>0 ? aproveit.toFixed(0)+'%' : '—',
        edit:()=>this.editFornecedor(f.id) };
    });
    const fornSummary = {
      varia:{ v: variasComDados.length ? (variaMedia>0?'+':'')+variaMedia.toFixed(1).replace('.',',')+'%' : '—', color: Math.abs(variaMedia)>=7?this.RED:this.AMBER, sub:'última compra vs. anterior · ±7% CEASA' }
    };

    // ---- produtos ----
    // perda realizada a partir dos itens das ENTRADAS (compras), acumula por produto
    const lossByProd = {};
    (this.state.perdas||[]).forEach(pe => {
      const k = String(pe.produtoId || pe.nome);
      if (!lossByProd[k]) lossByProd[k] = { kg:0, perdaKg:0 };
      lossByProd[k].perdaKg += (+pe.qtd||0);
    });
    entradasRaw.forEach(en => (en.itens||[]).forEach(it => {
      const k = String(it.produtoId || it.nome);
      if (!lossByProd[k]) lossByProd[k] = { kg:0, perdaKg:0 };
      lossByProd[k].kg += (+it.kg||0); lossByProd[k].perdaKg += (+it.perdaKg||0);
    }));
    let totProdKg = 0, totProdPerda = 0;
    Object.keys(lossByProd).forEach(k => { totProdKg += lossByProd[k].kg; totProdPerda += lossByProd[k].perdaKg; });
    const produtoPerdaMedia = totProdKg ? (totProdPerda/totProdKg*100) : null;
    const produtoPerdaMediaTxt = produtoPerdaMedia==null ? 'sem dados' : produtoPerdaMedia.toFixed(1).replace('.',',')+'%';
    const produtoPerdaMediaColor = produtoPerdaMedia==null ? '#6b7a6f' : (produtoPerdaMedia<=10?this.GREEN:(produtoPerdaMedia<=15?this.AMBER:this.RED));
    const produtos = this.state.produtos.map(p => {
      const cb = compraByProd[String(p.id)]||compraByProd[p.nome], vb = vendaByProd[String(p.id)]||vendaByProd[p.nome];
      const cm = cb&&cb.q? cb.t/cb.q : (p.compra||0), vm = vb&&vb.q? vb.t/vb.q : (p.venda||0);
      const mk = cm>0&&vm>0 ? (vm-cm)/cm*100 : null;
      const mgR = vm-cm; const mgP = vm? mgR/vm*100 : 0;
      const lp = lossByProd[String(p.id)] || lossByProd[p.nome];
      const rpct = lp && lp.kg ? lp.perdaKg/lp.kg*100 : null;
      return { nome:p.nome, dotColor:'#1d7a3e', un:p.un||'KG',
        compra: cm>0? 'R$ '+cm.toFixed(2).replace('.',',') : '—',
        venda: vm>0? 'R$ '+vm.toFixed(2).replace('.',',') : '—',
        margem: (cm>0&&vm>0)? ('R$ '+mgR.toFixed(2).replace('.',',')+' · '+Math.round(mgP)+'%') : '—',
        markup: mk==null? '—' : Math.round(mk)+'%', markupColor: mk==null? '#6b7a6f' : (mk>=60?this.GREEN:this.RED),
        perda: rpct==null ? '—' : rpct.toFixed(1).replace('.',',')+'%',
        perdaColor: rpct==null ? '#6b7a6f' : (rpct<=10?this.GREEN:(rpct<=15?this.AMBER:this.RED)),
        edit:()=>this.editProduto(p.id) };
    });

    // ---- resultado financeiro (linhas de custo para a tela) ----
    const finCustos = [{ label:'Compra de mercadoria (das entradas)', value:fmtBR(compraMercadoria) }]
      .concat(this.LANC_CATS.filter(c=>{ let t=0; lancPeriodo.forEach(l=>{ if(l.categoria===c) t+=(l.valor||0); }); return t>0; }).map(c => { let t=0; lancPeriodo.forEach(l=>{ if(l.categoria===c) t+=(l.valor||0); }); return { label:c, value:fmtBR(t) }; }));

    // ---- entradas (tela) ----
    const entPagas = entradasPeriodo.filter(e=>e.pago==='Pago');
    const entAPagar = entradasPeriodo.filter(e=>e.pago!=='Pago').reduce((s,e)=>s+(e.valor||0),0);
    const entPesoTot = entradasPeriodo.reduce((s,e)=>s+(e.pesoKg||0),0);
    const entradaStats = [
      { label:'Coletas no período', value:String(entradasPeriodo.length), sub:periodLabel, color:'#66756a' },
      { label:'Comprado (total)', value:'R$ '+fmtBR(compraMercadoria), sub:entPagas.length+' pagas', color:this.GREEN },
      { label:'A pagar ao produtor', value:'R$ '+fmtBR(entAPagar), sub:(entradasPeriodo.length-entPagas.length)+' pendente(s)', color: entAPagar>0?this.RED:this.GREEN },
      { label:'Perda média', value:fmtPct1(perdaMedia), sub:'meta ≤ 10%', color: perdaMedia<=10?this.GREEN:(perdaMedia<=15?this.AMBER:this.RED) }
    ];
    const entradasRows = entradasPeriodo.map(en => {
      const ppct = en.pesoKg ? (en.perdaKg||0)/en.pesoKg*100 : 0;
      return {
        id:en.id, fornecedor:en.fornecedor, data:this._fmtDate(en.data),
        peso:(en.pesoKg||0).toLocaleString('pt-BR'), valor:'R$ '+(en.valor||0).toLocaleString('pt-BR'),
        perda: en.pesoKg ? ppct.toFixed(1).replace('.',',')+'%' : '—',
        perdaColor: ppct<=10?this.GREEN:(ppct<=15?this.AMBER:this.RED),
        motivo: en.motivo && en.motivo!=='—' ? en.motivo : '',
        pagInfo: en.pago==='Pago' && (en.formaPag||en.dataPag) ? (en.formaPag||'')+' · '+(en.dataPag?this._fmtDate(en.dataPag):'') : '',
        pago:en.pago, pagoColor: en.pago==='Pago'?this.GREEN:this.AMBER, pagoBg: en.pago==='Pago'?this.GBG:this.ABG,
        canPagar: en.pago!=='Pago', isPaga: en.pago==='Pago',
        itensTxt: (en.itens||[]).map(i=>(i.nome||'—')+' '+(+i.kg||0).toLocaleString('pt-BR')+' '+(i.un||'KG')).join(' · '),
        itensLista: (en.itens||[]).map(i=>({ nome:i.nome||'—', qtd:(+i.kg||0).toLocaleString('pt-BR')+' '+(i.un||'KG') })),
        pagar:(ev)=>this.marcarEntradaPaga(en.id, ev), edit:()=>this.editEntrada(en.id)
      };
    });

    // ---- estoque (entradas − perdas − saídas, por produto e unidade) ----
    const prodNameById = {}; this.state.produtos.forEach(p => prodNameById[String(p.id)] = p.nome);
    const stockMap = {};
    const skey = it => String(it.produtoId||it.nome)+'|'+(it.un||'KG');
    const snome = it => it.nome || prodNameById[String(it.produtoId)] || '—';
    entradasRaw.forEach(en => (en.itens||[]).forEach(it => { const k=skey(it); if(!stockMap[k])stockMap[k]={nome:snome(it),un:it.un||'KG',entrou:0,perda:0,saiu:0}; stockMap[k].entrou+=(+it.kg||0); stockMap[k].perda+=(+it.perdaKg||0); }));
    (this.state.perdas||[]).forEach(pe => { const k=String(pe.produtoId||pe.nome)+'|'+(pe.un||'KG'); if(!stockMap[k])stockMap[k]={nome:pe.nome||prodNameById[String(pe.produtoId)]||'—',un:pe.un||'KG',entrou:0,perda:0,saiu:0}; stockMap[k].perda+=(+pe.qtd||0); });
    pedidosRaw.filter(p=>p.status!=='Cancelado'&&p.status!=='Devolvido').forEach(p => (p.itens||[]).forEach(it => { const k=skey(it); if(!stockMap[k])stockMap[k]={nome:snome(it),un:it.un||'KG',entrou:0,perda:0,saiu:0}; stockMap[k].saiu+=(+it.kg||0); }));
    const fmtQ = n => (+n||0).toLocaleString('pt-BR');
    const estoqueRaw = Object.keys(stockMap).map(k => { const o=stockMap[k]; return { ...o, saldoN:o.entrou-o.perda-o.saiu }; }).sort((a,b)=>String(a.nome).localeCompare(String(b.nome)));
    const estoqueRows = estoqueRaw.map(o => ({ nome:o.nome, un:o.un, entrou:fmtQ(o.entrou), perda:fmtQ(o.perda), saiu:fmtQ(o.saiu), saldo:fmtQ(o.saldoN), saldoColor: o.saldoN<0?this.RED:(o.saldoN===0?'#6b7a6f':'#0f2a18') }));
    const noEstoque = estoqueRows.length===0;
    const perdasDepPeriodo = (periodo==='all' ? (this.state.perdas||[]) : (this.state.perdas||[]).filter(p=>this.monthOf(p.data)===periodo));
    const perdasRows = perdasDepPeriodo.slice().sort((a,b)=>String(b.data||'').localeCompare(String(a.data||''))).map(pe => ({
      data:this._fmtDate(pe.data), nome:pe.nome||prodNameById[String(pe.produtoId)]||'—', un:pe.un||'KG',
      qtd:fmtQ(pe.qtd), motivo:pe.motivo||'—', obs:pe.obs||'—', edit:()=>this.editPerda(pe.id)
    }));
    const noPerdas = perdasRows.length===0;
    const estoqueStats = [
      { label:'Itens com estoque', value:String(estoqueRaw.filter(o=>o.saldoN>0).length), sub:estoqueRaw.length+' item(ns) movimentados' },
      { label:'Perdas no depósito', value:String(perdasDepPeriodo.length), sub:'lançamentos no período' },
      { label:'Saídas registradas', value:String(pedidosRaw.length), sub:'todos os pedidos' }
    ];

    // ---- funcionários ----
    const funcs = this.state.funcionarios;
    const adiantByFunc = {}, salByFunc = {};
    lancPeriodo.forEach(l => { const k=String(l.funcionarioId||''); if(!k)return; if(l.categoria==='Adiantamento de salário') adiantByFunc[k]=(adiantByFunc[k]||0)+(l.valor||0); if(l.categoria==='Salário') salByFunc[k]=(salByFunc[k]||0)+(l.valor||0); });
    const funcionariosRows = funcs.map(f => {
      const ad = adiantByFunc[String(f.id)]||0, sp = salByFunc[String(f.id)]||0;
      const aPagar = Math.max(0,(f.salario||0)-ad-sp);
      const aberto = this.state.funcAberto === f.id;
      const meus = lancPeriodo.filter(l => String(l.funcionarioId||'')===String(f.id))
        .slice().sort((a,b)=>String(b.data||'').localeCompare(String(a.data||'')))
        .map(l => ({ data:this._fmtDate(l.data), categoria:l.categoria, descricao:l.descricao||'—',
          valor:'R$ '+fmtBR(l.valor||0),
          corCat: l.categoria==='Adiantamento de salário' ? '#8a5a2a' : (l.categoria==='Salário' ? '#17642f' : '#2c3a31'),
          bgCat: l.categoria==='Adiantamento de salário' ? '#f7f4ec' : (l.categoria==='Salário' ? this.GBG : '#f4f7f1'),
          edit:()=>this.editLancamento(l.id) }));
      // último salário pago (todas as épocas) e próxima data prevista
      const salLancs = lancRaw.filter(l => String(l.funcionarioId||'')===String(f.id) && l.categoria==='Salário')
        .slice().sort((a,b)=>String(b.data||'').localeCompare(String(a.data||'')));
      const ultimoPag = salLancs.length ? salLancs[0].data : null;
      const proxIso = this._proximoPag(f.diaPag, ultimoPag);
      const hojeT = this._parseDate(this._hojeIso()), proxT = this._parseDate(proxIso);
      const diasAte = (hojeT!=null && proxT!=null) ? Math.round((proxT-hojeT)/86400000) : null;
      let pagStatus, pagStatusColor, pagStatusBg;
      if (diasAte==null) { pagStatus='—'; pagStatusColor='#6b7a6f'; pagStatusBg='#f4f7f1'; }
      else if (diasAte < 0) { pagStatus='atrasado '+Math.abs(diasAte)+'d'; pagStatusColor=this.RED; pagStatusBg=this.RBG; }
      else if (diasAte <= 5) { pagStatus='vence em '+diasAte+'d'; pagStatusColor=this.AMBER; pagStatusBg=this.ABG; }
      else { pagStatus='em '+diasAte+'d'; pagStatusColor=this.GREEN; pagStatusBg=this.GBG; }
      return { nome:f.nome, cargo:f.cargo||'—', tel:f.tel||'—', salario:'R$ '+fmtBR(f.salario||0), adiantado:'R$ '+fmtBR(ad), pagoSal:'R$ '+fmtBR(sp), aPagar:'R$ '+fmtBR(aPagar), aPagarColor: aPagar>0?this.AMBER:this.GREEN, adiantar:(ev)=>this.adiantarFuncionario(f.id,ev), edit:()=>this.editFuncionario(f.id),
        ultimoPagTxt: ultimoPag ? this._fmtDate(ultimoPag) : 'nunca',
        diaPagTxt: String(f.diaPag||5),
        iniciais: String(f.nome||'?').split(' ').filter(w=>w.length>2).slice(0,2).map(w=>w[0]).join('').toUpperCase() || '?',
        proxPagTxt: this._fmtDate(proxIso), pagStatus, pagStatusColor, pagStatusBg,
        podePagar: aPagar>0, aPagarNum:aPagar,
        pagar:(ev)=>this.pagarSalario(f.id, aPagar, ev),
        quitadoTxt: aPagar>0 ? '' : 'salário do mês quitado',
        toggle:(ev)=>this.toggleFunc(f.id,ev), aberto, seta: aberto ? '▾' : '▸',
        rowBg: aberto ? '#ffffff' : 'transparent',
        lancs:meus, semLancs: meus.length===0,
        resumo: meus.length ? (meus.length+' lançamento(s) no período') : 'Nenhum lançamento no período' };
    });
    const noFunc = funcionariosRows.length===0;
    const folhaTotal = funcs.reduce((s,f)=>s+(f.salario||0),0);
    const adiantTotal = Object.keys(adiantByFunc).reduce((s,k)=>s+adiantByFunc[k],0);
    const salPagoTotal = Object.keys(salByFunc).reduce((s,k)=>s+salByFunc[k],0);
    const funcStats = [
      { label:'Funcionários', value:String(funcs.length), sub:'cadastrados' },
      { label:'Folha mensal', value:'R$ '+fmtBR(folhaTotal), sub:'soma dos salários' },
      { label:'Adiantado no período', value:'R$ '+fmtBR(adiantTotal), sub:periodLabel },
      { label:'A pagar', value:'R$ '+fmtBR(Math.max(0,folhaTotal-adiantTotal-salPagoTotal)), sub:'salários − adiantado − pago' }
    ];

    // ---- lançamentos (lista + relatório/ledger) ----
    const funcNameById = {}; funcs.forEach(f => funcNameById[String(f.id)] = f.nome);
    const lancRows = lancPeriodo.slice().sort((a,b)=>String(b.data||'').localeCompare(String(a.data||''))).map(l => ({
      data:this._fmtDate(l.data), categoria:l.categoria, descricao:l.descricao||'—',
      func: funcNameById[String(l.funcionarioId||'')]||'—',
      valor:fmtBR(l.valor||0), edit:()=>this.editLancamento(l.id)
    }));
    const noLanc = lancRows.length===0;
    const ledger = [];
    pedidosPeriodo.filter(p=>p.pag==='Pago').forEach(p => ledger.push({ d:p.dataPagIso||p.entrega, tipo:'Entrada', origem:'Venda '+p.id+' — '+p.cliente, ent:p.valor||0, sai:0 }));
    entradasPeriodo.filter(en=>en.pago==='Pago').forEach(en => ledger.push({ d:en.dataPag||en.data, tipo:'Saída', origem:'Compra '+en.id+' — '+en.fornecedor, ent:0, sai:en.valor||0 }));
    lancPeriodo.forEach(l => ledger.push({ d:l.data, tipo:'Saída', origem:l.categoria+(l.descricao?' — '+l.descricao:''), ent:0, sai:l.valor||0 }));
    ledger.sort((a,b)=>String(b.d||'').localeCompare(String(a.d||'')));
    const relLancRows = ledger.map(x => ({ data:this._fmtDate(x.d), origem:x.origem, tipo:x.tipo,
      tipoColor: x.ent>0?this.GREEN:this.RED, tipoBg: x.ent>0?this.GBG:this.RBG,
      ent: x.ent? 'R$ '+fmtBR(x.ent) : '—', sai: x.sai? 'R$ '+fmtBR(x.sai) : '—' }));
    const noRelLanc = relLancRows.length===0;
    const ledgerEnt = ledger.reduce((s,x)=>s+x.ent,0), ledgerSai = ledger.reduce((s,x)=>s+x.sai,0);
    const relLancTot = [
      { label:'Entrou (recebido)', value:'R$ '+fmtBR(ledgerEnt), sub:'vendas pagas' },
      { label:'Saiu (pago)', value:'R$ '+fmtBR(ledgerSai), sub:'compras pagas + lançamentos' },
      { label:'Saldo do período', value:'R$ '+fmtBR(ledgerEnt-ledgerSai), sub: (ledgerEnt-ledgerSai)>=0?'positivo':'negativo' },
      { label:'Movimentações', value:String(ledger.length), sub:periodLabel }
    ];

    // ---- relatórios ----
    const relClientesRows = clientesRaw.map(cc => {
      const fat = fatByClient[cc.nome]||0, ent = entByClient[cc.nome]||0;
      const te = ent? Math.round(fat/ent):0;
      const ccIn = inadOf(cc.nome);
      const st = this.statusMap(cc.status), hm = this.healthMap(this.healthOf(cc, ccIn, te));
      return { nome:cc.nome, rota:cc.rota, status:st.l, pedidos:ent, fat,
        fatTxt:'R$ '+fat.toLocaleString('pt-BR'), teTxt: te? 'R$ '+te.toLocaleString('pt-BR') : '—',
        part:(receitaFat?Math.round(fat/receitaFat*100):0)+'%',
        inad:ccIn.toFixed(1).replace('.',',')+'%', inadColor: ccIn<=1?this.GREEN:(ccIn<=2?this.AMBER:this.RED),
        healthColor:hm.c, healthBg:hm.bg, healthLabel:hm.l };
    }).sort((a,b)=>b.fat-a.fat);
    const relClientesTot = [
      { label:'Clientes ativos', value:String(ativos.length), sub:clientesRaw.length+' no total' },
      { label:'Faturamento do período', value:'R$ '+fmtBR(receitaFat), sub:periodLabel },
      { label:'Ticket médio/cliente', value:'R$ '+fmtBR(ticketMesReal), sub:'meta 3,5–3,8k' },
      { label:'Inadimplência média', value:fmtPct1(inadMedia), sub:'meta ≤ 1%' }
    ];
    const statusList = ['Entregue','Em rota','Pendente','Devolvido','Cancelado'];
    const relStatus = statusList.map(s => { const arr = pedidosPeriodo.filter(p=>p.status===s); return { label:s, count:arr.length, valor:'R$ '+fmtBR(arr.reduce((x,p)=>x+(p.valor||0),0)), color:this.pStatusColor(s), bg:this.pStatusBg(s) }; }).filter(x=>x.count>0);
    const rotasAgg = {};
    pedidosPeriodo.forEach(p => { const r = p.rota||'—'; if(!rotasAgg[r]) rotasAgg[r]={ped:0,peso:0,fat:0,perdaKg:0}; rotasAgg[r].ped++; rotasAgg[r].peso+=(p.pesoKg||0); rotasAgg[r].fat+=(p.valor||0); rotasAgg[r].perdaKg+=(p.perdaKg||0); });
    const relRotas = Object.keys(rotasAgg).sort().map(r => { const o = rotasAgg[r]; return { rota:r, ped:o.ped, peso:o.peso.toLocaleString('pt-BR'), fat:'R$ '+fmtBR(o.fat), ticket:'R$ '+fmtBR(o.ped?o.fat/o.ped:0) }; });
    // ===== relatório de compras / fornecedores =====
    const comprAgg = {};
    entradasPeriodo.forEach(en => {
      const k = en.fornecedor||'—';
      if(!comprAgg[k]) comprAgg[k]={coletas:0,qtd:0,valor:0,perda:0,aPagar:0};
      comprAgg[k].coletas++; comprAgg[k].qtd+=(en.pesoKg||0); comprAgg[k].valor+=(en.valor||0);
      comprAgg[k].perda+=(en.perdaKg||0);
      if(en.pago!=='Pago') comprAgg[k].aPagar+=(en.valor||0);
    });
    const relCompras = Object.keys(comprAgg).map(k => {
      const o = comprAgg[k];
      const pp = o.qtd ? o.perda/o.qtd*100 : 0;
      return { forn:k, coletas:o.coletas, qtd:o.qtd.toLocaleString('pt-BR'),
        valor:'R$ '+fmtBR(o.valor), medio: o.qtd? 'R$ '+(o.valor/o.qtd).toFixed(2).replace('.',',') : '—',
        perda:pp.toFixed(1).replace('.',',')+'%', perdaColor: pp<=10?this.GREEN:(pp<=15?this.AMBER:this.RED),
        aproveit:(100-pp).toFixed(0)+'%',
        aPagar: o.aPagar? 'R$ '+fmtBR(o.aPagar) : '—', aPagarColor: o.aPagar? this.RED : '#6b7a6f',
        _raw:o };
    }).sort((a,b)=>b._raw.valor-a._raw.valor);
    const noRelCompras = relCompras.length===0;
    const comprTotVal = Object.keys(comprAgg).reduce((s,k)=>s+comprAgg[k].valor,0);
    const comprTotQtd = Object.keys(comprAgg).reduce((s,k)=>s+comprAgg[k].qtd,0);
    const comprTotPerda = Object.keys(comprAgg).reduce((s,k)=>s+comprAgg[k].perda,0);
    const comprTotAPagar = Object.keys(comprAgg).reduce((s,k)=>s+comprAgg[k].aPagar,0);
    const relComprasTot = [
      { label:'Total comprado', value:'R$ '+fmtBR(comprTotVal), sub:entradasPeriodo.length+' coleta(s) · '+periodLabel },
      { label:'Fornecedores no período', value:String(relCompras.length), sub:this.state.fornecedores.length+' cadastrados' },
      { label:'Perda na coleta', value:(comprTotQtd?(comprTotPerda/comprTotQtd*100):0).toFixed(1).replace('.',',')+'%', sub:comprTotPerda.toLocaleString('pt-BR')+' de '+comprTotQtd.toLocaleString('pt-BR') },
      { label:'A pagar ao produtor', value:'R$ '+fmtBR(comprTotAPagar), sub: comprTotAPagar>0?'compras em aberto':'tudo pago' }
    ];

    // ===== ranking de produtos =====
    const prodAgg = {};
    const _pk = it => String(it.produtoId||it.nome);
    const _pn = it => it.nome || prodNameById[String(it.produtoId)] || '—';
    const _ensure = (k,nome) => { if(!prodAgg[k]) prodAgg[k]={nome,compQ:0,compV:0,vendQ:0,vendV:0,perda:0}; return prodAgg[k]; };
    entradasPeriodo.forEach(en => (en.itens||[]).forEach(it => { const o=_ensure(_pk(it),_pn(it)); o.compQ+=(+it.kg||0); o.compV+=(+it.kg||0)*(+it.preco||0); o.perda+=(+it.perdaKg||0); }));
    perdasDep.forEach(pe => { const o=_ensure(String(pe.produtoId||pe.nome), pe.nome||prodNameById[String(pe.produtoId)]||'—'); o.perda+=(+pe.qtd||0); });
    entregues.forEach(p => (p.itens||[]).forEach(it => { const o=_ensure(_pk(it),_pn(it)); o.vendQ+=(+it.kg||0); o.vendV+=(+it.kg||0)*(+it.preco||0); }));
    const relProdutos = Object.keys(prodAgg).map(k => {
      const o = prodAgg[k];
      const cm = o.compQ? o.compV/o.compQ : 0, vm = o.vendQ? o.vendV/o.vendQ : 0;
      const mk = (cm>0&&vm>0) ? (vm-cm)/cm*100 : null;
      const margemR = o.vendV - (o.vendQ*cm);
      const pp = o.compQ ? o.perda/o.compQ*100 : 0;
      return { nome:o.nome, compQ:o.compQ.toLocaleString('pt-BR'), vendQ:o.vendQ.toLocaleString('pt-BR'),
        fat:'R$ '+fmtBR(o.vendV), margem: o.vendQ? 'R$ '+fmtBR(margemR) : '—',
        markup: mk==null? '—' : Math.round(mk)+'%', markupColor: mk==null? '#6b7a6f' : (mk>=60?this.GREEN:this.RED),
        perda: o.compQ? pp.toFixed(1).replace('.',',')+'%' : '—',
        perdaColor: pp<=10?this.GREEN:(pp<=15?this.AMBER:this.RED),
        _fat:o.vendV, _margem:margemR, _perda:pp };
    }).sort((a,b)=>b._fat-a._fat);
    const noRelProdutos = relProdutos.length===0;
    const maisVend = relProdutos[0];
    const maiorMargem = relProdutos.slice().sort((a,b)=>b._margem-a._margem)[0];
    const maiorPerda = relProdutos.slice().filter(x=>x.perda!=='—').sort((a,b)=>b._perda-a._perda)[0];
    const relProdutosTot = [
      { label:'Produtos movimentados', value:String(relProdutos.length), sub:this.state.produtos.length+' cadastrados' },
      { label:'Mais fatura', value: maisVend? maisVend.nome : '—', sub: maisVend? maisVend.fat : periodLabel },
      { label:'Maior margem', value: maiorMargem? maiorMargem.nome : '—', sub: maiorMargem? maiorMargem.margem : '—' },
      { label:'Maior perda', value: maiorPerda? maiorPerda.nome : '—', sub: maiorPerda? maiorPerda.perda : '—' }
    ];

    // ===== lista de inadimplentes =====
    const atrasadosPeriodo = pedidosPeriodo.filter(p=>p.pag==='Atrasado');
    const inadAgg = {};
    atrasadosPeriodo.forEach(p => {
      const k = p.cliente||'—';
      if(!inadAgg[k]) inadAgg[k]={peds:0,valor:0,maisAntigo:null,vencs:[]};
      inadAgg[k].peds++; inadAgg[k].valor+=(p.valor||0);
      const t = this._parseDate(p.venc||p.entrega);
      if (t!=null && (inadAgg[k].maisAntigo==null || t<inadAgg[k].maisAntigo)) inadAgg[k].maisAntigo=t;
      inadAgg[k].vencs.push(p.venc||p.entrega);
    });
    const hojeTs = this._parseDate(this._hojeIso());
    const relInad = Object.keys(inadAgg).map(k => {
      const o = inadAgg[k];
      const dias = (hojeTs!=null && o.maisAntigo!=null) ? Math.max(0, Math.round((hojeTs-o.maisAntigo)/86400000)) : null;
      const cli = clientesRaw.find(x=>x.nome===k);
      const fatCli = fatByClient[k]||0;
      return { cliente:k, resp: cli? (cli.resp||'—') : '—', tel: cli? (cli.tel||'—') : '—',
        peds:o.peds, valor:'R$ '+fmtBR(o.valor),
        venc: this._fmtDate(o.vencs.slice().sort()[0]),
        dias: dias==null? '—' : dias+'d',
        diasColor: dias==null? '#6b7a6f' : (dias>30?this.RED:(dias>7?this.AMBER:this.GREEN)),
        pctCli: fatCli? Math.round(o.valor/fatCli*100)+'%' : '—',
        open:()=>this.openCliente(cli?cli.id:0), _v:o.valor };
    }).sort((a,b)=>b._v-a._v);
    const noRelInad = relInad.length===0;
    const inadTotVal = relInad.reduce((s,x)=>s+x._v,0);
    const relInadTot = [
      { label:'Total em atraso', value:'R$ '+fmtBR(inadTotVal), sub:atrasadosPeriodo.length+' pedido(s) · '+periodLabel },
      { label:'Clientes inadimplentes', value:String(relInad.length), sub:clientesRaw.length+' na carteira' },
      { label:'% da receita', value:(receitaFat?(inadTotVal/receitaFat*100):0).toFixed(1).replace('.',',')+'%', sub:'meta ≤ 1%' },
      { label:'Maior devedor', value: relInad[0]? relInad[0].cliente : '—', sub: relInad[0]? relInad[0].valor : 'nenhum atraso' }
    ];

    // ===== perdas por motivo e por produto =====
    const motAgg = {};
    entradasPeriodo.forEach(en => { const m=(en.motivo&&en.motivo!=='—')?en.motivo:'não informado'; if(!motAgg[m])motAgg[m]={qtd:0,ocor:0}; motAgg[m].qtd+=(en.perdaKg||0); if((en.perdaKg||0)>0) motAgg[m].ocor++; });
    perdasDep.forEach(pe => { const m=pe.motivo||'não informado'; if(!motAgg[m])motAgg[m]={qtd:0,ocor:0}; motAgg[m].qtd+=(+pe.qtd||0); motAgg[m].ocor++; });
    const perdaTotalQtd = Object.keys(motAgg).reduce((s,k)=>s+motAgg[k].qtd,0);
    const relPerdaMotivos = Object.keys(motAgg).map(k => ({
      motivo:k, qtd:motAgg[k].qtd.toLocaleString('pt-BR'), ocor:motAgg[k].ocor,
      pct: perdaTotalQtd? Math.round(motAgg[k].qtd/perdaTotalQtd*100)+'%' : '—',
      barra: perdaTotalQtd? Math.round(motAgg[k].qtd/perdaTotalQtd*100)+'%' : '0%',
      _q:motAgg[k].qtd })).sort((a,b)=>b._q-a._q);
    const relPerdaProdutos = relProdutos.slice().filter(x=>x.perda!=='—').sort((a,b)=>b._perda-a._perda)
      .map(x=>({ nome:x.nome, compQ:x.compQ, perda:x.perda, perdaColor:x.perdaColor }));
    const noRelPerdas = relPerdaMotivos.length===0;
    const maiorMot = relPerdaMotivos[0];
    const relPerdasTot = [
      { label:'Perda total', value:perdaTotalQtd.toLocaleString('pt-BR'), sub:'somando coleta e depósito' },
      { label:'Índice de perdas', value:fmtPct1(perdaMedia), sub:'meta ≤ 10%' },
      { label:'Principal motivo', value: maiorMot? maiorMot.motivo : '—', sub: maiorMot? (maiorMot.pct+' do total') : periodLabel },
      { label:'Perdas no depósito', value:String(perdasDep.length), sub:'lançamentos avulsos' }
    ];

    const relPedidosTot = [
      { label:'Pedidos no período', value:String(pedidosPeriodo.length), sub:periodLabel },
      { label:'Faturado (entregue)', value:'R$ '+fmtBR(receitaFat), sub:entregues.length+' entregues' },
      { label:'A receber / atrasado', value:'R$ '+fmtBR(aReceber), sub:nAtraso+' em atraso' },
      { label:'Qtd entregue', value:entregues.reduce((s,p)=>s+(p.pesoKg||0),0).toLocaleString('pt-BR'), sub:'no período' }
    ];

    // ---- guia de primeiros passos ----
    const nP = this.state.produtos.length, nF = this.state.fornecedores.length, nC = this.state.clientes.length;
    const nE = entradasRaw.length, nS = pedidosRaw.length;
    const passos = [
      { n:'1', label:'Cadastrar produtos', hint:'Batata, alface… com a unidade padrão', feito:nP>0, cta:'Cadastrar produto', go:this.newProduto, count:nP },
      { n:'2', label:'Cadastrar fornecedores', hint:'Os produtores de quem você compra', feito:nF>0, cta:'Cadastrar fornecedor', go:this.newFornecedor, count:nF },
      { n:'3', label:'Cadastrar clientes', hint:'Os minimercados que você atende', feito:nC>0, cta:'Cadastrar cliente', go:this.newCliente, count:nC },
      { n:'4', label:'Lançar a primeira entrada', hint:'A compra que abastece o estoque', feito:nE>0, cta:'Nova entrada', go:this.newEntrada, count:nE },
      { n:'5', label:'Lançar a primeira saída', hint:'A venda entregue ao cliente', feito:nS>0, cta:'Nova saída', go:this.newPedido, count:nS }
    ];
    const passoAtual = passos.find(p=>!p.feito);
    const passosRows = passos.map(p => ({
      n:p.n, label:p.label, hint:p.hint, cta:p.cta, go:p.go,
      mark: p.feito ? '✓' : p.n,
      markBg: p.feito ? this.GREEN : (passoAtual && passoAtual.n===p.n ? '#c79320' : '#e7ece3'),
      markFg: p.feito ? '#fff' : (passoAtual && passoAtual.n===p.n ? '#fff' : '#6b7a6f'),
      labelColor: p.feito ? '#66756a' : '#0f2a18',
      countTxt: p.feito ? (p.count+' cadastrado(s)') : '',
      showCta: !p.feito && !!(passoAtual && passoAtual.n===p.n)
    }));
    const guiaAberto = !!passoAtual;
    const guiaTitulo = passoAtual ? ('Próximo passo: '+passoAtual.label) : 'Cadastros básicos completos';
    const guiaSub = passoAtual ? 'Siga a ordem — cada passo depende do anterior.' : 'Tudo pronto. O sistema já calcula estoque, margem e resultado.';
    const passosFeitos = passos.filter(p=>p.feito).length;

    // ===== exportação (CSV do relatório ativo) =====
    const RV = this.state.relView;
    const relNomes = { clientes:'Relatório de clientes', pedidos:'Relatório de pedidos', lanc:'Relatório de lançamentos',
      compras:'Relatório de compras', produtos:'Ranking de produtos', inad:'Lista de inadimplentes', perdas:'Relatório de perdas' };
    const sufixo = ' — '+periodLabel;
    const csvDefs = {
      clientes: { header:['Cliente','Rota','Status','Pedidos','Faturado','Ticket/entrega','% carteira','Inadimplência','Saúde'],
        rows: relClientesRows.map(r=>[r.nome,r.rota,r.status,r.pedidos,r.fatTxt,r.teTxt,r.part,r.inad,r.healthLabel]) },
      pedidos: { header:['Rota','Pedidos','Qtd','Faturado','Ticket'],
        rows: relRotas.map(r=>[r.rota,r.ped,r.peso,r.fat,r.ticket]) },
      lanc: { header:['Data','Movimentação','Tipo','Entrada','Saída'],
        rows: relLancRows.map(r=>[r.data,r.origem,r.tipo,r.ent,r.sai]) },
      compras: { header:['Fornecedor','Coletas','Qtd','Preço médio','Valor','Perda','Aproveitamento','A pagar'],
        rows: relCompras.map(r=>[r.forn,r.coletas,r.qtd,r.medio,r.valor,r.perda,r.aproveit,r.aPagar]) },
      produtos: { header:['Produto','Qtd comprada','Qtd vendida','Faturamento','Margem','Markup','Perda'],
        rows: relProdutos.map(r=>[r.nome,r.compQ,r.vendQ,r.fat,r.margem,r.markup,r.perda]) },
      inad: { header:['Cliente','Responsável','Telefone','Pedidos em atraso','Valor','Vencimento mais antigo','Dias de atraso','% do faturamento dele'],
        rows: relInad.map(r=>[r.cliente,r.resp,r.tel,r.peds,r.valor,r.venc,r.dias,r.pctCli]) },
      perdas: { header:['Motivo','Quantidade','Ocorrências','% do total'],
        rows: relPerdaMotivos.map(r=>[r.motivo,r.qtd,r.ocor,r.pct])
          .concat([[]],[['Produto','Qtd comprada','Perda %','']])
          .concat(relPerdaProdutos.map(r=>[r.nome,r.compQ,r.perda,''])) }
    };
    const csvAtivo = csvDefs[RV] || csvDefs.clientes;
    this._csv = { nome:(relNomes[RV]||'Relatorio')+sufixo, header:csvAtivo.header, rows:csvAtivo.rows };

    return {
      isAdmin,
      logged: this.state.logged, semLogin: !this.state.logged,
      loginRole: this.state.loginRole, loginPass: this.state.loginPass, loginErr: this.state.loginErr,
      loginHasErr: !!this.state.loginErr,
      setLoginRole:this.setLoginRole, setLoginPass:this.setLoginPass, doLogin:this.doLogin, loginOnKey:this.loginOnKey,
      logout:this.logout,
      passosRows, guiaAberto, guiaTitulo, guiaSub, guiaProgresso: passosFeitos+' de 5',
      guiaBarra: Math.round(passosFeitos/5*100)+'%',
      // estados vazios / pré-requisitos
      semProdutos: nP===0, temProdutos: nP>0, semFornecedores: nF===0, semClientes: nC===0,
      semEntradas: nE===0, semSaidas: nS===0,
      podeEntrada: nP>0 && nF>0, podeSaida: nP>0 && nC>0,
      faltaParaEntrada: !(nP>0 && nF>0),
      faltaParaSaida: !(nP>0 && nC>0),
      faltaEntradaTxt: (nP===0 && nF===0) ? 'um produto e um fornecedor' : (nP===0 ? 'ao menos um produto' : 'ao menos um fornecedor'),
      faltaSaidaTxt: (nP===0 && nC===0) ? 'um produto e um cliente' : (nP===0 ? 'ao menos um produto' : 'ao menos um cliente'),
      newProduto2:this.newProduto,
      perdasRows, noPerdas, newPerda:this.newPerda,
      modalPerda: this.state.modal==='perda',
      estoqueAlertas, temAlertaEstoque,
      roleName: isAdmin ? 'Tela admin' : 'Funcionário',
      roleSub: isAdmin ? 'acesso total' : 'entrada · saída · estoque',
      roleAvatar: isAdmin ? 'AD' : 'FU',
      setRoleAdmin:this.setRoleAdmin, setRoleColab:this.setRoleColab,
      roleAdminBg: isAdmin?'#e3b341':'transparent', roleAdminFg: isAdmin?'#0f2a18':'#b9cdbd',
      roleColabBg: !isAdmin?'#e3b341':'transparent', roleColabFg: !isAdmin?'#0f2a18':'#b9cdbd',
      navItems, screenTitle:titles[S][0], screenSub:titles[S][1],
      isDashboard:S==='dashboard', isPedidos:S==='pedidos', isFornecedores:S==='fornecedores',
      isProdutos:S==='produtos', isFinanceiro:S==='financeiro', isRelatorios:S==='relatorios', isEntradas:S==='entradas',
      isEstoque:S==='estoque', isFuncionarios:S==='funcionarios', isVeiculos:S==='veiculos', isBancos:S==='bancos',
      funcViewEquipe: fv==='equipe', funcViewDiarias: fv==='diarias',
      funcTabEquipe: () => this.setState({ funcView:'equipe' }), funcTabDiarias: () => this.setState({ funcView:'diarias' }),
      funcTabEquipeBg: fv==='equipe'?'#1d7a3e':'#fff', funcTabEquipeFg: fv==='equipe'?'#fff':'#435349',
      funcTabDiariasBg: fv==='diarias'?'#1d7a3e':'#fff', funcTabDiariasFg: fv==='diarias'?'#fff':'#435349',
      diariaRows, diariaStats, noDiaria: diariaRows.length===0, newDiaria:this.newDiaria, modalDiaria: this.state.modal==='diaria', diaristaNomes,
      caixaOpen: !!this.state.caixaOpen, caixaSeta: this.state.caixaOpen ? '▴' : '▾', caixaBorder: this.state.caixaOpen ? '#1d7a3e' : '#cfe3d3',
      toggleCaixa: () => this.setState(s => ({ caixaOpen: !s.caixaOpen })), closeCaixa: () => this.setState({ caixaOpen:false }),
      goBancos: () => this.setState({ caixaOpen:false, screen:'bancos', clienteView:'list' }),
      bancoRows, newBanco:this.newBanco, modalBanco: this.state.modal==='banco', semBancoRow: true, semBancoQtd:String(semB.length), semBancoSaidas: brMoney(semB.reduce((s,l)=>s+(l.valor||0),0)),
      bancoLista: this.BANCOS_BR.map(x=>({ v:x[1] })),
      bancoOptions: this.state.bancos.filter(b=>b.ativo!=='nao' || (this.state.draft && String(this.state.draft.bancoId)===String(b.id))).map(b=>({ id:String(b.id), nome:b.instituicao+(b.apelido?' · '+b.apelido:'') })),
      veicRows, veicStats, noVeic, newVeiculo:this.newVeiculo, modalVeiculo: this.state.modal==='veiculo',
      veiculoOptions: this.state.veiculos.map(v=>({ id:String(v.id), nome:[v.marca,v.modelo].filter(Boolean).join(' ')+' · '+v.placa })),
      lancTemVeiculo: this.state.modal==='lancamento' && !!this.state.draft && this.VEIC_CATS.includes(this.state.draft.categoria),
      estoqueRows, estoqueStats, noEstoque,
      funcionariosRows, funcStats, noFunc, newFuncionario:this.newFuncionario,
      diasDoMes: Array.from({length:28},(_,i)=>({ v:String(i+1), l:'Dia '+(i+1) })),
      lancRows, noLanc, lancCategorias:this.LANC_CATS, newLancamento:this.newLancamento,
      funcionarioOptions: funcs.map(f=>({ id:String(f.id), nome:f.nome })),
      relLanc: this.state.relView==='lanc', setRelLanc:this.setRelLanc,
      relTabLanBg: this.state.relView==='lanc'?'#1d7a3e':'#fff', relTabLanFg: this.state.relView==='lanc'?'#fff':'#435349',
      relLancRows, relLancTot, noRelLanc,
      ...(() => {
        const iniciais = this.state.bancos.reduce((s,b)=>s+(+b.saldoInicial||0),0);
        const comBanco = this.state.lancamentos.filter(l=>l.bancoId && this.state.bancos.some(b=>String(b.id)===String(l.bancoId))).reduce((s,l)=>s+(l.valor||0),0);
        const total = iniciais + cashAll, sem = cashAll + comBanco;
        const f = v => (v<0?'−R$ ':'R$ ')+Number(Math.abs(v)).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
        return { saldoCaixa:f(total), saldoCaixaColor: total>=0?'#17642f':this.RED, semBancoSaldo:f(sem), semBancoSaldoColor: sem<0?'#b3283d':'#16241b',
          caixaBancos: bancoRows.map(b => ({ nome:b.nome, apelido:b.apelido, saldo:b.saldo, color:b.saldoColor, nomeColor:'#16241b' }))
            .concat([{ nome:'Sem banco informado', apelido:'vendas, compras e custos sem banco', saldo:f(sem), color: sem<0?'#b3283d':'#16241b', nomeColor:'#5a6a5f' }]) };
      })(),
      entradaStats, entradasRows, newEntrada:this.newEntrada,
      finCompraTxt:'R$ '+fmtBR(compraMercadoria), entTotals,
      modalEntrada: this.state.modal==='entrada',
      relClientes: this.state.relView==='clientes', relPedidos: this.state.relView==='pedidos',
      setRelClientes:this.setRelClientes, setRelPedidos:this.setRelPedidos,
      relTabCliBg: this.state.relView==='clientes'?'#1d7a3e':'#fff', relTabCliFg: this.state.relView==='clientes'?'#fff':'#435349',
      relTabPedBg: this.state.relView==='pedidos'?'#1d7a3e':'#fff', relTabPedFg: this.state.relView==='pedidos'?'#fff':'#435349',
      relClientesRows, relClientesTot, relStatus, relRotas, relPedidosTot,
      relCompras, relComprasTot, noRelCompras,
      relProdutos, relProdutosTot, noRelProdutos,
      relInad, relInadTot, noRelInad,
      relPerdaMotivos, relPerdaProdutos, relPerdasTot, noRelPerdas,
      verCompras: RV==='compras', verProdutos: RV==='produtos', verInad: RV==='inad', verPerdas: RV==='perdas',
      setRelCompras:this.setRelCompras, setRelProdutos:this.setRelProdutos, setRelInad:this.setRelInad, setRelPerdas:this.setRelPerdas,
      tabComBg: RV==='compras'?'#1d7a3e':'#fff', tabComFg: RV==='compras'?'#fff':'#435349',
      tabProBg: RV==='produtos'?'#1d7a3e':'#fff', tabProFg: RV==='produtos'?'#fff':'#435349',
      tabInaBg: RV==='inad'?'#1d7a3e':'#fff', tabInaFg: RV==='inad'?'#fff':'#435349',
      tabPerBg: RV==='perdas'?'#1d7a3e':'#fff', tabPerFg: RV==='perdas'?'#fff':'#435349',
      exportarCSV:this.exportarCSV, imprimirRelatorio:this.imprimirRelatorio,
      relNomeAtual: relNomes[RV] || 'Relatório',
      showClienteList: S==='clientes' && this.state.clienteView==='list',
      showClienteDetail: S==='clientes' && this.state.clienteView==='detail',
      backToList:() => this.setState({ clienteView:'list' }),
      clientes, statusFilters, sel, top5Txt,
      statCards, kpis, carteira, cenarios, mixDots, realizadoTxt,
      pedidoStats, pedidos, fornecedores, produtos, fornSummary,
      produtoPerdaMediaTxt, produtoPerdaMediaColor,
      // período
      periodOptions, periodo, periodLabel, setPeriodo:this.setPeriodo,
      // financeiro (vivo)
      finReceita:'R$ '+fmtBR(receitaBruta),
      finReceitaSub: entregues.length+' pedido(s) entregue(s) no período',
      finCustos, finCustoTotal:'R$ '+fmtBR(custoTotal),
      finLucro:(lucroLiquido<0?'−R$ ':'R$ ')+fmtBR(Math.abs(lucroLiquido)),
      finLucroColor: lucroLiquido>0?'#17642f':this.RED,
      finLucroDarkColor: lucroLiquido>0?'#eef2ea':'#f39aa6',
      finPctTxt: pctLucro.toFixed(1).replace('.',',')+'% sobre a receita',
      // ciclo de caixa
      cicloDias, cicloDiasTxt: cicloDias+(cicloDias===1?' dia':' dias'), cicloColor, cicloPag, cicloEst, cicloReceb,
      cicloPagW: Math.round(cicloPag/cicloSum*100)+'%',
      cicloEstW: Math.round(cicloEst/cicloSum*100)+'%',
      cicloRecW: Math.round(cicloReceb/cicloSum*100)+'%',
      // modal
      modalOpen: !!this.state.modal,
      modalWidth: (this.state.modal==='pedido'||this.state.modal==='entrada') ? '840px' : (this.state.modal==='pagamento' ? '460px' : ((this.state.modal==='lancamento'||this.state.modal==='funcionario'||this.state.modal==='perda'||this.state.modal==='veiculo'||this.state.modal==='banco'||this.state.modal==='diaria') ? '560px' : '700px')),
      modalCliente: this.state.modal==='cliente', isEditingCliente: this.state.modal==='cliente' && this.state.isEditing,
      modalPedido: this.state.modal==='pedido',
      modalFornecedor: this.state.modal==='fornecedor',
      modalProduto: this.state.modal==='produto',
      modalFinanceiro: false,
      modalLancamento: this.state.modal==='lancamento',
      modalFuncionario: this.state.modal==='funcionario',
      modalPagamento: this.state.modal==='pagamento',
      modalTitle: ({cliente:this.state.isEditing?'Editar cliente':'Novo cliente', pedido:this.state.isEditing?'Editar pedido':'Novo pedido', fornecedor:this.state.isEditing?'Editar fornecedor':'Novo fornecedor', produto:this.state.isEditing?'Editar produto':'Novo produto', entrada:this.state.isEditing?'Editar entrada':'Nova entrada (compra)', perda:this.state.isEditing?'Editar perda':'Registrar perda no depósito', lancamento:this.state.isEditing?'Editar lançamento':'Novo lançamento de custo', veiculo:this.state.isEditing?'Editar veículo':'Novo veículo', banco:this.state.isEditing?'Editar banco':'Novo banco', diaria:this.state.isEditing?'Editar diária':'Nova diária', funcionario:this.state.isEditing?'Editar funcionário':'Novo funcionário', pagamento:'Registrar pagamento '+(this.state.draft?this.state.draft.id:'')})[this.state.modal] || '',
      isEditing: !!this.state.isEditing,
      draft: this.state.draft || {},
      finReceitaRef: fmtBR(receitaFat)+' — soma dos pedidos entregues (não editável)',
      clienteOptions: clientesRaw.map(x=>x.nome),
      produtoOptions: (() => {
        const todos = this.state.produtos.map(x=>({ id:x.id, nome:x.nome }));
        if (this.state.modal !== 'entrada' || !this.state.draft) return todos;
        const f = this.state.fornecedores.find(x=>x.nome===this.state.draft.fornecedor);
        const vinc = (f && f.produtos) ? f.produtos : [];
        if (!vinc.length) return todos;
        const dele = todos.filter(p=>vinc.indexOf(p.nome)>=0);
        const outros = todos.filter(p=>vinc.indexOf(p.nome)<0);
        return dele.concat(outros.map(p=>({ id:p.id, nome:p.nome+'  (outro fornecedor)' })));
      })(),
      unidades: ['KG','CX','BANDEJA','UNIDADE','SACO','MAÇO'],
      fornecedorOptions: this.state.fornecedores.map(x=>x.nome),
      produtoCheckList: this.state.produtos.map(p => {
        const sel = !!(this.state.draft && (this.state.draft.produtos||[]).indexOf(p.nome)>=0);
        return { nome:p.nome, un:p.un||'KG', marca: sel?'✓':'',
          bg: sel?'#eef6ef':'#fff', borda: sel?'#e3b341':'#d3dbcf',
          fg: sel?'#17642f':'#435349', peso: sel?700:500,
          toggle:()=>this.toggleProdForn(p.nome) };
      }),
      semProdutoParaVincular: this.state.produtos.length===0,
      qtdProdVinculados: (this.state.draft && this.state.draft.produtos) ? this.state.draft.produtos.length : 0,
      itemRows, pedTotals, noItens, entTotals,
      addItem:this.addItem, updateItem:this.updateItem,
      newCliente:this.newCliente, editCurrentCliente:this.editCurrentCliente, deleteCurrentCliente:this.deleteCurrentCliente,
      newPedido:this.newPedido,
      newFornecedor:this.newFornecedor, newProduto:this.newProduto,
      updateDraft:this.updateDraft,
      saveDraft:this.saveDraft, closeModal:this.closeModal, deleteFromModal:this.deleteFromModal,
      closeModalBackdrop:this.closeModalBackdrop, stopProp:this.stopProp
    };
  }

  render() {
    return <AppView ui={this.renderVals()} />;
  }
}
