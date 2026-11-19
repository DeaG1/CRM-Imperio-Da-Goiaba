// Baseado no design (Imperio da Goiaba CRM v2.dc.html) e mantido à mão: saldo = saldo inicial + recebimentos − pagamentos.
'use client';

import { Fragment, type CSSProperties } from 'react';
import type { Vals } from '../types';

const COLS = 'minmax(180px,1.6fr) minmax(150px,1fr) 140px 130px 130px 100px 80px';
const num: CSSProperties = { textAlign: 'right', fontFamily: "'Inter',sans-serif", fontVariantNumeric: 'tabular-nums' };
const linha: CSSProperties = { display: 'grid', gridTemplateColumns: COLS, gap: '14px', alignItems: 'center', padding: '13px 20px', fontSize: '13px' };

export function Bancos({ ui }: { ui: Vals }) {
  return (
    <div style={{ maxWidth: '1180px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '240px', fontSize: '12.5px', color: '#66756a' }}>
          Saldo de cada conta = saldo inicial + <strong style={{ color: '#16241b' }}>recebimentos</strong> −{' '}
          <strong style={{ color: '#16241b' }}>pagamentos</strong> (vendas, compras e custos baixados nela) · o total vai
          para o <strong style={{ color: '#16241b' }}>saldo em caixa</strong> do topo · movimento de{' '}
          <strong style={{ color: '#16241b' }}>{ui.periodLabel}</strong>
        </div>
        <button onClick={ui.newBanco} className="h5" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#1d7a3e', color: '#fff', border: 'none', borderRadius: '9px', padding: '9px 15px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
          <span style={{ fontSize: '16px', lineHeight: '1' }}>＋</span> Novo banco
        </button>
      </div>
      <div style={{ background: '#fff', border: '1px solid #e7ece3', borderRadius: '13px', overflow: 'auto' }}>
        <div style={{ minWidth: '980px' }}>
          <div style={{ ...linha, padding: '12px 20px', borderBottom: '1px solid #e7ece3', fontSize: '10.5px', fontWeight: 700, color: '#6b7a6f', letterSpacing: '0.3px' }}>
            <span>CONTA</span>
            <span>APELIDO</span>
            <span style={{ textAlign: 'right' }}>SALDO ATUAL</span>
            <span style={{ textAlign: 'right' }}>ENTROU NO PERÍODO</span>
            <span style={{ textAlign: 'right' }}>SAIU NO PERÍODO</span>
            <span style={{ textAlign: 'right' }}>MOVIMENTOS</span>
            <span />
          </div>
          {(ui.bancoRows || []).map((b, k0) => (
            <Fragment key={k0}>
              <div className="h4" style={{ ...linha, borderBottom: '1px solid #f3f6f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <span style={{ fontWeight: 600, color: '#0f2a18' }}>{b.nome}</span>
                  {b.inativo ? (
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#5f6e63', background: '#f0f3ed', padding: '2px 8px', borderRadius: '12px' }}>Inativo</span>
                  ) : null}
                </div>
                <span style={{ color: '#435349' }}>{b.apelido}</span>
                <span style={{ ...num, fontWeight: 600, color: b.saldoColor }}>{b.saldo}</span>
                <span style={{ ...num, color: '#17642f' }}>{b.entradas}</span>
                <span style={{ ...num, color: '#b3283d' }}>{b.saidas}</span>
                <span style={{ ...num, color: '#16241b' }}>{b.qtd}</span>
                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={b.edit} className="h4" style={{ background: '#fff', color: '#2c3a31', border: '1px solid #d3dbcf', borderRadius: '8px', padding: '6px 11px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                    Editar
                  </button>
                </span>
              </div>
            </Fragment>
          ))}
          <div style={{ ...linha, color: '#5a6a5f' }}>
            <span style={{ fontWeight: 600 }}>Caixa (dinheiro)</span>
            <span style={{ fontSize: '12px' }}>recebimentos e pagamentos sem banco</span>
            <span style={{ ...num, fontWeight: 600, color: ui.semBancoSaldoColor }}>{ui.semBancoSaldo}</span>
            <span style={{ ...num, color: '#17642f' }}>{ui.semBancoEntradas}</span>
            <span style={{ ...num, color: '#b3283d' }}>{ui.semBancoSaidas}</span>
            <span style={num}>{ui.semBancoQtd}</span>
            <span />
          </div>
          <div style={{ ...linha, padding: '14px 20px', background: '#f4f7f1', borderTop: '1px solid #e7ece3' }}>
            <span style={{ fontWeight: 700, color: '#0f2a18' }}>Total em caixa</span>
            <span />
            <span style={{ ...num, fontWeight: 700, fontSize: '14px', color: ui.saldoCaixaColor }}>{ui.saldoCaixa}</span>
            <span /><span /><span /><span />
          </div>
        </div>
      </div>
    </div>
  );
}
