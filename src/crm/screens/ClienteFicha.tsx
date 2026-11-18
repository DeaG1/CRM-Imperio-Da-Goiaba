// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function ClienteFicha({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1180px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <button onClick={ui.backToList} style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#fff", border: "1px solid #e7ece3", borderRadius: "8px", padding: "7px 13px", fontSize: "13px", color: "#2c3a31", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h4">
            ← Voltar para lista
          </button>
          <div style={{ flex: "1" }} />
          <button onClick={ui.editCurrentCliente} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
            Editar cliente
          </button>
          <button onClick={ui.deleteCurrentCliente} style={{ background: "#fff", color: "#d6334a", border: "1px solid #f2c6cd", borderRadius: "8px", padding: "8px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h7">
            Excluir
          </button>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "14px", padding: "22px 24px", display: "flex", gap: "20px", alignItems: "center", marginBottom: "16px", borderLeft: `5px solid ${ui.sel.healthColor}` }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "14px", background: "#eef6ef", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", fontWeight: "800", fontSize: "22px", color: "#1d7a3e", flex: "0 0 60px" }}>
            {ui.sel.initials}
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: "700", fontSize: "22px", color: "#0f2a18" }}>
              {ui.sel.nome}
            </div>
            <div style={{ fontSize: "13px", color: "#66756a", marginTop: "2px" }}>
              {ui.sel.resp} · {ui.sel.cnpj} · {ui.sel.tel}
            </div>
            <div style={{ fontSize: "13px", color: "#66756a" }}>
              {ui.sel.endereco}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#66756a", fontWeight: "600" }}>
              HEALTH SCORE
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: ui.sel.healthBg, color: ui.sel.healthColor, padding: "8px 16px", borderRadius: "24px", marginTop: "6px", fontWeight: "700", fontSize: "15px" }}>
              <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: ui.sel.healthColor }} />
              {ui.sel.healthFull}
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", marginTop: "6px" }}>
              {ui.sel.statusLabel}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {ui.isAdmin ? (
              <>
                <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: "700", color: "#0f2a18", margin: "0 0 14px" }}>
                    Métricas comerciais
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
                    {(ui.sel.metricas || []).map((m, k0) => (
                      <Fragment key={k0}>
                        <div>
                          <div style={{ fontSize: "11.5px", color: "#66756a" }}>
                            {m.label}
                          </div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "18px", color: m.color, marginTop: "3px" }}>
                            {m.value}
                          </div>
                          <div style={{ fontSize: "11px", color: "#6b7a6f" }}>
                            {m.sub}
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: "700", color: "#0f2a18", margin: "0 0 12px" }}>
                Pedidos recentes
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {(ui.sel.pedidos || []).map((p, k0) => (
                  <Fragment key={k0}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #f3f6f0", fontSize: "13px" }}>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#66756a", width: "64px" }}>
                        {p.id}
                      </div>
                      <div style={{ width: "60px", color: "#435349" }}>
                        {p.data}
                      </div>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", width: "62px", color: "#16241b" }}>
                        {p.peso}
                      </div>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", flex: "1", color: "#16241b", fontWeight: "600" }}>
                        {p.valor}
                      </div>
                      <div>
                        <span style={{ fontSize: "11.5px", color: p.statusColor, background: p.statusBg, padding: "3px 9px", borderRadius: "14px", fontWeight: "600" }}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: "700", color: "#0f2a18", margin: "0 0 14px" }}>
                Histórico de interações
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {(ui.sel.interacoes || []).map((i, k0) => (
                  <Fragment key={k0}>
                    <div style={{ display: "flex", gap: "13px", paddingBottom: "16px", position: "relative" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: i.color, marginTop: "4px" }} />
                        <span style={{ flex: "1", width: "2px", background: "#eef2ea", marginTop: "3px" }} />
                      </div>
                      <div style={{ flex: "1" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                          <span style={{ fontWeight: "600", fontSize: "13px", color: "#0f2a18" }}>
                            {i.tipo}
                          </span>
                          <span style={{ fontSize: "11.5px", color: "#6b7a6f" }}>
                            {i.data} · {i.por}
                          </span>
                        </div>
                        <div style={{ fontSize: "12.5px", color: "#4f5e54", marginTop: "2px" }}>
                          {i.texto}
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: "700", color: "#0f2a18", margin: "0 0 14px" }}>
                Cadastro & rota
              </h3>
              {(ui.sel.cadastro || []).map((r, k0) => (
                <Fragment key={k0}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f4f7f1", fontSize: "13px" }}>
                    <span style={{ color: "#66756a" }}>
                      {r.k}
                    </span>
                    <span style={{ color: "#16241b", fontWeight: "500", textAlign: "right" }}>
                      {r.v}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            {ui.isAdmin ? (
              <>
                <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: "700", color: "#0f2a18", margin: "0 0 14px" }}>
                    Crédito & inadimplência
                  </h3>
                  {(ui.sel.credito || []).map((r, k0) => (
                    <Fragment key={k0}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f4f7f1", fontSize: "13px" }}>
                        <span style={{ color: "#66756a" }}>
                          {r.k}
                        </span>
                        <span style={{ color: r.color, fontWeight: "600", textAlign: "right" }}>
                          {r.v}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </>
            ) : null}
            <div style={{ background: "#fbfcf9", border: "1px solid #ece2c8", borderRadius: "13px", padding: "18px 20px" }}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "700", color: "#8a6d2a", margin: "0 0 8px" }}>
                Observações do vendedor
              </h3>
              <div style={{ fontSize: "13px", color: "#6a5a32", lineHeight: "1.5", fontStyle: "italic" }}>
                "{ui.sel.obs}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
