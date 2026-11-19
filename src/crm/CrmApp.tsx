'use client';

/**
 * Lógica do CRM Império da Goiaba — portada do design
 * "Imperio da Goiaba CRM v2.dc.html" (bloco <script type="text/x-dc">).
 *
 * Mantém o mesmo estado e as mesmas regras de negócio do protótipo; os dados
 * vêm da API (/api/bootstrap) e cada gravação/exclusão vai para o servidor.
 * `renderVals()` calcula tudo o que as telas exibem; os componentes em
 * ./screens, ./modals e ./layout só desenham.
 */
import { Component } from 'react';
import { AppView } from './AppView';
import { api, ApiError } from './api';
import { Aviso, Carregando } from './Aviso';
import { CONFIG_PADRAO } from '../shared/config-padrao';

const VAZIO = { bancos: [], veiculos: [], clientes: [], pedidos: [], fornecedores: [], produtos: [], interacoes: [], lancamentos: [], funcionarios: [], perdas: [], entradas: [] };
/** modal -> coleção/recurso da API */
const COLS = { interacao:'interacoes', cliente:'clientes', pedido:'pedidos', fornecedor:'fornecedores', produto:'produtos', perda:'perdas', lancamento:'lancamentos', diaria:'lancamentos', banco:'bancos', veiculo:'veiculos', funcionario:'funcionarios', entrada:'entradas' };

/* eslint-disable @typescript-eslint/no-explicit-any */
export class CrmApp extends Component<Record<string, never>, any> {
  /** Dados do CSV do relatório ativo (preenchido em renderVals). */
  _csv: any = null;

  state: any = {
    booting: true, user: null, salvando: false, aviso: null,
    logged: false, loginUser: '', loginPass: '', loginErr: '', loginBusy: false,
    screen: 'dashboard', clienteView: 'list', clienteId: 1, periodo: 'all', role: 'admin', relView: 'clientes',
    modal: null, draft: null, isEditing: false, funcAberto: null, veicAberto: null,
    ...VAZIO
  };

  GREEN = '#2e8b4a'; AMBER = '#c79320'; RED = '#d6334a';
  GBG = '#e7f1e8'; ABG = '#f6efd8'; RBG = '#fbe7ea';

  _avisoTimer: any = null;

  _refreshTimer: any = null;

  componentDidMount() {
    this._boot();
    // outra pessoa lançou algo? atualiza a cada minuto e ao voltar para a aba
    this._refreshTimer = setInterval(this._atualizar, 60000);
    window.addEventListener('focus', this._atualizar);
  }
  componentWillUnmount() {
    clearTimeout(this._avisoTimer);
    clearInterval(this._refreshTimer);
    window.removeEventListener('focus', this._atualizar);
  }

  /** Recarrega as coleções sem mexer na tela atual (não interrompe quem está editando). */
  _atualizar = async () => {
    if (!this.state.logged || this.state.modal || this.state.salvando || document.visibilityState !== 'visible') return;
    try { await this._recarregarDados(); } catch (e) { if (e instanceof ApiError && e.status === 401) this.avisar(e); }
  };
  async _recarregarDados() {
    const { user, data, config } = await api('GET', '/api/bootstrap');
    if (this.state.modal && this.state.modal !== 'pagamento') return;
    this.setState({ ...data, user, config: config || this.state.config });
  }

  async _boot() {
    try {
      const { user } = await api('GET', '/api/auth/me');
      if (user) await this._carregar(user.role === 'admin' ? 'dashboard' : 'entradas');
    } catch (e) { this.avisar(e); }
    finally { this.setState({ booting: false }); }
  }

  /** Busca todas as coleções que o perfil pode ver. */
  async _carregar(screen?: string) {
    const { user, data, config } = await api('GET', '/api/bootstrap');
    this.setState(s => ({ ...VAZIO, ...data, user, config, logged: true, role: user.role, screen: screen ?? s.screen, clienteView: 'list' }));
  }

  /** Mostra um aviso (erro por padrão). Sessão expirada volta para o login. */
  avisar = (e: any, tipo: 'erro' | 'ok' = 'erro') => {
    if (e instanceof ApiError && e.status === 401 && this.state.logged) {
      this.setState({ ...VAZIO, logged: false, user: null, modal: null, draft: null, loginErr: 'Sua sessão expirou. Entre de novo.' });
      return;
    }
    const texto = typeof e === 'string' ? e : (e && e.message) || 'Algo deu errado.';
    clearTimeout(this._avisoTimer);
    this.setState({ aviso: { texto, tipo } });
    this._avisoTimer = setTimeout(() => this.setState({ aviso: null }), 5000);
  };
  fecharAviso = () => this.setState({ aviso: null });

  /** Cria (POST) ou atualiza (PUT) e substitui o registro na coleção local. */
  async _gravar(col: string, d: any, isNew: boolean, prepend = false) {
    const body = { ...d };
    if (isNew) delete body.id;
    const saved = isNew
      ? await api('POST', '/api/' + col, body)
      : await api('PUT', '/api/' + col + '/' + encodeURIComponent(d.id), body);
    this.setState(s => {
      const list = s[col].slice();
      const i = list.findIndex(x => x.id === saved.id);
      if (i >= 0) list[i] = saved; else if (prepend) list.unshift(saved); else list.push(saved);
      return { [col]: list };
    });
    return saved;
  }

  /** Exclui no servidor e reflete localmente (inclusive vínculos que ficam vazios). */
  async _excluir(modal: string, id: any) {
    const col = COLS[modal];
    await api('DELETE', '/api/' + col + '/' + encodeURIComponent(id));
    this.setState(s => {
      const upd: any = { [col]: s[col].filter(x => x.id !== id) };
      const campo = ({ banco: 'bancoId', veiculo: 'veiculoId', funcionario: 'funcionarioId' })[modal];
      if (campo) upd.lancamentos = (upd.lancamentos || s.lancamentos).map(l => String(l[campo] || '') === String(id) ? { ...l, [campo]: '' } : l);
      if (modal === 'produto') upd.perdas = s.perdas.map(p => String(p.produtoId) === String(id) ? { ...p, produtoId: '' } : p);
      return upd;
    });
  }

  setLoginUser = (e) => this.setState({ loginUser: e.target.value, loginErr:'' });
  setLoginPass = (e) => this.setState({ loginPass: e.target.value, loginErr:'' });
  doLogin = async () => {
    if (this.state.loginBusy) return;
    this.setState({ loginBusy: true, loginErr: '' });
    try {
      const { user } = await api('POST', '/api/auth/login', { usuario: this.state.loginUser, senha: this.state.loginPass });
      await this._carregar(user.role === 'admin' ? 'dashboard' : 'entradas');
      this.setState({ loginPass: '' });
    } catch (e) {
      this.setState({ loginErr: e.message || 'Não foi possível entrar.' });
    } finally {
      this.setState({ loginBusy: false });
    }
  };
  loginOnKey = (e) => { if (e.key === 'Enter') this.doLogin(); };
  logout = async () => {
    try { await api('POST', '/api/auth/logout', {}); } catch { /* sai mesmo assim */ }
    this.setState({ ...VAZIO, logged:false, user:null, loginPass:'', loginErr:'', modal:null, draft:null });
  };

  BANCOS_BR = [['001','Banco do Brasil'],['104','Caixa Econômica Federal'],['237','Bradesco'],['341','Itaú Unibanco'],['033','Santander'],['748','Sicredi'],['756','Sicoob'],['260','Nubank'],['077','Banco Inter'],['336','C6 Bank'],['102','XP Investimentos'],['208','BTG Pactual'],['290','PagBank'],['323','Mercado Pago'],['380','PicPay'],['212','Banco Original'],['041','Banrisul'],['070','BRB'],['004','Banco do Nordeste'],['085','Ailos'],['136','Unicred'],['422','Safra'],['655','Banco Votorantim'],['403','Cora'],['197','Stone'],['623','Banco Pan'],['746','Modal'],['218','BS2'],['999','Outro']];
  newBanco = () => {
    const id = (this.state.bancos.reduce((m,x)=>Math.max(m,x.id||0),0) || 0) + 1;
    this.setState({ modal:'banco', isEditing:false, draft:{ id, instituicao:'Sicredi', apelido:'', ativo:'sim', saldoInicial:'' } });
  };
  editBanco = (id) => { const b = this.state.bancos.find(x=>x.id===id); if (b) this.setState({ modal:'banco', isEditing:true, draft:{ ...b } }); };
  _fmtDate(s) { return this._fmtDM(s); }
  MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  /** 'aaaa-mm' de uma data ISO (o servidor sempre devolve datas ISO). */
  anoMes(d) { const m = String(d||'').match(/^(\d{4})-(\d{2})/); return m ? m[1]+'-'+m[2] : null; }
  setPeriodo = (e) => this.setState({ periodo: e.target.value });

