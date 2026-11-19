// Não vem do design: configurações da empresa (metas, listas, usuários, histórico de alterações e backup).
'use client';

import type { CSSProperties } from 'react';
import type { Vals } from '../types';

const card: CSSProperties = { background: '#fff', border: '1px solid #e7ece3', borderRadius: '13px', padding: '18px 20px' };
const label: CSSProperties = { fontSize: '11.5px', fontWeight: 600, color: '#4f5e54', marginBottom: '5px', display: 'block' };
const campo: CSSProperties = {
  width: '100%', padding: '9px 11px', border: '1px solid #d3dbcf', borderRadius: '8px', fontSize: '13px',
  fontFamily: "'Inter',sans-serif", color: '#16241b', background: '#fff', boxSizing: 'border-box',
};
const btn = (primario: boolean): CSSProperties => ({
  background: primario ? '#1d7a3e' : '#fff', color: primario ? '#fff' : '#2c3a31', border: primario ? 'none' : '1px solid #d3dbcf',
  borderRadius: '9px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif",
});

type Campo = [chave: string, rotulo: string, sufixo: string];
const GRUPOS: { titulo: string; dica: string; campos: Campo[] }[] = [
  { titulo: 'Perdas', dica: 'Índice de perdas sobre o comprado (coleta + depósito).', campos: [['perdaMax', 'Meta (até)', '%'], ['perdaAlerta', 'Alerta (até)', '%']] },
  { titulo: 'Margem', dica: 'Markup médio de venda sobre o preço de compra.', campos: [['markupMin', 'Markup mínimo', '%']] },
  { titulo: 'Carteira', dica: 'Minimercados ativos e concentração do faturamento.', campos: [['minimercadosMeta', 'Meta de ativos', ''], ['minimercadosAlerta', 'Alerta abaixo de', ''], ['minimercadosEquilibrio', 'Ponto de equilíbrio', ''], ['concentracaoMax', 'Máx. num cliente só', '%']] },
  { titulo: 'Ticket', dica: 'Faturamento por minimercado no mês e por entrega.', campos: [['ticketMesMin', 'Mensal — mínimo', 'R$'], ['ticketMesMax', 'Mensal — máximo', 'R$'], ['ticketMesAlerta', 'Mensal — alerta', 'R$'], ['ticketEntregaMin', 'Por entrega — meta', 'R$'], ['ticketEntregaRisco', 'Por entrega — risco', 'R$']] },
  { titulo: 'Inadimplência', dica: 'Parte do faturado que está em atraso.', campos: [['inadMax', 'Meta (até)', '%'], ['inadAlerta', 'Alerta (até)', '%']] },
  { titulo: 'Estoque e caixa', dica: 'Giro do estoque e ciclo de caixa, em dias.', campos: [['giroMaxDias', 'Giro máximo', 'dias'], ['cicloMaxDias', 'Ciclo — meta', 'dias'], ['cicloAlertaDias', 'Ciclo — alerta', 'dias']] },
  { titulo: 'Compras', dica: 'Variação do preço da última compra contra a anterior.', campos: [['variacaoAlerta', 'Alerta a partir de', '%'], ['variacaoRisco', 'Risco a partir de', '%']] },
  { titulo: 'Cenários', dica: 'Multiplicadores do lucro nos cenários do painel.', campos: [['cenarioPessimista', 'Pessimista', '×'], ['cenarioOtimista', 'Otimista', '×']] },
];

const RECURSOS: Record<string, string> = {
  clientes: 'Cliente', pedidos: 'Venda', entradas: 'Compra', fornecedores: 'Fornecedor', produtos: 'Produto', perdas: 'Perda',
  lancamentos: 'Lançamento', funcionarios: 'Funcionário', bancos: 'Banco', veiculos: 'Veículo', interacoes: 'Interação',
  usuarios: 'Usuário', configuracoes: 'Configurações',
};
const ACAO_COR: Record<string, string> = { criou: '#17642f', alterou: '#2f6fb0', excluiu: '#b3283d' };

function quando(iso: string) {
  const d = new Date(iso);
  return isNaN(+d) ? iso : d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}
function valorTxt(v: unknown) {
  if (v == null || v === '') return '—';
  if (typeof v === 'object') return JSON.stringify(v).slice(0, 60);
  return String(v).slice(0, 60);
}
function mudancas(antes: Record<string, unknown> | null, depois: Record<string, unknown> | null, acao: string) {
  if (acao !== 'alterou' || !antes || !depois) return '';
  return Object.keys(depois).filter((k) => k !== 'id').slice(0, 6)
    .map((k) => `${k}: ${valorTxt(antes[k])} → ${valorTxt(depois[k])}`).join(' · ');
}

