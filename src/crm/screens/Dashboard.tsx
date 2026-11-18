// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Dashboard({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "1280px" }}>
        {ui.guiaAberto ? (
          <>
            <div style={{ background: "#fff", border: "1px solid #e7ece3", borderLeft: "5px solid #c79320", borderRadius: "13px", padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                <div style={{ flex: "1" }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: "700", fontSize: "16px", color: "#0f2a18" }}>
                    {ui.guiaTitulo}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#66756a", marginTop: "2px" }}>
                    {ui.guiaSub}
                  </div>
                </div>
                <div style={{ textAlign: "right", flex: "0 0 auto" }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", fontWeight: "600", color: "#c79320" }}>
                    {ui.guiaProgresso}
                  </div>
                  <div style={{ width: "90px", height: "6px", background: "#eef2ea", borderRadius: "6px", marginTop: "5px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: ui.guiaBarra, background: "#c79320", borderRadius: "6px" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {(ui.passosRows || []).map((p, k0) => (
                  <Fragment key={k0}>
                    <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "9px 0", borderBottom: "1px solid #f4f7f1" }}>
                      <span style={{ width: "24px", height: "24px", flex: "0 0 24px", borderRadius: "50%", background: p.markBg, color: p.markFg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700" }}>
                        {p.mark}
                      </span>
                      <div style={{ flex: "1", minWidth: "0" }}>
                        <div style={{ fontSize: "13.5px", fontWeight: "600", color: p.labelColor }}>
                          {p.label}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "#6b7a6f" }}>
                          {p.hint}
                        </div>
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#a9c2ae", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                        {p.countTxt}
                      </div>
                      {p.showCta ? (
                        <>
                          <button onClick={p.go} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "8px", padding: "7px 14px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h5">
                            {p.cta}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </>
        ) : null}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
          {(ui.statCards || []).map((s, k0) => (
            <Fragment key={k0}>
              <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "16px 18px" }}>
                <div style={{ fontSize: "12px", color: "#66756a", fontWeight: "600" }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "26px", color: "#0f2a18", marginTop: "7px", letterSpacing: "-0.5px" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "12px", marginTop: "4px", color: s.deltaColor, fontWeight: "600" }}>
                  {s.delta}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "12px" }}>
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", fontWeight: "700", color: "#0f2a18", margin: "0" }}>
              Painel de indicadores
            </h2>
            <span style={{ fontSize: "12px", color: "#66756a" }}>
              9 KPIs do estudo · meta vs. realizado
            </span>
            <div style={{ flex: "1" }} />
            <div style={{ display: "flex", gap: "14px", fontSize: "11px", color: "#66756a" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: "#2e8b4a" }} />
                Na meta
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: "#c79320" }} />
                Atenção
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: "#d6334a" }} />
                Fora da meta
              </span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
            {(ui.kpis || []).map((k, k0) => (
              <Fragment key={k0}>
                <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "15px 16px", borderTop: `3px solid ${k.color}` }}>
                  <div style={{ fontSize: "12px", color: "#4f5e54", fontWeight: "600", minHeight: "32px", lineHeight: "1.25" }}>
                    {k.label}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "7px", marginTop: "8px" }}>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "23px", color: k.color, letterSpacing: "-0.5px" }}>
                      {k.real}
                    </span>
                  </div>
                  <div style={{ height: "6px", background: "#eef2ea", borderRadius: "6px", marginTop: "9px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: k.pct, background: k.color, borderRadius: "6px" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7px", fontSize: "11px", color: "#6b7a6f" }}>
                    <span>
                      meta {k.meta}
                    </span>
                    <span style={{ color: k.color, fontWeight: "600" }}>
                      {k.tag}
                    </span>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}>
          <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: "700", color: "#0f2a18", margin: "0" }}>
                Concentração de carteira
              </h3>
              <span style={{ fontSize: "12px", color: "#d6334a", fontWeight: "600" }}>
                {ui.top5Txt}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", marginTop: "3px", marginBottom: "16px" }}>
              Risco de dependência — alvo: nenhum cliente acima de 15%.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
              {(ui.carteira || []).map((c, k0) => (
                <Fragment key={k0}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "150px", flex: "0 0 150px", fontSize: "13px", color: "#16241b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.nome}
                    </div>
                    <div style={{ flex: "1", height: "18px", background: "#f3f6f0", borderRadius: "5px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: c.bar, background: c.color, borderRadius: "5px" }} />
                    </div>
                    <div style={{ width: "42px", textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", fontWeight: "600", color: "#16241b" }}>
                      {c.pct}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}>
          <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: "700", color: "#0f2a18", margin: "0 0 3px" }}>
              Cenário realizado vs. projeções
            </h3>
            <div style={{ fontSize: "12px", color: "#66756a", marginBottom: "16px" }}>
              Lucro líquido operacional — onde a operação está performando.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {(ui.cenarios || []).map((c, k0) => (
                <Fragment key={k0}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "88px", flex: "0 0 88px", fontSize: "13px", color: "#16241b", fontWeight: c.weight }}>
                      {c.nome}
                    </div>
                    <div style={{ flex: "1", height: "24px", background: "#f3f6f0", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                      <div style={{ height: "100%", width: c.bar, background: c.color, borderRadius: "6px" }} />
                    </div>
                    <div style={{ width: "96px", textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", fontWeight: "600", color: c.txtColor }}>
                      {c.valor}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ marginTop: "14px", fontSize: "12px", color: "#2e8b4a", background: "#e7f1e8", borderRadius: "9px", padding: "9px 12px" }}>
              ● {ui.realizadoTxt}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
