// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Entradas({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1280px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ flex: "1", fontSize: "12.5px", color: "#66756a" }}>
            Coletas e compras dos fornecedores · clique numa entrada para editar
          </div>
          <button onClick={ui.newEntrada} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
            <span style={{ fontSize: "16px", lineHeight: "1" }}>
              ＋
            </span>
            {' '}Nova entrada
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "18px" }}>
          {(ui.entradaStats || []).map((s, k0) => (
            <Fragment key={k0}>
              <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "15px 17px" }}>
                <div style={{ fontSize: "12px", color: "#66756a", fontWeight: "600" }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "23px", color: s.color, marginTop: "6px" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "11.5px", color: "#6b7a6f" }}>
                  {s.sub}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1.2fr 1.7fr 0.6fr 0.6fr 0.8fr 0.8fr 0.85fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
            <div>
              ENTRADA
            </div>
            <div>
              FORNECEDOR
            </div>
            <div>
              PRODUTOS
            </div>
            <div style={{ textAlign: "right" }}>
              QTD
            </div>
            <div style={{ textAlign: "right" }}>
              PERDA
            </div>
            <div style={{ textAlign: "right" }}>
              VALOR
            </div>
            <div>
              PAGTO
            </div>
            <div style={{ textAlign: "right" }}>
              AÇÃO
            </div>
          </div>
          {(ui.entradasRows || []).map((e, k0) => (
            <Fragment key={k0}>
              <div onClick={e.edit} style={{ display: "grid", gridTemplateColumns: "0.7fr 1.2fr 1.7fr 0.6fr 0.6fr 0.8fr 0.8fr 0.85fr", gap: "8px", padding: "13px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center", cursor: "pointer" }} className="h6">
                <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#a96b3a", fontWeight: "600" }}>
                  {e.id}
                </div>
                <div style={{ fontWeight: "600", color: "#0f2a18", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {e.fornecedor}
                  <div style={{ fontSize: "11px", color: "#6b7a6f", fontWeight: "400" }}>
                    {e.data}
                  </div>
                </div>
                <div style={{ fontSize: "11.5px", color: "#435349", lineHeight: "1.4" }}>
                  {e.itensTxt}
                  <div style={{ fontSize: "10.5px", color: "#d6334a" }}>
                    {e.motivo}
                  </div>
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                  {e.peso}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: e.perdaColor }}>
                  {e.perda}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600" }}>
                  {e.valor}
                </div>
                <div>
                  <span style={{ fontSize: "11.5px", color: e.pagoColor, background: e.pagoBg, padding: "3px 9px", borderRadius: "14px", fontWeight: "600" }}>
                    {e.pago}
                  </span>
                  <div style={{ fontSize: "10.5px", color: "#6b7a6f", marginTop: "2px" }}>
                    {e.pagInfo}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {e.canPagar ? (
                    <>
                      <button onClick={e.pagar} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "7px", padding: "6px 12px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap", boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }} className="h5">
                        Marcar pago
                      </button>
                    </>
                  ) : null}
                  {e.isPaga ? (
                    <>
                      <span style={{ fontSize: "11px", color: "#a9c2ae", fontWeight: "600", whiteSpace: "nowrap" }}>
                        ✓ pago
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            </Fragment>
          ))}
          {ui.semEntradas ? (
            <>
              <div style={{ padding: "30px 18px", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#2c3a31" }}>
                  Nenhuma entrada lançada
                </div>
                {ui.podeEntrada ? (
                  <>
                    <div style={{ fontSize: "12.5px", color: "#6b7a6f", marginTop: "4px", marginBottom: "16px" }}>
                      Lance a primeira compra do produtor. Ela abastece o estoque e vira a compra de mercadoria no Financeiro.
                    </div>
                    <button onClick={ui.newEntrada} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "10px 20px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
                      ＋ Lançar primeira entrada
                    </button>
                  </>
                ) : null}
                {ui.faltaParaEntrada ? (
                  <>
                    <div style={{ fontSize: "12.5px", color: "#b3283d", marginTop: "6px", background: "#fbe7ea", border: "1px solid #f2c6cd", borderRadius: "9px", padding: "11px 14px", display: "inline-block" }}>
                      Antes de comprar, cadastre {ui.faltaEntradaTxt}.
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
        <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
          A soma das entradas do período vira a{' '}
          <strong style={{ color: "#16241b" }}>
            Compra de mercadoria
          </strong>
          {' '}no Financeiro automaticamente.
        </div>
      </div>
    </>
  );
}
