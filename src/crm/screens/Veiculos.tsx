// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Veiculos({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1180px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "240px", fontSize: "12.5px", color: "#66756a" }}>
            Clique num veículo para ver os lançamentos · lançados automaticamente no Financeiro · gasto de{' '}
            <strong style={{ color: "#16241b" }}>
              {ui.periodLabel}
            </strong>
            {' '}(o cadastro aparece inteiro)
          </div>
          <button onClick={ui.newVeiculo} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
            <span style={{ fontSize: "16px", lineHeight: "1" }}>
              ＋
            </span>
            {' '}Novo veículo
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "14px", marginBottom: "18px" }}>
          {(ui.veicStats || []).map((s, k0) => (
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
          {(ui.veicRows || []).map((v, k0) => (
            <Fragment key={k0}>
              <div style={{ borderBottom: "1px solid #f3f6f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", rowGap: "12px", flexWrap: "wrap", padding: "16px 20px" }}>
                  <div onClick={v.toggle} style={{ display: "flex", alignItems: "center", gap: "14px", rowGap: "10px", flexWrap: "wrap", flex: "1 1 420px", cursor: "pointer", minWidth: "0" }}>
                    <span style={{ color: "#6b7a6f", fontSize: "12px", width: "10px", flex: "0 0 10px" }}>
                      {v.seta}
                    </span>
                    <div style={{ flex: "1 1 180px", minWidth: "0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: "700", fontSize: "15.5px", color: "#0f2a18" }}>
                          {v.nome}
                        </span>
                        {v.inativo ? (
                          <>
                            <span style={{ fontSize: "11px", fontWeight: "600", color: "#5f6e63", background: "#f0f3ed", padding: "2px 8px", borderRadius: "12px" }}>
                              Inativo
                            </span>
                          </>
                        ) : null}
                      </div>
                      <div style={{ fontSize: "12px", color: "#66756a", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                        {v.placa} · {v.ano}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "26px" }}>
                      <div>
                        <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                          GASTO NO PERÍODO
                        </div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "15px", fontWeight: "700", color: "#16241b", marginTop: "1px" }}>
                          {v.gasto}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                          LANÇAMENTOS
                        </div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "15px", color: "#16241b", marginTop: "1px" }}>
                          {v.qtd}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "7px", alignItems: "center", flexWrap: "wrap", flex: "0 0 auto", marginLeft: "auto" }}>
                    <button onClick={v.gasolina} style={{ background: "#fff", color: "#2c3a31", border: "1px solid #d3dbcf", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h12">
                      Gasolina
                    </button>
                    <button onClick={v.manutencao} style={{ background: "#fff", color: "#2c3a31", border: "1px solid #d3dbcf", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h12">
                      Manutenção
                    </button>
                    <button onClick={v.multa} style={{ background: "#fff", color: "#b3283d", border: "1px solid #f2c6cd", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h7">
                      Multa
                    </button>
                    <button onClick={v.edit} style={{ background: "#fff", color: "#2c3a31", border: "1px solid #d3dbcf", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h4">
                      Editar
                    </button>
                  </div>
                </div>
                {v.aberto ? (
                  <>
                    <div style={{ padding: "0 20px 18px 44px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px", marginBottom: "8px" }}>
                        HISTÓRICO — {v.resumo}
                      </div>
                      {v.semLancs ? (
                        <>
                          <div style={{ background: "#fff", border: "1px dashed #d3dbcf", borderRadius: "9px", padding: "14px", fontSize: "12.5px", color: "#6b7a6f", textAlign: "center" }}>
                            Nenhuma gasolina, manutenção ou multa lançada neste período. Use{' '}
                            <strong>
                              Gasolina
                            </strong>
                            {' '}para registrar.
                          </div>
                        </>
                      ) : null}
                      {(v.lancs || []).map((l, k1) => (
                        <Fragment key={k1}>
                          <div onClick={l.edit} style={{ display: "grid", gridTemplateColumns: "0.55fr 1.3fr 1.8fr 0.7fr", gap: "10px", alignItems: "center", background: "#fff", border: "1px solid #eef2ea", borderRadius: "9px", padding: "9px 13px", marginBottom: "6px", fontSize: "12.5px", cursor: "pointer" }} className="h8">
                            <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                              {l.data}
                            </div>
                            <div>
                              <span style={{ fontSize: "11.5px", fontWeight: "600", background: l.bgCat, color: l.corCat, padding: "3px 10px", borderRadius: "14px", whiteSpace: "nowrap" }}>
                                {l.categoria}
                              </span>
                            </div>
                            <div style={{ color: "#435349", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {l.descricao}
                            </div>
                            <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: "#b3283d" }}>
                              {l.valor}
                            </div>
                          </div>
                        </Fragment>
                      ))}
                      {v.obs ? (
                        <>
                          <div style={{ fontSize: "12px", color: "#66756a", marginTop: "8px" }}>
                            {v.obs}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            </Fragment>
          ))}
          {ui.noVeic ? (
            <>
              <div style={{ padding: "22px", textAlign: "center", fontSize: "12.5px", color: "#6b7a6f" }}>
                Nenhum veículo cadastrado ainda. Cadastre os carros da frota para lançar gasolina, manutenção e multas em cada um.
              </div>
            </>
          ) : null}
        </div>
        <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
          <strong style={{ color: "#16241b" }}>
            Gasto no período
          </strong>
          {' '}= gasolina + manutenção + multas lançadas neste veículo no recorte escolhido no cabeçalho. Os mesmos lançamentos entram no total de custos do{' '}
          <strong style={{ color: "#16241b" }}>
            Financeiro
          </strong>
          , não são um segundo caixa.
        </div>
      </div>
    </>
  );
}
