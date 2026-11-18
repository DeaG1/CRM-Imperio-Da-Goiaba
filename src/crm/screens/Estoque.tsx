// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Estoque({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "18px" }}>
          {(ui.estoqueStats || []).map((s, k0) => (
            <Fragment key={k0}>
              <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "15px 17px" }}>
                <div style={{ fontSize: "12px", color: "#66756a", fontWeight: "600" }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "23px", color: "#0f2a18", marginTop: "6px" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.8fr 0.8fr 0.8fr 0.8fr 0.9fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
            <div>
              PRODUTO
            </div>
            <div>
              UNIDADE
            </div>
            <div style={{ textAlign: "right" }}>
              ENTROU
            </div>
            <div style={{ textAlign: "right" }}>
              PERDAS
            </div>
            <div style={{ textAlign: "right" }}>
              SAIU
            </div>
            <div style={{ textAlign: "right" }}>
              EM ESTOQUE
            </div>
          </div>
          {(ui.estoqueRows || []).map((r, k0) => (
            <Fragment key={k0}>
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.8fr 0.8fr 0.8fr 0.8fr 0.9fr", gap: "8px", padding: "13px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center" }}>
                <div style={{ fontWeight: "600", color: "#0f2a18" }}>
                  {r.nome}
                </div>
                <div>
                  <span style={{ fontSize: "11.5px", background: "#eef6ef", color: "#17642f", padding: "3px 10px", borderRadius: "14px" }}>
                    {r.un}
                  </span>
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                  {r.entrou}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#b3283d" }}>
                  {r.perda}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                  {r.saiu}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: r.saldoColor }}>
                  {r.saldo}
                </div>
              </div>
            </Fragment>
          ))}
          {ui.noEstoque ? (
            <>
              <div style={{ padding: "26px 18px", textAlign: "center" }}>
                <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#2c3a31" }}>
                  Nada em estoque ainda
                </div>
                <div style={{ fontSize: "12.5px", color: "#6b7a6f", marginTop: "4px", marginBottom: "14px" }}>
                  O estoque se preenche sozinho: lance uma{' '}
                  <strong>
                    Entrada (compra)
                  </strong>
                  {' '}e a quantidade aparece aqui.
                </div>
                <button onClick={ui.newEntrada} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
                  ＋ Lançar entrada
                </button>
              </div>
            </>
          ) : null}
        </div>
        <div style={{ fontSize: "12px", color: "#66756a", margin: "12px 0 20px" }}>
          Estoque ={' '}
          <strong style={{ color: "#16241b" }}>
            entradas − perdas − saídas
          </strong>
          , somado por produto e unidade (KG, CX, bandeja…).
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div style={{ flex: "1" }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: "700", fontSize: "15px", color: "#0f2a18" }}>
              Perdas no depósito
            </div>
            <div style={{ fontSize: "12px", color: "#66756a" }}>
              Mercadoria que estragou depois da compra — desconta do estoque e entra no índice de perdas.
            </div>
          </div>
          <button onClick={ui.newPerda} style={{ background: "#a96b3a", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h9">
            ＋ Registrar perda
          </button>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr 0.7fr 0.6fr 1fr 1.4fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
            <div>
              DATA
            </div>
            <div>
              PRODUTO
            </div>
            <div>
              UNIDADE
            </div>
            <div style={{ textAlign: "right" }}>
              QTD
            </div>
            <div>
              MOTIVO
            </div>
            <div>
              OBSERVAÇÃO
            </div>
          </div>
          {(ui.perdasRows || []).map((pe, k0) => (
            <Fragment key={k0}>
              <div onClick={pe.edit} style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr 0.7fr 0.6fr 1fr 1.4fr", gap: "8px", padding: "13px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center", cursor: "pointer" }} className="h6">
                <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                  {pe.data}
                </div>
                <div style={{ fontWeight: "600", color: "#0f2a18" }}>
                  {pe.nome}
                </div>
                <div>
                  <span style={{ fontSize: "11.5px", background: "#eef6ef", color: "#17642f", padding: "3px 10px", borderRadius: "14px" }}>
                    {pe.un}
                  </span>
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#b3283d", fontWeight: "600" }}>
                  {pe.qtd}
                </div>
                <div style={{ color: "#435349" }}>
                  {pe.motivo}
                </div>
                <div style={{ color: "#66756a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {pe.obs}
                </div>
              </div>
            </Fragment>
          ))}
          {ui.noPerdas ? (
            <>
              <div style={{ padding: "20px 18px", textAlign: "center", fontSize: "12.5px", color: "#6b7a6f" }}>
                Nenhuma perda de depósito no período. Registre aqui o que estragou{' '}
                <strong>
                  depois
                </strong>
                {' '}da compra (a perda da coleta vai na própria entrada).
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