  ADMIN_ONLY_SCREENS = ['configuracoes','contas','dashboard','clientes','fornecedores','produtos','financeiro','relatorios','funcionarios','veiculos','bancos'];
  nav(key) {
    this.setState({ screen: key, clienteView: 'list', ...(key === 'configuracoes' ? { cfgDraft: this._cfgCopia() } : {}) });
    if (key === 'configuracoes' && this.state.cfgTab === 'historico') this.carregarHistorico();
  }

  // ================================================================ configurações (metas, listas, usuários, histórico, backup)
  /** Metas em vigor: o que foi salvo nas Configurações + padrão do estudo. */
  _metas() { return { ...CONFIG_PADRAO.metas, ...((this.state.config && this.state.config.metas) || {}) }; }
  _rotas() { return (this.state.config && this.state.config.rotas && this.state.config.rotas.length) ? this.state.config.rotas : CONFIG_PADRAO.rotas; }
  _cfgCopia() {
    const c = this.state.config || CONFIG_PADRAO;
    return { metas: { ...this._metas() }, rotasTxt: this._rotas().join('\n'), empresaNome: (c.empresa && c.empresa.nome) || CONFIG_PADRAO.empresa.nome };
  }
  cfgSetTab = (t) => { this.setState({ cfgTab: t }); if (t === 'historico') this.carregarHistorico(); };
  updateMeta = (e) => { const k = e.target.dataset.campo, v = e.target.value; this.setState(s => ({ cfgDraft: { ...s.cfgDraft, metas: { ...s.cfgDraft.metas, [k]: v } } })); };
  updateRotas = (e) => { const v = e.target.value; this.setState(s => ({ cfgDraft: { ...s.cfgDraft, rotasTxt: v } })); };
  updateEmpresa = (e) => { const v = e.target.value; this.setState(s => ({ cfgDraft: { ...s.cfgDraft, empresaNome: v } })); };
  descartarConfig = () => this.setState({ cfgDraft: this._cfgCopia() });
  salvarConfig = async () => {
    const d = this.state.cfgDraft; if (!d || this.state.salvando) return;
    const metas = {};
    for (const [k, v] of Object.entries(d.metas)) metas[k] = parseFloat(String(v).replace(',', '.'));
    this.setState({ salvando: true });
    try {
      const config = await api('PUT', '/api/configuracoes', {
        metas, rotas: String(d.rotasTxt || '').split('\n').map(x => x.trim()).filter(Boolean), empresa: { nome: d.empresaNome },
      });
      this.setState({ config }, () => this.setState({ cfgDraft: this._cfgCopia() }));
      this.avisar('Configurações salvas. Os indicadores já usam as novas metas.', 'ok');
    } catch (e) { this.avisar(e); }
    finally { this.setState({ salvando: false }); }
  };
  carregarHistorico = async () => {
    try {
      const f = this.state.histRecurso || '';
      const rows = await api('GET', '/api/auditoria?limite=300' + (f ? '&recurso=' + encodeURIComponent(f) : ''));
      this.setState({ auditoria: rows });
    } catch (e) { this.avisar(e); }
  };
  setHistRecurso = (e) => this.setState({ histRecurso: e.target.value }, () => this.carregarHistorico());
  baixarBackup = () => { window.location.href = '/api/backup'; };
  newUsuario = () => this.setState({ modal:'usuario', isEditing:false, draft:{ nome:'', usuario:'', role:'colaborador', ativo:'sim', senha:'' } });
  editUsuario = (id) => {
    const u = (this.state.usuarios || []).find(x => x.id === id); if (!u) return;
    this.setState({ modal:'usuario', isEditing:false, draft:{ ...u, ativo: u.ativo ? 'sim' : 'nao', senha:'' } });
  };
  abrirSenha = () => this.setState({ modal:'senha', isEditing:false, draft:{ atual:'', nova:'', confirma:'' } });
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
  setRoleAdmin = () => { if (this.state.user && this.state.user.role === 'admin') this.setState({ role:'admin' }); };
  setRoleColab = () => this.setState(s => ({ role:'colaborador', screen: this.ADMIN_ONLY_SCREENS.includes(s.screen) ? 'entradas' : s.screen }));
  openCliente(id) { this.setState({ screen: 'clientes', clienteView: 'detail', clienteId: id }); }

  healthOf(c, inadPct, ticketEntrega) {
    if (!c || !c.status) return 'green';
    if (c.status === 'inadimplente' || c.status === 'inativo') return 'red';
    const inad = inadPct || 0, te = ticketEntrega || 0, M = this._metas();
    if (inad > M.inadAlerta || (te > 0 && te < M.ticketEntregaRisco)) return 'red';
    if (inad > M.inadMax || (te > 0 && te < M.ticketEntregaMin) || c.tend === '↓' || c.status === 'negociacao') return 'amber';
    return 'green';
  }

  newCliente = () => {
    const id = (this.state.clientes.reduce((m,x)=>Math.max(m,x.id),0) || 0) + 1;
    this.setState({ modal:'cliente', isEditing:false, draft:{ id, nome:'', resp:'', cnpj:'', tel:'', email:'', endereco:'', rota:this._rotas()[0], freq:'2×/sem · Seg e Qui', status:'ativo', ticketMes:0, ticketEntrega:0, volume:0,  cobranca:'Em dia', forma:'PIX', limite:0, prazo:14, tend:'→', ult:'—', obs:'' } });
  };
  editCliente = (id) => { const c = this.state.clientes.find(x=>x.id===id); if (c) this.setState({ modal:'cliente', isEditing:true, draft:{ ...c } }); };
  editCurrentCliente = () => this.editCliente(this.state.clienteId);
  deleteCurrentCliente = async () => {
    if (!window.confirm('Excluir este cliente? Esta ação não pode ser desfeita.')) return;
    try {
      await this._excluir('cliente', this.state.clienteId);
      this.setState({ clienteView:'list', modal:null, draft:null });
    } catch (e) { this.avisar(e); }
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
    const hoje = this._hojeIso();
    this.setState({ modal:'entrada', isEditing:false, draft:{ id, fornecedor:f0?f0.nome:'', data:hoje, pesoKg:0, valor:0, perdaKg:0, motivo:'—', pago:'Pendente', dataPag:'', formaPag:'PIX', itens:[] } });
  };
  editEntrada = (id) => { const e = this.state.entradas.find(x=>x.id===id); if (e) this.setState({ modal:'entrada', isEditing:true, draft:{ ...e, itens:(e.itens||[]).map(i=>({...i})) } }); };
  /** "Marcar pago" da compra: abre a baixa (data, forma e conta). */
  marcarEntradaPaga = (id, ev) => this.openPagarEntrada(id, ev);
  openPagarEntrada = (id, ev) => {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    const e = this.state.entradas.find(x => x.id === id); if (!e) return;
    this.setState({ modal:'pagarEntrada', isEditing:false, draft:{ id, dataPag:this._hojeIso(), forma:e.formaPag || 'PIX', bancoId:String(e.bancoId||'') } });
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
    this.setState({ modal:'pagamento', isEditing:false, draft:{ id, dataPag: p.dataPagIso || hoje, forma: p.formaPag || 'PIX', bancoId: String(p.bancoId||'') } });
  };

  addItem = () => this.setState(s => ({ draft:{ ...s.draft, itens:[ ...(s.draft.itens||[]), { produtoId:'', nome:'', un:'KG', kg:0, preco:0, perdaKg:0 } ] } }));

