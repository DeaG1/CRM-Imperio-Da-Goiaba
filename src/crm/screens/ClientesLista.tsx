// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function ClientesLista({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1280px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
          {(ui.statusFilters || []).map((f, k0) => (
            <Fragment key={k0}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "#fff", border: "1px solid #e7ece3", borderRadius: "20px", padding: "6px 13px", fontSize: "12.5px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: f.color }} />
                <span style={{ color: "#2c3a31" }}>
                  {f.label}
                </span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: "#0f2a18" }}>
                  {f.count}
                </span>
              </div>
            </Fragment>
          ))}
          <div style={{ flex: "1" }} />
          <div style={{ fontSize: "12.5px", color: "#66756a" }}>
            Clique numa linha para abrir a ficha
          </div>
          <button onClick={ui.newCliente} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
            <span style={{ fontSize: "16px", lineHeight: "1" }}>
              ＋
            </span>
            {' '}Novo cliente
          </button>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 0.9fr 0.9fr 0.7fr 0.8fr 0.9fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
            <div>
              ESTABELECIMENTO
            </div>
            <div>
              ROTA
            </div>
            <div style={{ textAlign: "right" }}>
              TICKET/MÊS
            </div>
            <div style={{ textAlign: "right" }}>
              /ENTREGA
            </div>
            <div style={{ textAlign: "right" }}>
              % FAT
            </div>
            <div style={{ textAlign: "right" }}>
              INADIMP.
            </div>
            <div style={{ textAlign: "right" }}>
              SAÚDE
            </div>
          </div>
          {(ui.clientes || []).map((c, k0) => (
            <Fragment key={k0}>
              <div onClick={c.open} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 0.9fr 0.9fr 0.7fr 0.8fr 0.9fr", gap: "8px", padding: "13px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "13px", cursor: "pointer", alignItems: "center" }} className="h6">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "0" }}>
                  <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: c.healthColor, flex: "0 0 9px" }} />
                  <div style={{ minWidth: "0" }}>
                    <div style={{ fontWeight: "600", color: "#0f2a18", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.nome}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#6b7a6f" }}>
                      {c.resp} · {c.statusLabel}
                    </div>
                  </div>
                </div>
                <div style={{ color: "#435349" }}>
                  {c.rota}
                  <div style={{ fontSize: "11px", color: "#6b7a6f" }}>
                    {c.freq}
                  </div>
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b" }}>
                  {c.ticketMes}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: c.entregaColor }}>
                  {c.ticketEntrega}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b" }}>
                  {c.part}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: c.inadColor }}>
                  {c.inad}
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "12px", fontWeight: "600", color: c.healthColor, background: c.healthBg, padding: "3px 9px", borderRadius: "20px" }}>
                    {c.tend} {c.healthLabel}
                  </span>
                </div>
              </div>
            </Fragment>
          ))}
          {ui.semClientes ? (
            <>
              <div style={{ padding: "30px 18px", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#2c3a31" }}>
                  Nenhum cliente cadastrado
                </div>
                <div style={{ fontSize: "12.5px", color: "#6b7a6f", marginTop: "4px", marginBottom: "16px" }}>
                  Cadastre os minimercados que você atende. Sem cliente não é possível lançar uma saída (venda).
                </div>
                <button onClick={ui.newCliente} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "10px 20px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
                  ＋ Cadastrar primeiro cliente
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
