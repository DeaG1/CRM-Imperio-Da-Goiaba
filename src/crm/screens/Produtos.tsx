// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Produtos({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1280px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ flex: "1", fontSize: "12.5px", color: "#66756a" }}>
            Clique num produto para editar · preços são{' '}
            <strong>
              por unidade
            </strong>
            {' '}do produto (KG, CX…), calculados das compras e vendas
          </div>
          <button onClick={ui.newProduto} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
            <span style={{ fontSize: "16px", lineHeight: "1" }}>
              ＋
            </span>
            {' '}Novo produto
          </button>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.5fr 0.85fr 0.85fr 0.7fr 1fr 0.7fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
            <div>
              PRODUTO
            </div>
            <div>
              UNIDADE
            </div>
            <div style={{ textAlign: "right" }}>
              COMPRA MÉD.
            </div>
            <div style={{ textAlign: "right" }}>
              VENDA MÉD.
            </div>
            <div style={{ textAlign: "right" }}>
              MARKUP
            </div>
            <div style={{ textAlign: "right" }}>
              MARGEM
            </div>
            <div style={{ textAlign: "right" }}>
              PERDA
            </div>
          </div>
          {(ui.produtos || []).map((p, k0) => (
            <Fragment key={k0}>
              <div onClick={p.edit} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.5fr 0.85fr 0.85fr 0.7fr 1fr 0.7fr", gap: "8px", padding: "13px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "13px", alignItems: "center", cursor: "pointer" }} className="h6">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.dotColor }} />
                  <span style={{ fontWeight: "600", color: "#0f2a18" }}>
                    {p.nome}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "11.5px", background: "#eef6ef", color: "#17642f", padding: "3px 10px", borderRadius: "14px" }}>
                    {p.un}
                  </span>
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                  {p.compra}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b" }}>
                  {p.venda}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: p.markupColor }}>
                  {p.markup}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b" }}>
                  {p.margem}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: p.perdaColor }}>
                  {p.perda}
                </div>
              </div>
            </Fragment>
          ))}
          {ui.semProdutos ? (
            <>
              <div style={{ padding: "30px 18px", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#2c3a31" }}>
                  Nenhum produto cadastrado
                </div>
                <div style={{ fontSize: "12.5px", color: "#6b7a6f", marginTop: "4px", marginBottom: "16px" }}>
                  Comece por aqui: sem produto não é possível lançar entrada nem saída. Cadastre o nome e a unidade padrão.
                </div>
                <button onClick={ui.newProduto} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "10px 20px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
                  ＋ Cadastrar primeiro produto
                </button>
              </div>
            </>
          ) : null}
          {ui.temProdutos ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.5fr 0.85fr 0.85fr 0.7fr 1fr 0.7fr", gap: "8px", padding: "13px 18px", background: "#eef6ef", borderTop: "1px solid #cfe3d3", fontSize: "13px", alignItems: "center" }}>
                <div style={{ fontWeight: "700", color: "#17642f" }}>
                  Perda média (realizada)
                </div>
                <div />
                <div />
                <div />
                <div />
                <div style={{ textAlign: "right", fontSize: "11px", color: "#7d9c86", fontWeight: "600" }}>
                  MÉDIA →
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: ui.produtoPerdaMediaColor }}>
                  {ui.produtoPerdaMediaTxt}
                </div>
              </div>
            </>
          ) : null}
        </div>
        <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
          A{' '}
          <strong style={{ color: "#16241b" }}>
            perda
          </strong>
          {' '}acumula da coleta e do depósito, não é estimada. Markup mínimo{' '}
          <strong style={{ color: "#16241b" }}>
            ≥ 60%
          </strong>
          {' '}· Perda alvo{' '}
          <strong style={{ color: "#16241b" }}>
            ≤ 10%
          </strong>
          .
        </div>
      </div>
    </>
  );
}
