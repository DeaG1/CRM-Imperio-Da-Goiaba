// Não vem do design: contas a receber (vendas) e a pagar (compras e custos) em aberto, por vencimento.
'use client';

import type { CSSProperties } from 'react';
import type { Vals } from '../types';

type Linha = Vals['contasReceber'][number];

const num: CSSProperties = { fontFamily: "'Inter',sans-serif", fontVariantNumeric: 'tabular-nums' };
const COLS = '100px minmax(170px,1.6fr) 96px 130px 120px 96px';

function Tabela({ titulo, sub, linhas, vazio, cor }: { titulo: string; sub: string; linhas: Linha[]; vazio: string; cor: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e7ece3', borderRadius: '13px', overflow: 'auto' }}>
      <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f2a18' }}>{titulo}</h3>
        <span style={{ fontSize: '12px', color: '#66756a' }}>{sub}</span>
      </div>
      <div style={{ minWidth: '760px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: '14px', padding: '10px 20px', borderTop: '1px solid #e7ece3', borderBottom: '1px solid #e7ece3', fontSize: '10.5px', fontWeight: 700, color: '#6b7a6f', letterSpacing: '0.3px' }}>
          <span>DOC.</span><span>QUEM</span><span>VENCE</span><span>SITUAÇÃO</span><span style={{ textAlign: 'right' }}>VALOR</span><span />
        </div>
        {linhas.map((l, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: COLS, gap: '14px', alignItems: 'center', padding: '11px 20px', borderBottom: '1px solid #f3f6f0', fontSize: '13px' }}>
            <span style={{ ...num, fontWeight: 600, color: '#8a5a2a' }}>{l.doc}</span>
            <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.3 }}>
              <span style={{ fontWeight: 600, color: '#0f2a18', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.nome}</span>
              <span style={{ fontSize: '11.5px', color: '#6b7a6f' }}>{l.detalhe}</span>
            </span>
            <span style={{ ...num, color: '#16241b' }}>{l.venc}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: l.prazoColor }}>{l.prazo}</span>
            <span style={{ ...num, textAlign: 'right', fontWeight: 600, color: cor }}>{l.valor}</span>
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={l.baixar} className="h5" style={{ background: '#1d7a3e', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                {l.acao}
              </button>
            </span>
          </div>
        ))}
        {linhas.length === 0 ? (
          <div style={{ padding: '22px', textAlign: 'center', fontSize: '12.5px', color: '#6b7a6f' }}>{vazio}</div>
        ) : null}
      </div>
    </div>
  );
}

export function Contas({ ui }: { ui: Vals }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '1180px' }}>
      <div style={{ fontSize: '12.5px', color: '#66756a' }}>
        Tudo o que está em aberto, do vencimento mais antigo ao mais novo (não depende do período escolhido). Ao{' '}
        <strong style={{ color: '#16241b' }}>receber</strong> ou <strong style={{ color: '#16241b' }}>pagar</strong>, escolha a conta: o
        saldo do banco, o saldo em caixa e o fluxo de caixa se atualizam juntos.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px' }}>
        {ui.contasStats.map((s) => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e7ece3', borderRadius: '13px', padding: '15px 17px' }}>
            <div style={{ fontSize: '12px', color: '#66756a', fontWeight: 600 }}>{s.label}</div>
            <div style={{ ...num, fontWeight: 600, fontSize: '23px', color: s.color, marginTop: '6px' }}>{s.value}</div>
            <div style={{ fontSize: '11.5px', color: '#6b7a6f' }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <Tabela titulo="A receber" sub="vendas entregues ou em andamento ainda não pagas" linhas={ui.contasReceber} vazio="Nenhuma venda em aberto." cor="#17642f" />
      <Tabela titulo="A pagar" sub="compras dos fornecedores e custos (diárias…) ainda não pagos" linhas={ui.contasPagar} vazio="Nenhuma conta em aberto." cor="#b3283d" />
    </div>
  );
}