export function Configuracoes({ ui }: { ui: Vals }) {
  const tabs: [string, string][] = [['metas', 'Metas'], ['listas', 'Empresa e listas'], ['usuarios', 'Usuários'], ['historico', 'Histórico'], ['backup', 'Backup']];
  const d = ui.cfgDraft;
  const rodapeSalvar = (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
      {ui.cfgAlterado ? <span style={{ fontSize: '12px', color: '#c79320', fontWeight: 600 }}>Alterações não salvas</span> : null}
      <button onClick={ui.descartarConfig} disabled={!ui.cfgAlterado} style={{ ...btn(false), opacity: ui.cfgAlterado ? 1 : 0.5 }} className="h4">Descartar</button>
      <button onClick={ui.salvarConfig} disabled={!ui.cfgAlterado || ui.salvando} style={{ ...btn(true), opacity: ui.cfgAlterado ? 1 : 0.5 }} className="h5">Salvar configurações</button>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1180px' }}>
      <div style={{ display: 'inline-flex', gap: '4px', background: '#f4f7f1', border: '1px solid #e7ece3', borderRadius: '11px', padding: '4px', alignSelf: 'flex-start', flexWrap: 'wrap' }}>
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => ui.cfgSetTab(k)} style={{ border: 'none', borderRadius: '8px', padding: '8px 15px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif", background: ui.cfgTab === k ? '#1d7a3e' : '#fff', color: ui.cfgTab === k ? '#fff' : '#435349' }}>
            {l}
          </button>
        ))}
      </div>

      {ui.cfgTab === 'metas' ? (
        <>
          <div style={{ fontSize: '12.5px', color: '#66756a' }}>
            Metas e limites usados nas cores (verde / amarelo / vermelho) do painel, das telas e dos relatórios. Valem para todos os usuários.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: '14px' }}>
            {GRUPOS.map((g) => (
              <div key={g.titulo} style={card}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f2a18' }}>{g.titulo}</div>
                <div style={{ fontSize: '12px', color: '#66756a', margin: '2px 0 12px' }}>{g.dica}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {g.campos.map(([k, rot, suf]) => (
                    <div key={k}>
                      <label style={label}>{rot}{suf ? ` (${suf})` : ''}</label>
                      <input type="number" step="any" data-campo={k} value={String(d.metas[k as keyof typeof d.metas] ?? '')} onChange={ui.updateMeta} style={campo} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {rodapeSalvar}
        </>
      ) : null}

      {ui.cfgTab === 'listas' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: '14px' }}>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f2a18', marginBottom: '12px' }}>Empresa</div>
              <label style={label}>Nome exibido no menu</label>
              <input value={d.empresaNome} onChange={ui.updateEmpresa} style={campo} />
            </div>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f2a18' }}>Rotas de entrega</div>
              <div style={{ fontSize: '12px', color: '#66756a', margin: '2px 0 12px' }}>Uma por linha. Aparecem no cadastro do cliente e no relatório por rota.</div>
              <textarea rows={7} value={d.rotasTxt} onChange={ui.updateRotas} style={{ ...campo, resize: 'vertical' }} />
            </div>
          </div>
          {rodapeSalvar}
        </>
      ) : null}

      {ui.cfgTab === 'usuarios' ? (
        <div style={{ ...card, padding: 0, overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: '10px' }}>
            <div style={{ flex: 1, fontSize: '12.5px', color: '#66756a' }}>
              <strong style={{ color: '#16241b' }}>Admin</strong> vê e edita tudo. <strong style={{ color: '#16241b' }}>Funcionário</strong> lança entradas, saídas e perdas e vê o estoque. Para tirar o acesso, desative.
            </div>
            <button onClick={ui.newUsuario} style={btn(true)} className="h5">＋ Novo usuário</button>
          </div>
          <div style={{ minWidth: '700px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 130px 100px 90px', gap: '14px', padding: '10px 20px', borderTop: '1px solid #e7ece3', borderBottom: '1px solid #e7ece3', fontSize: '10.5px', fontWeight: 700, color: '#6b7a6f', letterSpacing: '0.3px' }}>
              <span>NOME</span><span>USUÁRIO</span><span>PERFIL</span><span>SITUAÇÃO</span><span />
            </div>
            {ui.usuarios.map((u) => (
              <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 130px 100px 90px', gap: '14px', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #f3f6f0', fontSize: '13px' }}>
                <span style={{ fontWeight: 600, color: '#0f2a18' }}>{u.nome}{u.voce ? <span style={{ fontWeight: 500, color: '#6b7a6f' }}> (você)</span> : null}</span>
                <span style={{ color: '#435349', fontFamily: 'monospace' }}>{u.usuario}</span>
                <span style={{ color: '#435349' }}>{u.role === 'admin' ? 'Admin' : 'Funcionário'}</span>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: u.ativo ? '#17642f' : '#5f6e63', background: u.ativo ? '#e7f1e8' : '#f0f3ed', padding: '3px 9px', borderRadius: '14px', justifySelf: 'start' }}>{u.ativo ? 'Ativo' : 'Inativo'}</span>
                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={u.edit} style={{ ...btn(false), padding: '6px 11px', fontSize: '12px' }} className="h4">Editar</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {ui.cfgTab === 'historico' ? (
        <div style={{ ...card, padding: 0, overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px', fontSize: '12.5px', color: '#66756a' }}>Quem criou, alterou ou excluiu o quê — os 300 registros mais recentes.</div>
            <select value={ui.histRecurso} onChange={ui.setHistRecurso} style={{ ...campo, width: 'auto' }}>
              <option value="">Tudo</option>
              {Object.entries(RECURSOS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <button onClick={ui.carregarHistorico} style={btn(false)} className="h4">Atualizar</button>
          </div>
          <div style={{ minWidth: '860px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 140px 80px 110px minmax(200px,1fr)', gap: '14px', padding: '10px 20px', borderTop: '1px solid #e7ece3', borderBottom: '1px solid #e7ece3', fontSize: '10.5px', fontWeight: 700, color: '#6b7a6f', letterSpacing: '0.3px' }}>
              <span>QUANDO</span><span>QUEM</span><span>AÇÃO</span><span>O QUÊ</span><span>DETALHE</span>
            </div>
            {ui.auditoria.map((a) => (
              <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '120px 140px 80px 110px minmax(200px,1fr)', gap: '14px', alignItems: 'start', padding: '10px 20px', borderBottom: '1px solid #f3f6f0', fontSize: '12.5px' }}>
                <span style={{ color: '#435349', fontVariantNumeric: 'tabular-nums' }}>{quando(a.quando)}</span>
                <span style={{ fontWeight: 600, color: '#0f2a18' }}>{a.userNome}</span>
                <span style={{ fontWeight: 700, color: ACAO_COR[a.acao] || '#435349' }}>{a.acao}</span>
                <span style={{ color: '#435349' }}>{RECURSOS[a.recurso] || a.recurso} {a.registroId ? <span style={{ color: '#8a5a2a' }}>{a.registroId.startsWith('#') || a.registroId.startsWith('C-') ? a.registroId : '#' + a.registroId}</span> : null}</span>
                <span style={{ color: '#16241b' }}>
                  {a.resumo}
                  {mudancas(a.antes, a.depois, a.acao) ? <div style={{ fontSize: '11.5px', color: '#6b7a6f', marginTop: '2px', wordBreak: 'break-word' }}>{mudancas(a.antes, a.depois, a.acao)}</div> : null}
                </span>
              </div>
            ))}
            {ui.auditoria.length === 0 ? <div style={{ padding: '22px', textAlign: 'center', fontSize: '12.5px', color: '#6b7a6f' }}>Nada registrado ainda.</div> : null}
          </div>
        </div>
      ) : null}

      {ui.cfgTab === 'backup' ? (
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f2a18' }}>Backup completo</div>
          <div style={{ fontSize: '13px', color: '#435349', lineHeight: 1.55 }}>
            Baixa um arquivo <strong>.json</strong> com todos os dados: cadastros, vendas, compras, lançamentos, usuários,
            configurações e histórico. Guarde em local seguro — ele contém dados da empresa e as senhas (criptografadas).
          </div>
          <div><button onClick={ui.baixarBackup} style={btn(true)} className="h5">Baixar backup agora</button></div>
          <div style={{ background: '#f7f4ec', border: '1px solid #ecdcc6', borderRadius: '9px', padding: '10px 13px', fontSize: '12px', color: '#8a5a2a', lineHeight: 1.5 }}>
            Para <strong>restaurar</strong> (substitui todos os dados atuais), com o sistema parado:{' '}
            <code style={{ background: '#fff', padding: '1px 5px', borderRadius: '4px' }}>npm run db -- restore caminho/do/backup.json</code>
          </div>
        </div>
      ) : null}
    </div>
  );
}