  TIPOS_INTERACAO = ['Visita comercial','Ligação','Ligação de cobrança','WhatsApp','E-mail','Reclamação','Outro'];
  INTERACAO_COR = { 'Visita comercial':'#2e8b4a', 'Ligação':'#2f6fb0', 'Ligação de cobrança':'#d6334a', 'WhatsApp':'#2f6fb0', 'E-mail':'#7a5d8f', 'Reclamação':'#c79320', 'Outro':'#6b7a6f' };
  newInteracao = () => {
    const c = this.state.clientes.find(x=>x.id===this.state.clienteId) || this.state.clientes[0]; if (!c) return;
    this.setState({ modal:'interacao', isEditing:false, draft:{ clienteId:c.id, data:this._hojeIso(), tipo:'Visita comercial', texto:'' } });
  };
  editInteracao = (id) => { const i = (this.state.interacoes||[]).find(x=>x.id===id); if (i) this.setState({ modal:'interacao', isEditing:true, draft:{ ...i } }); };

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
    this.setState({ modal:'fornecedor', isEditing:false, draft:{ id, nome:'', regiao:'', contato:'', prazo:0, produtos:[] } });
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
    this.setState({ modal:'lancamento', isEditing:false, draft: Object.assign({ id, data:this._hojeIso(), categoria:'Gasolina', descricao:'', valor:0, funcionarioId:'', veiculoId:'', bancoId:'', pago:'Pago', dataPag:'' }, p||{}) });
  };
  editLancamento = (id) => { const l = this.state.lancamentos.find(x=>x.id===id); if (l) this.setState({ modal:'lancamento', isEditing:true, draft:{ ...l } }); };
  toggleFunc = (id, ev) => {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    this.setState(s => ({ funcAberto: s.funcAberto===id ? null : id }));
  };
  newDiaria = () => {
    const id = (this.state.lancamentos.reduce((m,x)=>Math.max(m,x.id||0),0) || 0) + 1;
    this.setState({ modal:'diaria', isEditing:false, draft:{ id, data:this._hojeIso(), categoria:'Diária', diarista:'', descricao:'', valor:'', funcionarioId:'', veiculoId:'', bancoId:'', pago:'Pendente', dataPag:'' } });
  };
  /** Abre o "Pagar" de uma conta a pagar (diária pendente). */
  openPagarLanc = (id, ev) => {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    const l = this.state.lancamentos.find(x=>x.id===id); if (!l) return;
    this.setState({ modal:'pagarLanc', isEditing:false, draft:{ id, dataPag:this._hojeIso(), bancoId:String(l.bancoId||''), forma:'PIX', rotulo: l.categoria === 'Diária' ? 'diária' : 'conta' } });
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

  saveDraft = async () => {
    const M = this.state.modal, draft = this.state.draft;
    if (!M || !draft || this.state.salvando) return;
    const isNew = !this.state.isEditing;
    const num = v => parseFloat(String(v).replace(',', '.')) || 0;
    const fechar = (extra = {}) => this.setState({ modal:null, draft:null, aviso:null, ...extra });
    this.setState({ salvando: true });
    try {
      if (M === 'cliente') {
        const d = { ...draft };
        ['limite','prazo'].forEach(k => { d[k] = num(d[k]); });
        const saved = await this._gravar('clientes', d, isNew);
        fechar({ screen:'clientes', clienteView:'detail', clienteId:saved.id });
        if (!isNew) await this._recarregarDados();
      } else if (M === 'pedido' || M === 'entrada') {
        const d = { ...draft };
        if (d.itens && d.itens.length) {
          d.pesoKg = d.itens.reduce((s,i)=>s+(+i.kg||0),0);
          d.valor = Math.round(d.itens.reduce((s,i)=>s+(+i.kg||0)*(+i.preco||0),0));
          d.perdaKg = d.itens.reduce((s,i)=>s+(+i.perdaKg||0),0);
        } else {
          ['pesoKg','valor','perdaKg'].forEach(k => { d[k] = num(d[k]); });
        }
        if (M === 'pedido') {
          d.recebDias = num(d.recebDias);
          await this._gravar('pedidos', d, isNew, true);
          fechar({ screen:'pedidos', periodo:'all' });
        } else {
          await this._gravar('entradas', d, isNew);
          fechar({ screen:'entradas', periodo:'all' });
        }
      } else if (M === 'fornecedor') {
        await this._gravar('fornecedores', { ...draft, produtos:(draft.produtos||[]).slice() }, isNew);
        fechar();
        if (!isNew) await this._recarregarDados();
      } else if (M === 'produto') {
        await this._gravar('produtos', { ...draft }, isNew);
        fechar();
        if (!isNew) await this._recarregarDados();
      } else if (M === 'perda') {
        await this._gravar('perdas', { ...draft, qtd: num(draft.qtd) }, isNew);
        fechar();
      } else if (M === 'lancamento') {
        const d = { ...draft, valor: num(draft.valor) };
        if (!this.VEIC_CATS.includes(d.categoria)) d.veiculoId = '';
        if ((d.pago || 'Pago') === 'Pago' && !d.dataPag) d.dataPag = d.data;
        if (d.pago === 'Pendente') d.dataPag = '';
        await this._gravar('lancamentos', d, isNew);
        fechar();
      } else if (M === 'diaria') {
        const d = { ...draft, categoria:'Diária', diarista:String(draft.diarista||'').trim(),
          valor: parseFloat(String(draft.valor||'0').replace(/\./g,'').replace(',','.')) || 0 };
        if (d.pago === 'Pago' && !d.dataPag) d.dataPag = this._hojeIso();
        if (d.pago !== 'Pago') d.dataPag = '';
        await this._gravar('lancamentos', d, isNew);
        fechar();
      } else if (M === 'pagarLanc') {
        const l = this.state.lancamentos.find(x => x.id === draft.id);
        if (l) {
          await this._gravar('lancamentos', { ...l, pago:'Pago', dataPag:draft.dataPag, bancoId:draft.bancoId }, false);
          this.avisar((l.categoria === 'Diária' ? 'Diária' : 'Conta') + ' paga.', 'ok');
        }
        this.setState({ modal:null, draft:null });
      } else if (M === 'banco') {
        const d = { ...draft, saldoInicial: parseFloat(String(draft.saldoInicial||'0').replace(/\./g,'').replace(',','.')) || 0 };
        await this._gravar('bancos', d, isNew);
        fechar();
      } else if (M === 'veiculo') {
        await this._gravar('veiculos', { ...draft, placa:String(draft.placa||'').toUpperCase().trim() }, isNew);
        fechar();
      } else if (M === 'funcionario') {
        await this._gravar('funcionarios', { ...draft, salario: num(draft.salario) }, isNew);
        fechar();
      } else if (M === 'interacao') {
        await this._gravar('interacoes', { ...draft }, isNew);
        fechar();
      } else if (M === 'usuario') {
        const novo = draft.id == null;
        const salvo = novo
          ? await api('POST', '/api/usuarios', { nome:draft.nome, usuario:draft.usuario, role:draft.role, senha:draft.senha })
          : await api('PUT', '/api/usuarios/' + draft.id, { nome:draft.nome, role:draft.role, ativo:draft.ativo, senha:draft.senha });
        this.setState(s => {
          const lista = (s.usuarios || []).slice(); const i = lista.findIndex(x => x.id === salvo.id);
          if (i >= 0) lista[i] = salvo; else lista.push(salvo);
          return { usuarios: lista, user: s.user && s.user.id === salvo.id ? { ...s.user, nome: salvo.nome } : s.user };
        });
        this.avisar(novo ? 'Usuário criado.' : 'Usuário atualizado.', 'ok');
        this.setState({ modal:null, draft:null });
      } else if (M === 'senha') {
        if (!draft.nova || draft.nova !== draft.confirma) { this.avisar('A confirmação não confere com a nova senha.'); return; }
        await api('POST', '/api/auth/senha', { atual:draft.atual, nova:draft.nova });
        this.avisar('Senha alterada. As outras sessões abertas foram encerradas.', 'ok');
        this.setState({ modal:null, draft:null });
      } else if (M === 'pagamento') {
        const p = this.state.pedidos.find(x => x.id === draft.id);
        if (p) {
          const rec = this._daysBetween(p.entrega, draft.dataPag);
          await this._gravar('pedidos', { ...p, pag:'Pago', dataPagIso:draft.dataPag, dataPag:draft.dataPag, formaPag:draft.forma, bancoId:draft.bancoId,
            recebDias: (rec!=null? rec : (p.recebDias>0? p.recebDias : 1)) }, false);
          this.avisar('Recebimento registrado.', 'ok');
        }
        this.setState({ modal:null, draft:null });
      } else if (M === 'pagarEntrada') {
        const e = this.state.entradas.find(x => x.id === draft.id);
        if (e) {
          await this._gravar('entradas', { ...e, pago:'Pago', dataPag:draft.dataPag, formaPag:draft.forma, bancoId:draft.bancoId }, false);
          this.avisar('Compra paga.', 'ok');
        }
        this.setState({ modal:null, draft:null });
      }
    } catch (e) {
      this.avisar(e);
    } finally {
      this.setState({ salvando: false });
    }
  };

  deleteFromModal = async () => {
    const d = this.state.draft, M = this.state.modal;
    if (!d || !COLS[M]) return;
    if (!window.confirm('Excluir este registro? Esta ação não pode ser desfeita.')) return;
    try {
      await this._excluir(M, d.id);
      this.setState({ modal:null, draft:null, ...(M === 'cliente' ? { clienteView:'list' } : {}) });
    } catch (e) { this.avisar(e); }
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
    const M = this._metas(); // metas e limites (Configurações)
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
      { key:'contas', label:'Contas a pagar/receber', badge:'' },
      { key:'relatorios', label:'Relatórios', badge:'' },
      { key:'configuracoes', label:'Configurações', badge:'' }
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
      configuracoes:['Configurações','Metas dos indicadores, listas, usuários, histórico de alterações e backup'],
      contas:['Contas a pagar e receber','Tudo em aberto por vencimento — cada baixa sai ou entra numa conta'],
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
    // períodos: todo mês (ano+mês) que tem movimento, mais o mês atual — do mais recente ao mais antigo
    const mesesComDados = new Set<string>([this._hojeIso().slice(0,7)]);
    [ ...pedidosRaw.map(p=>p.entrega), ...this.state.entradas.map(e=>e.data),
      ...this.state.lancamentos.map(l=>l.data), ...(this.state.perdas||[]).map(p=>p.data) ]
      .forEach(d => { const k = this.anoMes(d); if (k) mesesComDados.add(k); });
    const periodOptions = [ {v:'all',l:'Todos os períodos'} ].concat(
      [...mesesComDados].sort().reverse().map(k => ({ v:k, l:this.MESES[+k.slice(5,7)-1]+' '+k.slice(0,4) })));
    // período escolhido que deixou de existir (ex.: dados excluídos) volta para "todos"
    const periodo = periodOptions.some(o=>o.v===this.state.periodo) ? this.state.periodo : 'all';
    const periodLabel = (periodOptions.find(o=>o.v===periodo)||periodOptions[0]).l;
    const pedidosPeriodo = periodo==='all' ? pedidosRaw : pedidosRaw.filter(p=>this.anoMes(p.entrega)===periodo);
    const entregues = pedidosPeriodo.filter(p=>p.status==='Entregue');
    const receitaFat = entregues.reduce((s,p)=>s+(p.valor||0),0);
    const aReceber = pedidosPeriodo.filter(p=>p.pag==='Atrasado'||p.pag==='Pendente').reduce((s,p)=>s+(p.valor||0),0);
    const nAtraso = pedidosPeriodo.filter(p=>p.pag==='Atrasado').length;
    // inadimplência: quanto do faturado está atrasado (vivo, vem dos pedidos)
    const valorAtraso = pedidosPeriodo.filter(p=>p.pag==='Atrasado').reduce((s,p)=>s+(p.valor||0),0);
    const inadMedia = receitaFat>0 ? valorAtraso/receitaFat*100 : 0;
    // perda sobre o que foi COMPRADO: na coleta (entrada) + no depósito depois
    const entradasRaw = this.state.entradas;
    const entradasPeriodo = periodo==='all' ? entradasRaw : entradasRaw.filter(en=>this.anoMes(en.data)===periodo);
    const entKgTot = entradasPeriodo.reduce((s,en)=>s+(en.pesoKg||0),0);
    const perdasDep = periodo==='all' ? (this.state.perdas||[]) : (this.state.perdas||[]).filter(p=>this.anoMes(p.data)===periodo);
    const perdaDepTot = perdasDep.reduce((s,p)=>s+(+p.qtd||0),0);
    const entPerdaTot = entradasPeriodo.reduce((s,en)=>s+(en.perdaKg||0),0) + perdaDepTot;
    const perdaMedia = entKgTot ? (entPerdaTot/entKgTot*100) : 0;
    // Tickets calculados a partir dos pedidos entregues no período
    const nEntregas = entregues.length;
    const clientesAtendidos = new Set(entregues.map(p=>p.cliente)).size;
    const ticketEntregaReal = nEntregas ? receitaFat / nEntregas : 0;
    // "por mês": em "Todos os períodos" divide pelo nº de meses com entrega (média mensal)
    const nMeses = periodo==='all' ? Math.max(1, new Set(entregues.map(p=>this.anoMes(p.entrega)).filter(Boolean)).size) : 1;
    const ticketMesReal = clientesAtendidos ? receitaFat / clientesAtendidos / nMeses : 0;
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
        entregaColor: !isAdmin? '#6b7a6f' : (cTE>=M.ticketEntregaMin?this.GREEN:(cTE>=M.ticketEntregaRisco? this.AMBER : this.RED)),
        part: !isAdmin? '—' : (receitaFat? Math.round(cFat/receitaFat*100):0)+'%',
        inad: !isAdmin? '—' : cIn.toFixed(1).replace('.',',')+'%',
        inadColor: !isAdmin? '#6b7a6f' : (cIn<=M.inadMax?this.GREEN:(cIn<=M.inadAlerta? this.AMBER : this.RED)),
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
    // cliente desde: o que vier antes — cadastro no sistema ou primeiro pedido
    const cInicio = [c.desde, ...cAllPeds.map(p=>p.dataPedido||p.entrega)].filter(Boolean).sort()[0];
    const cDesde = cInicio ? this.MESES[+cInicio.slice(5,7)-1].slice(0,3).toLowerCase()+'/'+cInicio.slice(0,4) : '—';
    const initials = (c.nome||'').split(' ').filter(w=>w.length>2).slice(0,2).map(w=>w[0]).join('').toUpperCase();
    const sel = {
      nome:c.nome, resp:c.resp, cnpj:c.cnpj, tel:c.tel, endereco:c.endereco, initials,
      statusLabel:stc.l, healthColor:hmc.c, healthBg:hmc.bg, healthFull:hmc.f, obs:c.obs,
      metricas:[
        { label:'Qtd no período', value:cVolume.toLocaleString('pt-BR'), sub:cEntregues.length+' entrega(s)', color:'#16241b' },
        { label:'Faturado / mês', value:'R$ '+Math.round(cFaturado/nMeses).toLocaleString('pt-BR'), sub:(nMeses>1?'média de '+nMeses+' meses · ':'')+'meta R$ '+M.ticketMesMin.toLocaleString('pt-BR')+'–'+M.ticketMesMax.toLocaleString('pt-BR'), color: cFaturado/nMeses>=M.ticketMesMin?this.GREEN:(cFaturado/nMeses>=M.ticketMesAlerta?this.AMBER:this.RED) },
        { label:'Ticket/entrega', value:'R$ '+cTicketEntrega.toLocaleString('pt-BR'), sub:'meta ≥ R$ '+M.ticketEntregaMin.toLocaleString('pt-BR'), color: cTicketEntrega>=M.ticketEntregaMin?this.GREEN:(cTicketEntrega>=M.ticketEntregaRisco?this.AMBER:this.RED) },
        { label:'% do faturamento', value:cPart+'%', sub:'risco de concentração', color:'#16241b' },
        { label:'Última compra', value:cUlt, sub:'do último pedido entregue', color:'#16241b' },
        { label:'Inadimplência', value:cInad.toFixed(1).replace('.',',')+'%', sub:'meta ≤ '+M.inadMax+'% · '+cAtrasados.length+' atraso(s)', color: cInad<=M.inadMax?this.GREEN:(cInad<=M.inadAlerta?this.AMBER:this.RED) }
      ],
      cadastro:[
        { k:'Região / rota', v:c.rota }, { k:'Frequência', v:c.freq },
        { k:'Status', v:stc.l }, { k:'Forma de pagto', v:c.forma },
        { k:'Cliente desde', v:cDesde }, { k:'Código', v:'#'+c.id }
      ],
      credito:[
        { k:'Limite de crédito', v:'R$ '+c.limite.toLocaleString('pt-BR'), color:'#16241b' },
        { k:'Prazo de pagamento', v:c.prazo+' dias', color:'#16241b' },
        { k:'Taxa de inadimplência', v:cInad.toFixed(1).replace('.',',')+'%', color: cInad<=M.inadMax?this.GREEN:(cInad<=M.inadAlerta?this.AMBER:this.RED) },
        { k:'Status de cobrança', v:cCobranca, color: cCobranca==='Em dia'?this.GREEN:this.RED },
        { k:'Histórico de atrasos', v: cAtrasados.length===0 ? '0 atrasos' : (cAtrasados.length+' pedido(s) · R$ '+cAtrasados.reduce((s,p)=>s+(p.valor||0),0).toLocaleString('pt-BR')), color: cAtrasados.length? this.RED : '#16241b' }
      ],
      pedidos: pedidosRaw.filter(p => p.cliente===c.nome).slice(0,4).map(p => ({
        id:p.id, data:this._fmtDate(p.entrega), peso:(p.pesoKg||0).toLocaleString('pt-BR'), valor:'R$ '+(p.valor||0).toLocaleString('pt-BR'), status:p.status,
        statusColor:this.pStatusColor(p.status), statusBg:this.pStatusBg(p.status)
      })),
      // histórico real, registrado pela equipe (mais recente primeiro)
      interacoes: (this.state.interacoes||[]).filter(i => i.clienteId === c.id)
        .slice().sort((a,b)=>String(b.data).localeCompare(String(a.data)) || b.id-a.id)
        .map(i => ({ tipo:i.tipo, data:this._fmtDate(i.data), por:i.autorNome||'—', texto:i.texto,
          color: this.INTERACAO_COR[i.tipo] || '#6b7a6f', edit:() => this.editInteracao(i.id) }))
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
    let entTotals: any = { peso:'0 kg', valor:'R$ 0' };
    const estoqueAlertas = []; let temAlertaEstoque = false;
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
          perdaColor: pct<=M.perdaMax?this.GREEN:(pct<=M.perdaAlerta?this.AMBER:this.RED),
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
        perdaColor: ppct<=M.perdaMax?this.GREEN:(ppct<=M.perdaAlerta?this.AMBER:this.RED) };
      entTotals = { peso:pk.toLocaleString('pt-BR'), valor:'R$ '+Math.round(pv).toLocaleString('pt-BR'),
        perdaKg:pp.toLocaleString('pt-BR'), perdaPct:ppct.toFixed(1).replace('.',',')+'%',
        perdaColor: ppct<=M.perdaMax?this.GREEN:(ppct<=M.perdaAlerta?this.AMBER:this.RED) };
    }

    // ---- financeiro (vivo, a partir dos pedidos + lançamentos) ----
    const fmtBR = n => Math.round(n).toLocaleString('pt-BR');
    const compraMercadoria = entradasPeriodo.reduce((s,en)=>s+(en.valor||0),0);
    const lancRaw = this.state.lancamentos;
    const lancPeriodo = periodo==='all' ? lancRaw : lancRaw.filter(l=>this.anoMes(l.data)===periodo);
    // contas a pagar: lançamento 'Pendente' é custo do período, mas ainda não saiu do caixa
    const lancPago = l => (l.pago || 'Pago') === 'Pago';
    const lancPagos = lancRaw.filter(lancPago);
    // ---- movimento de caixa por conta: tudo que já foi recebido ou pago (conta '' = caixa) ----
    const movs = [];
    pedidosRaw.filter(p=>p.pag==='Pago').forEach(p => movs.push({ conta:String(p.bancoId||''), d:p.dataPagIso||p.entrega, ent:p.valor||0, sai:0, origem:'Venda '+p.id+' — '+p.cliente }));
    entradasRaw.filter(e=>e.pago==='Pago').forEach(e => movs.push({ conta:String(e.bancoId||''), d:e.dataPag||e.data, ent:0, sai:e.valor||0, origem:'Compra '+e.id+' — '+e.fornecedor }));
    lancPagos.forEach(l => movs.push({ conta:String(l.bancoId||''), d:l.dataPag||l.data, ent:0, sai:l.valor||0, origem:l.categoria+(l.diarista?' — '+l.diarista:'')+(l.descricao?' — '+l.descricao:'') }));
    const movsPeriodo = periodo==='all' ? movs : movs.filter(m=>this.anoMes(m.d)===periodo);
    const nomeConta = id => { const b = this.state.bancos.find(x=>String(x.id)===String(id)); return b ? b.instituicao : 'Caixa'; };
    const somaConta = (lista, conta) => lista.filter(m=>m.conta===conta).reduce((a,m)=>({ ent:a.ent+m.ent, sai:a.sai+m.sai, n:a.n+1 }), { ent:0, sai:0, n:0 });
    const fmtSaldo = v => (v<0?'−R$ ':'R$ ')+Number(Math.abs(v)).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
    const caixaPer = somaConta(movsPeriodo, ''), caixaTot = somaConta(movs, '');
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
      const per = somaConta(movsPeriodo, String(b.id)), tot = somaConta(movs, String(b.id));
      const saldoV = (+b.saldoInicial||0) + tot.ent - tot.sai;
      const sig = String(b.instituicao||'?').split(/\s+/).filter(w=>w.length>2||/^[A-Z]/.test(w)).slice(0,2).map(w=>w[0]).join('').toUpperCase();
      return { nome:b.instituicao, codigo:'Cód. '+bCod(b.instituicao), sigla:sig, conta:[b.agencia,b.conta].filter(Boolean).join(' / ')||'—', apelido:b.apelido||'—', inativo:b.ativo==='nao',
        entradas:brMoney(per.ent), saidas:brMoney(per.sai), qtd:String(per.n), edit:()=>this.editBanco(b.id),
        saldo:fmtSaldo(saldoV), saldoColor: saldoV<0?'#b3283d':'#16241b' };
    });
    const WDS = ['dom','seg','ter','qua','qui','sex','sáb'];
    const diarPer = lancPeriodo.filter(l => l.categoria==='Diária').slice().sort((a,b)=>String(b.data||'').localeCompare(String(a.data||'')));
    const diariaRows = diarPer.map(l => { const bk = this.state.bancos.find(b=>String(b.id)===String(l.bancoId||'')); const dt = new Date(String(l.data)+'T12:00:00').getTime();
      return { data: ddmm(l.data), semana: isNaN(dt) ? '' : WDS[new Date(dt).getDay()], diarista: l.diarista || '—', servico: l.descricao || '—', valor: brMoney(l.valor),
        banco: bk ? bk.instituicao : 'Sem banco', bancoColor: bk ? '#435349' : '#9aa69d', edit: () => this.editDiaria(l.id),
        paga: lancPago(l), situacao: lancPago(l) ? 'Paga' : 'A pagar',
        situacaoColor: lancPago(l) ? this.GREEN : this.AMBER, situacaoBg: lancPago(l) ? this.GBG : this.ABG,
        pagInfo: lancPago(l) && l.dataPag ? 'em ' + ddmm(l.dataPag) : '',
        pagar: ev => this.openPagarLanc(l.id, ev) }; });
    const diariaStats = [
      { label:'Diárias lançadas', value:String(diarPer.length), sub: periodLabel },
      { label:'Total em diárias', value: brMoney(diarPer.reduce((s,l)=>s+(l.valor||0),0)), sub: periodLabel },
      { label:'A pagar', value: brMoney(diarPer.filter(l=>!lancPago(l)).reduce((s,l)=>s+(l.valor||0),0)),
        sub: diarPer.filter(l=>!lancPago(l)).length + ' diária(s) pendente(s)', color: diarPer.some(l=>!lancPago(l)) ? this.AMBER : this.GREEN },
      { label:'Diaristas', value:String(new Set(diarPer.map(l=>l.diarista).filter(Boolean)).size), sub:'pessoas diferentes' }
    ];
    const diaristaNomes = [...new Set<string>(this.state.lancamentos.filter(l=>l.categoria==='Diária' && l.diarista).map(l=>l.diarista))].map(v=>({ v }));
    const fv = this.state.funcView || 'equipe';
    const lancTotal = lancPeriodo.reduce((s,l)=>s+(l.valor||0),0);
    const receitaBruta = receitaFat; // vem dos pedidos entregues no período
    const custoTotal = compraMercadoria + lancTotal;
    const lucroLiquido = receitaBruta - custoTotal;
    const pctLucro = receitaBruta ? lucroLiquido/receitaBruta*100 : 0;
    // saldo em caixa (todas as épocas): vendas pagas − compras pagas − lançamentos pagos
    const cashAll = movs.reduce((s,m)=>s+m.ent-m.sai,0);
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
    // prazo real de pagamento ao produtor: média de dias entre a coleta e o pagamento
    const prazosForn = entradasRaw.filter(e=>e.pago==='Pago' && e.dataPag).map(e=>this._daysBetween(e.data, e.dataPag)).filter(d=>d!=null);
    const cicloPag = prazosForn.length ? Math.round(avg(prazosForn)) : 3;
    const cicloDias = cicloEst + cicloReceb - cicloPag;
    const cicloColor = cicloDias<=M.cicloMaxDias ? this.GREEN : (cicloDias<=M.cicloAlertaDias ? this.AMBER : this.RED);
    const cicloSum = cicloPag + cicloEst + cicloReceb || 1;

    // ---- dashboard ----
    const statCards = [
      { label:'Receita bruta', value:'R$ '+fmtBR(receitaBruta), delta:entregues.length+' pedido(s) entregue(s) · '+periodLabel, deltaColor:this.GREEN },
      { label:'Lucro líquido op.', value:'R$ '+fmtBR(lucroLiquido), delta:pctLucro.toFixed(1).replace('.',',')+'% s/ receita', deltaColor: lucroLiquido>0?this.GREEN:this.RED },
      { label:'Ciclo de caixa', value:cicloDias+(cicloDias===1?' dia':' dias'), delta:'meta ≤ '+M.cicloMaxDias+' dias', deltaColor: cicloColor },
      { label:'Minimercados ativos', value:String(nAtivos), delta:(nAtivos-M.minimercadosEquilibrio>=0?'+':'')+(nAtivos-M.minimercadosEquilibrio)+' vs. equilíbrio ('+M.minimercadosEquilibrio+')', deltaColor: nAtivos>=M.minimercadosEquilibrio?this.GREEN:this.RED }
    ];
    const pctMeta = (v, meta) => Math.min(100, meta ? Math.round(v/meta*100) : 0)+'%';
    const kpis = [
      { label:'Índice de perdas (%)', real:fmtPct1(perdaMedia), meta:'≤ '+M.perdaMax+'%', pct:pctMeta(perdaMedia, M.perdaMax), color: perdaMedia<=M.perdaMax?this.GREEN:(perdaMedia<=M.perdaAlerta?this.AMBER:this.RED), tag: perdaMedia<=M.perdaMax?'na meta':'fora' },
      { label:'Markup médio (venda/compra)', real:Math.round(markupMedio)+'%', meta:'≥ '+M.markupMin+'%', pct:pctMeta(markupMedio, M.markupMin), color: markupMedio>=M.markupMin?this.GREEN:this.RED, tag: markupMedio>=M.markupMin?'na meta':'fora' },
      { label:'Nº de minimercados ativos', real:String(nAtivos), meta:'~'+M.minimercadosMeta, pct:pctMeta(nAtivos, M.minimercadosMeta), color: nAtivos>=M.minimercadosMeta?this.GREEN:(nAtivos>=M.minimercadosAlerta?this.AMBER:this.RED), tag:(nAtivos-M.minimercadosMeta>=0?'+':'')+(nAtivos-M.minimercadosMeta) },
      { label:'Ticket médio / minimercado', real:'R$ '+Math.round(ticketMesReal).toLocaleString('pt-BR'), meta:(M.ticketMesMin/1000).toLocaleString('pt-BR')+'–'+(M.ticketMesMax/1000).toLocaleString('pt-BR')+'k', pct:pctMeta(ticketMesReal, M.ticketMesMax), color: ticketMesReal>=M.ticketMesMin?this.GREEN:(ticketMesReal>=M.ticketMesAlerta?this.AMBER:this.RED), tag: ticketMesReal>=M.ticketMesMin?'na meta':'quase' },
      { label:'Ticket médio por entrega', real:'R$ '+Math.round(ticketEntregaReal).toLocaleString('pt-BR'), meta:'≥ R$ '+M.ticketEntregaMin.toLocaleString('pt-BR'), pct:pctMeta(ticketEntregaReal, M.ticketEntregaMin), color: ticketEntregaReal>=M.ticketEntregaMin?this.GREEN:(ticketEntregaReal>=M.ticketEntregaRisco?this.AMBER:this.RED), tag:(ticketEntregaReal>=M.ticketEntregaMin?'na meta':'-R$'+Math.round(M.ticketEntregaMin-ticketEntregaReal)) },
      { label:'Inadimplência por cliente', real:fmtPct1(inadMedia), meta:'≤ '+M.inadMax+'%', pct:pctMeta(inadMedia, M.inadMax), color: inadMedia<=M.inadMax?this.GREEN:(inadMedia<=M.inadAlerta?this.AMBER:this.RED), tag: inadMedia<=M.inadMax?'na meta':'fora' },
      { label:'Giro de estoque (dias)', real:cicloEst.toString().replace('.',','), meta:'≤ '+M.giroMaxDias+' d', pct:pctMeta(cicloEst, M.giroMaxDias), color: cicloEst<=M.giroMaxDias?this.GREEN:this.AMBER, tag: cicloEst<=M.giroMaxDias?'na meta':'+'+(cicloEst-M.giroMaxDias)+'d' },
      { label:'Ciclo de caixa (dias)', real:String(cicloDias), meta:'≤ '+M.cicloMaxDias+' d', pct:pctMeta(cicloDias, M.cicloMaxDias), color: cicloColor, tag: cicloDias<=M.cicloMaxDias?'na meta':'+'+(cicloDias-M.cicloMaxDias)+'d' }
    ];
    const cartArr = Object.keys(fatByClient).map(nome => ({ nome, fat:fatByClient[nome] })).filter(x=>x.fat>0).sort((a,b)=>b.fat-a.fat);
    const cartDen = receitaFat || 1;
    const cartTop = cartArr.slice(0,5);
    const cartRest = cartArr.slice(5).reduce((s,x)=>s+x.fat,0);
    const cartMax = cartTop.length ? cartTop[0].fat/cartDen*100 : 1;
    const carteira = cartTop.map(x => { const sh = x.fat/cartDen*100; return { nome:x.nome, pct:Math.round(sh)+'%', bar:(cartMax?Math.round(sh/cartMax*100):0)+'%', color: sh>M.concentracaoMax?this.RED:'#1d7a3e' }; });
    if (cartRest > 0) carteira.push({ nome:'Demais '+(cartArr.length-5)+' clientes', pct:Math.round(cartRest/cartDen*100)+'%', bar:'100%', color:'#c3cdbf' });
    const top5Txt = 'Top 5 = ' + Math.round(cartTop.reduce((s,x)=>s+x.fat,0)/cartDen*100) + '% do faturamento';
    const cenBase = Math.max(lucroLiquido, 1);
    const cenPess = Math.round(cenBase*M.cenarioPessimista), cenOtim = Math.round(cenBase*M.cenarioOtimista);
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
        perdaColor: pct<=M.perdaMax?this.GREEN:(pct<=M.perdaAlerta?this.AMBER:this.RED),
        statusColor:this.pStatusColor(p.status), statusBg:this.pStatusBg(p.status),
        pagColor: isAdmin? this.pPagColor(p.pag) : '#6b7a6f', pagBg: isAdmin? this.pPagBg(p.pag) : '#f0f3ed',
        canMarkPago: isAdmin && (p.pag==='Pendente' || p.pag==='Atrasado'),
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
      const vColor = v==null ? '#6b7a6f' : (Math.abs(v)>=M.variacaoRisco?this.RED:(Math.abs(v)>=M.variacaoAlerta?this.AMBER:this.GREEN));
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
      varia:{ v: variasComDados.length ? (variaMedia>0?'+':'')+variaMedia.toFixed(1).replace('.',',')+'%' : '—', color: Math.abs(variaMedia)>=M.variacaoRisco?this.RED:this.AMBER, sub:'última compra vs. anterior · ±'+M.variacaoRisco+'% CEASA' }
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
    const produtoPerdaMediaColor = produtoPerdaMedia==null ? '#6b7a6f' : (produtoPerdaMedia<=M.perdaMax?this.GREEN:(produtoPerdaMedia<=M.perdaAlerta?this.AMBER:this.RED));
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
        markup: mk==null? '—' : Math.round(mk)+'%', markupColor: mk==null? '#6b7a6f' : (mk>=M.markupMin?this.GREEN:this.RED),
        perda: rpct==null ? '—' : rpct.toFixed(1).replace('.',',')+'%',
        perdaColor: rpct==null ? '#6b7a6f' : (rpct<=M.perdaMax?this.GREEN:(rpct<=M.perdaAlerta?this.AMBER:this.RED)),
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
      { label:'Perda média', value:fmtPct1(perdaMedia), sub:'meta ≤ '+M.perdaMax+'%', color: perdaMedia<=M.perdaMax?this.GREEN:(perdaMedia<=M.perdaAlerta?this.AMBER:this.RED) }
    ];
    const entradasRows = entradasPeriodo.map(en => {
      const ppct = en.pesoKg ? (en.perdaKg||0)/en.pesoKg*100 : 0;
      return {
        id:en.id, fornecedor:en.fornecedor, data:this._fmtDate(en.data),
        peso:(en.pesoKg||0).toLocaleString('pt-BR'), valor:'R$ '+(en.valor||0).toLocaleString('pt-BR'),
        perda: en.pesoKg ? ppct.toFixed(1).replace('.',',')+'%' : '—',
        perdaColor: ppct<=M.perdaMax?this.GREEN:(ppct<=M.perdaAlerta?this.AMBER:this.RED),
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
    const perdasDepPeriodo = (periodo==='all' ? (this.state.perdas||[]) : (this.state.perdas||[]).filter(p=>this.anoMes(p.data)===periodo));
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
    const mesFolha = periodo==='all' ? this._hojeIso().slice(0,7) : periodo;
    const mesFolhaLbl = this.MESES[+mesFolha.slice(5,7)-1]+' '+mesFolha.slice(0,4);
    const adiantByFunc = {}, salByFunc = {};
    lancRaw.filter(l=>this.anoMes(l.data)===mesFolha).forEach(l => { const k=String(l.funcionarioId||''); if(!k)return; if(l.categoria==='Adiantamento de salário') adiantByFunc[k]=(adiantByFunc[k]||0)+(l.valor||0); if(l.categoria==='Salário') salByFunc[k]=(salByFunc[k]||0)+(l.valor||0); });
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
      { label:'Adiantado no mês', value:'R$ '+fmtBR(adiantTotal), sub:mesFolhaLbl },
      { label:'A pagar no mês', value:'R$ '+fmtBR(Math.max(0,folhaTotal-adiantTotal-salPagoTotal)), sub:'salários − adiantado − pago · '+mesFolhaLbl }
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
    // fluxo de caixa do período (pela data do recebimento/pagamento), com a conta usada
    movsPeriodo.forEach(m => ledger.push({ d:m.d, tipo: m.ent>0 ? 'Entrada' : 'Saída', origem:m.origem+' · '+nomeConta(m.conta), ent:m.ent, sai:m.sai }));
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
        inad:ccIn.toFixed(1).replace('.',',')+'%', inadColor: ccIn<=M.inadMax?this.GREEN:(ccIn<=M.inadAlerta?this.AMBER:this.RED),
        healthColor:hm.c, healthBg:hm.bg, healthLabel:hm.l };
    }).sort((a,b)=>b.fat-a.fat);
    const relClientesTot = [
      { label:'Clientes ativos', value:String(ativos.length), sub:clientesRaw.length+' no total' },
      { label:'Faturamento do período', value:'R$ '+fmtBR(receitaFat), sub:periodLabel },
      { label:'Ticket médio/cliente', value:'R$ '+fmtBR(ticketMesReal), sub:'meta R$ '+M.ticketMesMin.toLocaleString('pt-BR')+'–'+M.ticketMesMax.toLocaleString('pt-BR') },
      { label:'Inadimplência média', value:fmtPct1(inadMedia), sub:'meta ≤ '+M.inadMax+'%' }
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
        perda:pp.toFixed(1).replace('.',',')+'%', perdaColor: pp<=M.perdaMax?this.GREEN:(pp<=M.perdaAlerta?this.AMBER:this.RED),
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
        markup: mk==null? '—' : Math.round(mk)+'%', markupColor: mk==null? '#6b7a6f' : (mk>=M.markupMin?this.GREEN:this.RED),
        perda: o.compQ? pp.toFixed(1).replace('.',',')+'%' : '—',
        perdaColor: pp<=M.perdaMax?this.GREEN:(pp<=M.perdaAlerta?this.AMBER:this.RED),
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
      { label:'% da receita', value:(receitaFat?(inadTotVal/receitaFat*100):0).toFixed(1).replace('.',',')+'%', sub:'meta ≤ '+M.inadMax+'%' },
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
      { label:'Índice de perdas', value:fmtPct1(perdaMedia), sub:'meta ≤ '+M.perdaMax+'%' },
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

    // ---- contas a receber / a pagar: tudo em aberto, por vencimento (não depende do período) ----
    const hojeC = this._hojeIso();
    const diasPara = venc => (venc && venc !== '—') ? Math.round((this._parseDate(venc) - this._parseDate(hojeC))/86400000) : null;
    const prazoTxt = d => d==null ? 'sem vencimento' : (d<0 ? 'venceu há '+(-d)+'d' : (d===0 ? 'vence hoje' : 'vence em '+d+'d'));
    const prazoCor = d => d==null ? '#6b7a6f' : (d<0 ? this.RED : (d<=3 ? this.AMBER : '#435349'));
    const contasReceber = pedidosRaw.filter(p=>p.pag==='Pendente'||p.pag==='Atrasado').map(p => {
      const d = diasPara(p.venc);
      return { _v: p.venc && p.venc!=='—' ? p.venc : '9999', _d:d, _valor:p.valor||0, doc:p.id, nome:p.cliente,
        detalhe:'entrega '+this._fmtDate(p.entrega)+' · '+p.status, venc: p.venc && p.venc!=='—' ? this._fmtDate(p.venc) : '—',
        prazo:prazoTxt(d), prazoColor:prazoCor(d), valor:brMoney(p.valor), acao:'Receber', baixar: ev => this.openPagamento(p.id, ev) };
    }).sort((a,b)=>String(a._v).localeCompare(String(b._v)));
    const contasPagar = entradasRaw.filter(e=>e.pago!=='Pago').map(e => {
      const v = e.venc || e.data, d = diasPara(v);
      return { _v:v, _d:d, _valor:e.valor||0, doc:e.id, nome:e.fornecedor, detalhe:'compra · coleta '+this._fmtDate(e.data),
        venc:this._fmtDate(v), prazo:prazoTxt(d), prazoColor:prazoCor(d), valor:brMoney(e.valor), acao:'Pagar', baixar: ev => this.openPagarEntrada(e.id, ev) };
    }).concat(lancRaw.filter(l=>!lancPago(l)).map(l => {
      const d = diasPara(l.data);
      return { _v:l.data, _d:d, _valor:l.valor||0, doc:l.categoria, nome:l.diarista || l.descricao || l.categoria,
        detalhe: l.categoria==='Diária' ? (l.descricao||'diária') : (l.descricao||''), venc:this._fmtDate(l.data),
        prazo:prazoTxt(d), prazoColor:prazoCor(d), valor:brMoney(l.valor), acao:'Pagar', baixar: ev => this.openPagarLanc(l.id, ev) };
    })).sort((a,b)=>String(a._v).localeCompare(String(b._v)));
    const somaV = l => l.reduce((t,x)=>t+x._valor,0);
    const totReceber = somaV(contasReceber), totPagar = somaV(contasPagar);
    const vencReceber = somaV(contasReceber.filter(x=>x._d!=null && x._d<0)), vencPagar = somaV(contasPagar.filter(x=>x._d!=null && x._d<0));
    const saldoHoje = this.state.bancos.reduce((t,b)=>t+(+b.saldoInicial||0),0) + cashAll;
    const projetado = saldoHoje + totReceber - totPagar;
    const contasStats = [
      { label:'A receber', value:brMoney(totReceber), sub:contasReceber.length+' venda(s) · '+brMoney(vencReceber)+' vencido', color: vencReceber>0?this.RED:this.GREEN },
      { label:'A pagar', value:brMoney(totPagar), sub:contasPagar.length+' conta(s) · '+brMoney(vencPagar)+' vencido', color: vencPagar>0?this.RED:this.AMBER },
      { label:'Saldo em caixa hoje', value:fmtSaldo(saldoHoje), sub:'bancos + caixa', color: saldoHoje<0?this.RED:'#0f2a18' },
      { label:'Saldo projetado', value:fmtSaldo(projetado), sub:'hoje + a receber − a pagar', color: projetado<0?this.RED:'#17642f' }
    ];

    // ---- limite de crédito do cliente (aviso no formulário do pedido) ----
    let alertaCredito = '';
    if (this.state.modal === 'pedido' && this.state.draft) {
      const dr = this.state.draft;
      const cli = clientesRaw.find(x => x.nome === dr.cliente);
      if (cli && (+cli.limite||0) > 0) {
        const emAberto = pedidosRaw.filter(x => x.cliente===cli.nome && x.id!==dr.id && (x.pag==='Pendente'||x.pag==='Atrasado')).reduce((t,x)=>t+(x.valor||0),0);
        const este = Math.round((dr.itens||[]).reduce((t,i)=>t+(+i.kg||0)*(+i.preco||0),0));
        if (dr.pag !== 'Pago' && emAberto + este > cli.limite) {
          alertaCredito = 'Limite de crédito de '+brMoney(cli.limite)+' excedido: '+cli.nome+' já deve '+brMoney(emAberto)+' e este pedido soma '+brMoney(este)+'.';
        }
      }
    }

    return {
      isAdmin,
      logged: this.state.logged, semLogin: !this.state.logged,
      loginPass: this.state.loginPass, loginErr: this.state.loginErr,
      loginHasErr: !!this.state.loginErr,
      setLoginPass:this.setLoginPass, doLogin:this.doLogin, loginOnKey:this.loginOnKey,
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
      isConfiguracoes:S==='configuracoes', cfgTab: this.state.cfgTab || 'metas', cfgSetTab:this.cfgSetTab,
      cfgDraft: this.state.cfgDraft || this._cfgCopia(), cfgAlterado: !!this.state.cfgDraft && JSON.stringify(this.state.cfgDraft) !== JSON.stringify(this._cfgCopia()),
      updateMeta:this.updateMeta, updateRotas:this.updateRotas, updateEmpresa:this.updateEmpresa, salvarConfig:this.salvarConfig, descartarConfig:this.descartarConfig,
      usuarios: (this.state.usuarios || []).map(u => ({ ...u, voce: !!this.state.user && this.state.user.id === u.id, edit: () => this.editUsuario(u.id) })),
      newUsuario:this.newUsuario, auditoria: this.state.auditoria || [], histRecurso: this.state.histRecurso || '', setHistRecurso:this.setHistRecurso,
      carregarHistorico:this.carregarHistorico, baixarBackup:this.baixarBackup, abrirSenha:this.abrirSenha,
      modalUsuario: this.state.modal==='usuario', modalSenha: this.state.modal==='senha', usuarioNovo: !!this.state.draft && this.state.draft.id == null,
      rotaOptions: this._rotas(), empresaNome: (this.state.config && this.state.config.empresa && this.state.config.empresa.nome) || CONFIG_PADRAO.empresa.nome,
      isContas:S==='contas', contasStats, contasReceber, contasPagar, noReceber: contasReceber.length===0, noPagar: contasPagar.length===0,
      alertaCredito,
      modalBaixa: ['pagamento','pagarEntrada','pagarLanc'].includes(this.state.modal), baixaRecebimento: this.state.modal==='pagamento',
      isEstoque:S==='estoque', isFuncionarios:S==='funcionarios', isVeiculos:S==='veiculos', isBancos:S==='bancos',
      funcViewEquipe: fv==='equipe', funcViewDiarias: fv==='diarias',
      funcTabEquipe: () => this.setState({ funcView:'equipe' }), funcTabDiarias: () => this.setState({ funcView:'diarias' }),
      funcTabEquipeBg: fv==='equipe'?'#1d7a3e':'#fff', funcTabEquipeFg: fv==='equipe'?'#fff':'#435349',
      funcTabDiariasBg: fv==='diarias'?'#1d7a3e':'#fff', funcTabDiariasFg: fv==='diarias'?'#fff':'#435349',
      diariaRows, diariaStats, noDiaria: diariaRows.length===0, newDiaria:this.newDiaria, modalDiaria: this.state.modal==='diaria', diaristaNomes,
      caixaOpen: !!this.state.caixaOpen, caixaSeta: this.state.caixaOpen ? '▴' : '▾', caixaBorder: this.state.caixaOpen ? '#1d7a3e' : '#cfe3d3',
      toggleCaixa: () => this.setState(s => ({ caixaOpen: !s.caixaOpen })), closeCaixa: () => this.setState({ caixaOpen:false }),
      goBancos: () => this.setState({ caixaOpen:false, screen:'bancos', clienteView:'list' }),
      bancoRows, newBanco:this.newBanco, modalBanco: this.state.modal==='banco', semBancoRow: true, semBancoQtd:String(caixaPer.n), semBancoSaidas: brMoney(caixaPer.sai), semBancoEntradas: brMoney(caixaPer.ent),
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
        const total = iniciais + cashAll, sem = caixaTot.ent - caixaTot.sai;
        const f = fmtSaldo;
        return { saldoCaixa:f(total), saldoCaixaColor: total>=0?'#17642f':this.RED, semBancoSaldo:f(sem), semBancoSaldoColor: sem<0?'#b3283d':'#16241b',
          caixaBancos: bancoRows.map(b => ({ nome:b.nome, apelido:b.apelido, saldo:b.saldo, color:b.saldoColor, nomeColor:'#16241b' }))
            .concat([{ nome:'Caixa (dinheiro)', apelido:'recebimentos e pagamentos sem banco', saldo:f(sem), color: sem<0?'#b3283d':'#16241b', nomeColor:'#5a6a5f' }]) };
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
      modalWidth: (this.state.modal==='pedido'||this.state.modal==='entrada') ? '840px' : ((this.state.modal==='pagamento'||this.state.modal==='pagarLanc'||this.state.modal==='pagarEntrada') ? '460px' : ((this.state.modal==='lancamento'||this.state.modal==='usuario'||this.state.modal==='senha'||this.state.modal==='funcionario'||this.state.modal==='perda'||this.state.modal==='veiculo'||this.state.modal==='interacao'||this.state.modal==='banco'||this.state.modal==='diaria') ? '560px' : '700px')),
      modalCliente: this.state.modal==='cliente', isEditingCliente: this.state.modal==='cliente' && this.state.isEditing,
      modalPedido: this.state.modal==='pedido',
      modalFornecedor: this.state.modal==='fornecedor',
      modalProduto: this.state.modal==='produto',
      modalFinanceiro: false,
      modalLancamento: this.state.modal==='lancamento',
      modalFuncionario: this.state.modal==='funcionario',
      modalPagamento: this.state.modal==='pagamento',
      modalPagarLanc: this.state.modal==='pagarLanc',
      modalInteracao: this.state.modal==='interacao', tiposInteracao: this.TIPOS_INTERACAO, newInteracao: this.newInteracao,
      semInteracoes: sel.interacoes.length===0,
      modalTitle: ({cliente:this.state.isEditing?'Editar cliente':'Novo cliente', pedido:this.state.isEditing?'Editar pedido':'Novo pedido', fornecedor:this.state.isEditing?'Editar fornecedor':'Novo fornecedor', produto:this.state.isEditing?'Editar produto':'Novo produto', entrada:this.state.isEditing?'Editar entrada':'Nova entrada (compra)', perda:this.state.isEditing?'Editar perda':'Registrar perda no depósito', lancamento:this.state.isEditing?'Editar lançamento':'Novo lançamento de custo', veiculo:this.state.isEditing?'Editar veículo':'Novo veículo', banco:this.state.isEditing?'Editar banco':'Novo banco', diaria:this.state.isEditing?'Editar diária':'Nova diária', funcionario:this.state.isEditing?'Editar funcionário':'Novo funcionário', interacao:this.state.isEditing?'Editar interação':'Registrar interação', usuario:(this.state.draft && this.state.draft.id != null) ? 'Editar usuário' : 'Novo usuário', senha:'Minha senha', pagarLanc:'Pagar '+(this.state.draft && this.state.draft.rotulo || 'conta'), pagarEntrada:'Pagar compra '+(this.state.draft?this.state.draft.id:''), pagamento:'Receber venda '+(this.state.draft?this.state.draft.id:'')})[this.state.modal] || '',
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
      itemRows, pedTotals, noItens,
      addItem:this.addItem, updateItem:this.updateItem,
      newCliente:this.newCliente, editCurrentCliente:this.editCurrentCliente, deleteCurrentCliente:this.deleteCurrentCliente,
      newPedido:this.newPedido,
      newFornecedor:this.newFornecedor, newProduto:this.newProduto,
      updateDraft:this.updateDraft,
      saveDraft:this.saveDraft, closeModal:this.closeModal, deleteFromModal:this.deleteFromModal,
      closeModalBackdrop:this.closeModalBackdrop, stopProp:this.stopProp,
      loginUser: this.state.loginUser, setLoginUser: this.setLoginUser, loginBusy: !!this.state.loginBusy,
      userNome: this.state.user ? this.state.user.nome : '',
      podeTrocarPerfil: !!(this.state.user && this.state.user.role === 'admin'),
      salvando: !!this.state.salvando
    };
  }

  render() {
    if (this.state.booting) return <Carregando />;
    return (
      <>
        <AppView ui={this.renderVals()} />
        {this.state.aviso ? <Aviso texto={this.state.aviso.texto} tipo={this.state.aviso.tipo} onClose={this.fecharAviso} /> : null}
      </>
    );
  }
}
