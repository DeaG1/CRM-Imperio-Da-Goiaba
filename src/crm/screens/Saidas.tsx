// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Saidas({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1320px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ flex: "1", fontSize: "12.5px", color: "#66756a" }}>
            Clique num pedido para editar
          </div>
          <button onClick={ui.newPedido} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
            <span style={{ fontSize: "16px", lineHeight: "1" }}>
              ＋
            </span>
            {' '}Novo pedido
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "18px" }}>
          {(ui.pedidoStats || []).map((s, k0) => (
            <Fragment key={k0}>
              <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "15px 17px" }}>
                <div style={{ fontSize: "12px", color: "#66756a", fontWeight: "600" }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "23px", color: "#0f2a18", marginTop: "6px" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "11.5px", color: s.color, marginTop: "2px" }}>
                  {s.sub}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1.2fr 1.7fr 0.6fr 0.6fr 0.7fr 0.85fr 0.85fr 0.5fr 0.85fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
            <div>
              PEDIDO
            </div>
            <div>
              CLIENTE
            </div>
            <div>
              PRODUTOS
            </div>
            <div>
              ENTREGA
            </div>
            <div style={{ textAlign: "right" }}>
              QTD
            </div>
            <div style={{ textAlign: "right" }}>
              VALOR
            </div>
            <div>
              STATUS
            </div>
            <div>
              PAGAMENTO
            </div>
            <div style={{ textAlign: "right" }}>
              RECEB.
            </div>
            <div style={{ textAlign: "right" }}>
              AÇÃO
            </div>
          </div>
          {(ui.pedidos || []).map((p, k0) => (
            <Fragment key={k0}>
              <div onClick={p.edit} style={{ display: "grid", gridTemplateColumns: "0.7fr 1.2fr 1.7fr 0.6fr 0.6fr 0.7fr 0.85fr 0.85fr 0.5fr 0.85fr", gap: "8px", padding: "13px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center", cursor: "pointer" }} className="h6">
                <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#1d7a3e", fontWeight: "600" }}>
                  {p.id}
                </div>
                <div style={{ fontWeight: "600", color: "#0f2a18", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.cliente}
                  <div style={{ fontSize: "11px", color: "#6b7a6f", fontWeight: "400" }}>
                    {p.rota}
                  </div>
                </div>
                <div style={{ fontSize: "11.5px", color: "#435349", lineHeight: "1.4" }}>
                  {p.itensTxt}
                </div>
                <div style={{ color: "#435349" }}>
                  {p.entrega}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                  {p.peso}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600" }}>
                  {p.valor}
                </div>
                <div>
                  <span style={{ fontSize: "11.5px", color: p.statusColor, background: p.statusBg, padding: "3px 9px", borderRadius: "14px", fontWeight: "600" }}>
                    {p.status}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "11.5px", color: p.pagColor, background: p.pagBg, padding: "3px 9px", borderRadius: "14px", fontWeight: "600" }}>
                    {p.pag}
                  </span>
                  <div style={{ fontSize: "10.5px", color: "#6b7a6f", marginTop: "2px" }}>
                    {p.pagInfo}
                  </div>
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: p.recebColor }}>
                  {p.receb}
                </div>
                <div style={{ textAlign: "right" }}>
                  {p.canMarkPago ? (
                    <>
                      <button onClick={p.markPago} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "7px", padding: "6px 12px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap", boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }} className="h5">
                        Marcar pago
                      </button>
                    </>
                  ) : null}
                  {p.isPago ? (
                    <>
                      <span style={{ fontSize: "11px", color: "#a9c2ae", fontWeight: "600", whiteSpace: "nowrap" }}>
                        ✓ registrado
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            </Fragment>
          ))}
          {ui.semSaidas ? (
            <>
              <div style={{ padding: "30px 18px", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#2c3a31" }}>
                  Nenhuma saída lançada
                </div>
                {ui.podeSaida ? (
                  <>
                    <div style={{ fontSize: "12.5px", color: "#6b7a6f", marginTop: "4px", marginBottom: "16px" }}>
                      Lance a primeira venda entregue a um minimercado. Ela alimenta faturamento, ticket médio e estoque.
                    </div>
                    <button onClick={ui.newPedido} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "10px 20px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
                      ＋ Lançar primeira saída
                    </button>
                  </>
                ) : null}
                {ui.faltaParaSaida ? (
                  <>
                    <div style={{ fontSize: "12.5px", color: "#b3283d", marginTop: "6px", background: "#fbe7ea", border: "1px solid #f2c6cd", borderRadius: "9px", padding: "11px 14px", display: "inline-block" }}>
                      Antes de vender, cadastre {ui.faltaSaidaTxt}.
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
