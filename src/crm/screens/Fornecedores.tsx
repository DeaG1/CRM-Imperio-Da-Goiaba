// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Fornecedores({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1280px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ flex: "1", fontSize: "12.5px", color: "#66756a" }}>
            Clique num fornecedor para editar
          </div>
          <button onClick={ui.newFornecedor} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
            <span style={{ fontSize: "16px", lineHeight: "1" }}>
              ＋
            </span>
            {' '}Novo fornecedor
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "18px" }}>
          <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "16px 18px" }}>
            <div style={{ fontSize: "12px", color: "#66756a", fontWeight: "600" }}>
              Variação de preço de compra
            </div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "24px", color: ui.fornSummary.varia.color, marginTop: "6px" }}>
              {ui.fornSummary.varia.v}
            </div>
            <div style={{ fontSize: "11.5px", color: "#6b7a6f" }}>
              {ui.fornSummary.varia.sub}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "14px" }}>
          {(ui.fornecedores || []).map((f, k0) => (
            <Fragment key={k0}>
              <div onClick={f.edit} style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "18px 20px", cursor: "pointer" }} className="h8">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: "700", fontSize: "16px", color: "#0f2a18" }}>
                      {f.nome}
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#66756a", marginTop: "2px" }}>
                      {f.regiao} · {f.contato}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", margin: "13px 0", flexWrap: "wrap" }}>
                  {(f.produtos || []).map((pr, k1) => (
                    <Fragment key={k1}>
                      <span style={{ fontSize: "11.5px", background: "#eef6ef", color: "#17642f", padding: "3px 10px", borderRadius: "14px" }}>
                        {pr}
                      </span>
                    </Fragment>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", paddingTop: "13px", borderTop: "1px solid #f3f6f0" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6b7a6f" }}>
                      Preço médio
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "14px", color: "#16241b" }}>
                      {f.preco}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6b7a6f" }}>
                      Variação
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "14px", color: f.varColor }}>
                      {f.varia}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6b7a6f" }}>
                      Última coleta
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "14px", color: "#16241b" }}>
                      {f.coleta}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6b7a6f" }}>
                      Aproveit.
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "14px", color: "#16241b" }}>
                      {f.qualidade}
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        {ui.semFornecedores ? (
          <>
            <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "30px 18px", textAlign: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#2c3a31" }}>
                Nenhum fornecedor cadastrado
              </div>
              <div style={{ fontSize: "12.5px", color: "#6b7a6f", marginTop: "4px", marginBottom: "16px" }}>
                Cadastre os produtores de quem você compra. Sem fornecedor não é possível lançar uma entrada.
              </div>
              <button onClick={ui.newFornecedor} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "10px 20px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
                ＋ Cadastrar primeiro fornecedor
              </button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
