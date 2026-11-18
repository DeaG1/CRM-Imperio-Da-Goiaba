// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Financeiro({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1180px", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "16px" }}>
        <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px", gap: "12px" }}>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", fontWeight: "700", color: "#0f2a18", margin: "0" }}>
              Resultado — {ui.periodLabel}
            </h3>
            <button onClick={ui.newLancamento} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h5">
              ＋ Novo lançamento
            </button>
          </div>
          <div style={{ fontSize: "12px", color: "#66756a", marginBottom: "18px" }}>
            Receita vem dos pedidos entregues; a compra, das entradas; os demais custos você lança por categoria.
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "2px solid #e7ece3" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f2a18" }}>
              Receita bruta
            </span>
            <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "16px", fontWeight: "700", color: "#0f2a18" }}>
              {ui.finReceita}
            </span>
          </div>
          <div style={{ fontSize: "11px", color: "#6b7a6f", padding: "5px 0 10px" }}>
            {ui.finReceitaSub}
          </div>
          {(ui.finCustos || []).map((c, k0) => (
            <Fragment key={k0}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #f3f6f0" }}>
                <span style={{ fontSize: "13.5px", color: "#4f5e54" }}>
                  (–) {c.label}
                </span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "14px", color: "#b3283d" }}>
                  ({c.value})
                </span>
              </div>
            </Fragment>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #f3f6f0" }}>
            <span style={{ fontSize: "13px", color: "#66756a" }}>
              = Total de custos
            </span>
            <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "14px", color: "#4f5e54" }}>
              {ui.finCustoTotal}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 14px", marginTop: "12px", background: "#eef6ef", border: "1px solid #cfe3d3", borderRadius: "10px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#17642f" }}>
                Lucro líquido
              </div>
              <div style={{ fontSize: "11.5px", color: "#1d7a3e" }}>
                {ui.finPctTxt}
              </div>
            </div>
            <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "20px", fontWeight: "700", color: ui.finLucroColor }}>
              {ui.finLucro}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: "700", color: "#0f2a18", margin: "0" }}>
                Ciclo de caixa
              </h3>
              <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: ui.cicloColor }}>
                {ui.cicloDiasTxt}{' '}
                <span style={{ fontSize: "11px", color: "#6b7a6f" }}>
                  / meta ≤13
                </span>
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", margin: "3px 0 14px" }}>
              Recebimento vem das entregas pagas; estoque, do giro dos produtos.
            </div>
            <div style={{ display: "flex", height: "30px", borderRadius: "8px", overflow: "hidden", marginBottom: "10px" }}>
              <div style={{ width: ui.cicloPagW, background: "#1d7a3e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: "600" }}>
                {ui.cicloPag}d
              </div>
              <div style={{ width: ui.cicloEstW, background: "#e3b341", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f2a18", fontSize: "11px", fontWeight: "600" }}>
                {ui.cicloEst}d
              </div>
              <div style={{ width: ui.cicloRecW, background: "#c79320", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: "600" }}>
                {ui.cicloReceb}d receb.
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px", fontSize: "11.5px", color: "#4f5e54" }}>
              <span>
                <span style={{ color: "#1d7a3e" }}>
                  ●
                </span>
                {' '}Paga produtor
              </span>
              <span>
                <span style={{ color: "#e3b341" }}>
                  ●
                </span>
                {' '}Estoque
              </span>
              <span>
                <span style={{ color: "#c79320" }}>
                  ●
                </span>
                {' '}Recebimento
              </span>
            </div>
            <div style={{ fontSize: "11.5px", color: "#66756a", marginTop: "12px", lineHeight: "1.5" }}>
              Ciclo = estoque ({ui.cicloEst}d) + recebimento ({ui.cicloReceb}d) − pagamento ao produtor ({ui.cicloPag}d).
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px 22px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#4f5e54" }}>
              Lucro líquido operacional · {ui.periodLabel}
            </div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "32px", letterSpacing: "-0.02em", marginTop: "6px", color: ui.finLucroColor }}>
              {ui.finLucro}
            </div>
            <div style={{ fontSize: "12.5px", color: "#5a6a5f", marginTop: "4px" }}>
              {ui.finPctTxt} · calculado dos pedidos e custos lançados
            </div>
          </div>
        </div>
        <div style={{ gridColumn: "1/-1", background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: "700", color: "#0f2a18", margin: "0" }}>
              Lançamentos do período
            </h3>
            <span style={{ fontSize: "12px", color: "#66756a" }}>
              clique num lançamento para editar
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "0.6fr 1.2fr 1.6fr 1fr 0.8fr", gap: "8px", padding: "9px 0", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#6b7a6f" }}>
            <div>
              DATA
            </div>
            <div>
              CATEGORIA
            </div>
            <div>
              DESCRIÇÃO
            </div>
            <div>
              FUNCIONÁRIO
            </div>
            <div style={{ textAlign: "right" }}>
              VALOR
            </div>
          </div>
          {(ui.lancRows || []).map((l, k0) => (
            <Fragment key={k0}>
              <div onClick={l.edit} style={{ display: "grid", gridTemplateColumns: "0.6fr 1.2fr 1.6fr 1fr 0.8fr", gap: "8px", padding: "11px 0", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center", cursor: "pointer" }} className="h6">
                <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                  {l.data}
                </div>
                <div>
                  <span style={{ fontSize: "11.5px", background: "#f4f7f1", color: "#2c3a31", padding: "3px 10px", borderRadius: "14px", fontWeight: "600" }}>
                    {l.categoria}
                  </span>
                </div>
                <div style={{ color: "#435349", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {l.descricao}
                </div>
                <div style={{ color: "#66756a" }}>
                  {l.func}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: "#b3283d" }}>
                  ({l.valor})
                </div>
              </div>
            </Fragment>
          ))}
          {ui.noLanc ? (
            <>
              <div style={{ padding: "16px 0 4px", textAlign: "center", fontSize: "12.5px", color: "#6b7a6f" }}>
                Nenhum lançamento no período. Clique em{' '}
                <strong>
                  Novo lançamento
                </strong>
                {' '}para registrar custos.
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
