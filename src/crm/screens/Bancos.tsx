// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Bancos({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1180px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "240px", fontSize: "12.5px", color: "#66756a" }}>
            Saldo de cada conta = saldo inicial − custos lançados nela · o total vai para o{' '}
            <strong style={{ color: "#16241b" }}>
              saldo em caixa
            </strong>
            {' '}do topo · saídas de{' '}
            <strong style={{ color: "#16241b" }}>
              {ui.periodLabel}
            </strong>
          </div>
          <button onClick={ui.newBanco} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
            <span style={{ fontSize: "16px", lineHeight: "1" }}>
              ＋
            </span>
            {' '}Novo banco
          </button>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", overflow: "auto" }}>
          <div style={{ minWidth: "900px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(180px,1.6fr) minmax(160px,1fr) 140px 140px 110px 80px", gap: "14px", padding: "12px 20px", borderBottom: "1px solid #e7ece3", fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
              <span>
                BANCO
              </span>
              <span>
                APELIDO
              </span>
              <span style={{ textAlign: "right" }}>
                SALDO ATUAL
              </span>
              <span style={{ textAlign: "right" }}>
                SAÍDAS NO PERÍODO
              </span>
              <span style={{ textAlign: "right" }}>
                LANÇAMENTOS
              </span>
              <span />
            </div>
            {(ui.bancoRows || []).map((b, k0) => (
              <Fragment key={k0}>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(180px,1.6fr) minmax(160px,1fr) 140px 140px 110px 80px", gap: "14px", alignItems: "center", padding: "13px 20px", borderBottom: "1px solid #f3f6f0", fontSize: "13px" }} className="h4">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "0" }}>
                    <div style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                      <span style={{ fontWeight: "600", color: "#0f2a18" }}>
                        {b.nome}
                      </span>
                    </div>
                    {b.inativo ? (
                      <>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#5f6e63", background: "#f0f3ed", padding: "2px 8px", borderRadius: "12px" }}>
                          Inativo
                        </span>
                      </>
                    ) : null}
                  </div>
                  <span style={{ color: "#435349" }}>
                    {b.apelido}
                  </span>
                  <span style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: b.saldoColor }}>
                    {b.saldo}
                  </span>
                  <span style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#b3283d" }}>
                    {b.saidas}
                  </span>
                  <span style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b" }}>
                    {b.qtd}
                  </span>
                  <span style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={b.edit} style={{ background: "#fff", color: "#2c3a31", border: "1px solid #d3dbcf", borderRadius: "8px", padding: "6px 11px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h4">
                      Editar
                    </button>
                  </span>
                </div>
              </Fragment>
            ))}
            {ui.semBancoRow ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(180px,1.6fr) minmax(160px,1fr) 140px 140px 110px 80px", gap: "14px", alignItems: "center", padding: "13px 20px", fontSize: "13px", color: "#6b7a6f" }}>
                  <span>
                    Sem banco informado
                  </span>
                  <span style={{ fontSize: "12px" }}>
                    vendas, compras e custos sem banco
                  </span>
                  <span style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: ui.semBancoSaldoColor }}>
                    {ui.semBancoSaldo}
                  </span>
                  <span style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600" }}>
                    {ui.semBancoSaidas}
                  </span>
                  <span style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                    {ui.semBancoQtd}
                  </span>
                  <span />
                </div>
              </>
            ) : null}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(180px,1.6fr) minmax(160px,1fr) 140px 140px 110px 80px", gap: "14px", alignItems: "center", padding: "14px 20px", background: "#f4f7f1", borderTop: "1px solid #e7ece3", fontSize: "13px" }}>
              <span style={{ fontWeight: "700", color: "#0f2a18" }}>
                Total em caixa
              </span>
              <span />
              <span style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", fontSize: "14px", color: ui.saldoCaixaColor }}>
                {ui.saldoCaixa}
              </span>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
