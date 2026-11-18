// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Topbar({ ui }: { ui: Vals }) {
  return (
    <>
      <header style={{ flex: "0 0 auto", padding: "18px 30px", background: "#ffffff", borderBottom: "1px solid #e7ece3", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ flex: "1", minWidth: "0" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: "700", fontSize: "21px", letterSpacing: "-0.4px", color: "#0f2a18" }}>
            {ui.screenTitle}
          </div>
          <div style={{ fontSize: "13px", color: "#66756a", marginTop: "1px" }}>
            {ui.screenSub}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "1px solid #e7ece3", borderRadius: "9px", padding: "5px 10px 5px 13px" }}>
            <span style={{ fontSize: "12px", color: "#66756a" }}>
              Período
            </span>
            <select value={ui.periodo ?? ''} onChange={ui.setPeriodo} style={{ border: "none", background: "transparent", fontWeight: "700", fontSize: "13px", color: "#16241b", fontFamily: "'Inter',sans-serif", cursor: "pointer", outline: "none" }}>
              {(ui.periodOptions || []).map((o, k0) => (
                <Fragment key={k0}>
                  <option value={o.v}>
                    {o.l}
                  </option>
                </Fragment>
              ))}
            </select>
          </div>
          {ui.isAdmin ? (
            <>
              <div style={{ position: "relative" }}>
                <button onClick={ui.toggleCaixa} title="Ver saldo por banco" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", background: "#eef6ef", border: `1px solid ${ui.caixaBorder}`, borderRadius: "9px", padding: "6px 14px", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h3">
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "#7d9c86", fontWeight: "600", letterSpacing: "0.3px" }}>
                    SALDO EM CAIXA{' '}
                    <span style={{ fontSize: "9px" }}>
                      {ui.caixaSeta}
                    </span>
                  </span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "15px", color: ui.saldoCaixaColor }}>
                    {ui.saldoCaixa}
                  </span>
                </button>
                {ui.caixaOpen ? (
                  <>
                    <div onClick={ui.closeCaixa} style={{ position: "fixed", inset: "0", zIndex: "40" }} />
                    <div style={{ position: "absolute", right: "0", top: "calc(100% + 8px)", zIndex: "41", width: "340px", background: "#fff", border: "1px solid #e7ece3", borderRadius: "12px", boxShadow: "0 12px 32px rgba(15,42,24,0.14)", overflow: "hidden" }}>
                      <div style={{ padding: "12px 16px 8px", fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                        SALDO POR BANCO
                      </div>
                      {(ui.caixaBancos || []).map((c, k0) => (
                        <Fragment key={k0}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "9px 16px", borderTop: "1px solid #f3f6f0" }}>
                            <div style={{ display: "flex", flexDirection: "column", minWidth: "0", lineHeight: "1.3" }}>
                              <span style={{ fontSize: "13px", fontWeight: "600", color: c.nomeColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {c.nome}
                              </span>
                              <span style={{ fontSize: "11.5px", color: "#6b7a6f" }}>
                                {c.apelido}
                              </span>
                            </div>
                            <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", fontWeight: "600", color: c.color, whiteSpace: "nowrap" }}>
                              {c.saldo}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "11px 16px", background: "#f4f7f1", borderTop: "1px solid #e7ece3" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f2a18" }}>
                          Total em caixa
                        </span>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "14px", fontWeight: "700", color: ui.saldoCaixaColor }}>
                          {ui.saldoCaixa}
                        </span>
                      </div>
                      <button onClick={ui.goBancos} style={{ width: "100%", padding: "10px 16px", border: "none", borderTop: "1px solid #e7ece3", background: "#fff", color: "#1d7a3e", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", textAlign: "left", fontFamily: "'Inter',sans-serif" }} className="h4">
                        Gerenciar bancos →
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </header>
    </>
  );
}
