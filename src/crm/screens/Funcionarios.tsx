// Baseado no design (Imperio da Goiaba CRM v2.dc.html) e mantido à mão: diárias como contas a pagar.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Funcionarios({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1180px" }}>
        <div style={{ display: "inline-flex", gap: "4px", padding: "4px", background: "#fff", border: "1px solid #e7ece3", borderRadius: "10px", marginBottom: "16px" }}>
          <button onClick={ui.funcTabEquipe} style={{ border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.funcTabEquipeBg, color: ui.funcTabEquipeFg }}>
            Equipe
          </button>
          <button onClick={ui.funcTabDiarias} style={{ border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.funcTabDiariasBg, color: ui.funcTabDiariasFg }}>
            Diárias
          </button>
        </div>
        {ui.funcViewEquipe ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ flex: "1", fontSize: "12.5px", color: "#66756a" }}>
                Clique num funcionário para ver os adiantamentos · lançados automaticamente no Financeiro
              </div>
              <button onClick={ui.newFuncionario} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
                <span style={{ fontSize: "16px", lineHeight: "1" }}>
                  ＋
                </span>
                {' '}Novo funcionário
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "18px" }}>
              {(ui.funcStats || []).map((s, k0) => (
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
              <div style={{ display: "none" }} />
              {(ui.funcionariosRows || []).map((f, k0) => (
                <Fragment key={k0}>
                  <div style={{ borderBottom: "1px solid #f3f6f0", background: f.rowBg }}>
                    <div onClick={f.toggle} style={{ padding: "16px 20px", cursor: "pointer" }} className="h6">
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", rowGap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
                        <span style={{ color: "#6b7a6f", fontSize: "12px", width: "10px", flex: "0 0 10px" }}>
                          {f.seta}
                        </span>
                        <div style={{ width: "0", flex: "0 0 0" }} />
                        <div style={{ flex: "1", minWidth: "0" }}>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: "700", fontSize: "15.5px", color: "#0f2a18" }}>
                            {f.nome}
                          </div>
                          <div style={{ fontSize: "12px", color: "#66756a" }}>
                            {f.cargo} · {f.tel}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px", flex: "0 0 auto", marginLeft: "auto" }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                              PRÓXIMO PAGAMENTO
                            </div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", color: "#16241b" }}>
                              {f.proxPagTxt}
                            </div>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: f.pagStatusColor, background: f.pagStatusBg, padding: "5px 11px", borderRadius: "14px", whiteSpace: "nowrap" }}>
                            {f.pagStatus}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", rowGap: "14px", flexWrap: "wrap", paddingLeft: "24px" }}>
                        <div style={{ display: "flex", gap: "26px", rowGap: "12px", flexWrap: "wrap", flex: "1 1 320px" }}>
                          <div>
                            <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                              SALÁRIO
                            </div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "14px", color: "#16241b", marginTop: "1px" }}>
                              {f.salario}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                              ADIANTADO
                            </div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "14px", color: "#b3283d", marginTop: "1px" }}>
                              {f.adiantado}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                              PAGO
                            </div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "14px", color: "#435349", marginTop: "1px" }}>
                              {f.pagoSal}
                            </div>
                          </div>
                          <div style={{ paddingLeft: "26px", borderLeft: "1px solid #eef2ea" }}>
                            <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                              A PAGAR
                            </div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "16px", fontWeight: "700", color: f.aPagarColor, marginTop: "1px" }}>
                              {f.aPagar}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "7px", alignItems: "center", flexWrap: "wrap", flex: "0 0 auto", marginLeft: "auto" }}>
                          <span style={{ fontSize: "11px", color: "#a9c2ae", fontWeight: "600", whiteSpace: "nowrap" }}>
                            {f.quitadoTxt}
                          </span>
                          {f.podePagar ? (
                            <>
                              <button onClick={f.pagar} style={{ background: "#17642f", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap", boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }} className="h10">
                                Pagar salário
                              </button>
                            </>
                          ) : null}
                          <button onClick={f.adiantar} style={{ background: "#fff", color: "#a96b3a", border: "1px solid #e0c9b4", borderRadius: "8px", padding: "8px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h11">
                            Adiantar
                          </button>
                          <button onClick={f.edit} style={{ background: "#fff", color: "#2c3a31", border: "1px solid #d3dbcf", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h4">
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                    {f.aberto ? (
                      <>
                        <div style={{ padding: "0 20px 18px 24px", background: "#ffffff" }}>
                          <div style={{ display: "flex", gap: "22px", rowGap: "12px", flexWrap: "wrap", marginBottom: "12px", padding: "11px 14px", background: "#fff", border: "1px solid #eef2ea", borderRadius: "9px" }}>
                            <div>
                              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                                ÚLTIMO SALÁRIO PAGO
                              </div>
                              <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", color: "#16241b", marginTop: "2px" }}>
                                {f.ultimoPagTxt}
                              </div>
                            </div>
                            <div style={{ width: "1px", background: "#eef2ea" }} />
                            <div>
                              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                                DIA DO PAGAMENTO
                              </div>
                              <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", color: "#16241b", marginTop: "2px" }}>
                                todo dia {f.diaPagTxt}
                              </div>
                            </div>
                            <div style={{ width: "1px", background: "#eef2ea" }} />
                            <div>
                              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                                PRÓXIMO PAGAMENTO
                              </div>
                              <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", color: "#16241b", marginTop: "2px" }}>
                                {f.proxPagTxt} ·{' '}
                                <span style={{ color: f.pagStatusColor, fontWeight: "600" }}>
                                  {f.pagStatus}
                                </span>
                              </div>
                            </div>
                            <div style={{ width: "1px", background: "#eef2ea" }} />
                            <div>
                              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                                SALDO A PAGAR
                              </div>
                              <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", fontWeight: "700", color: f.aPagarColor, marginTop: "2px" }}>
                                {f.aPagar}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px", marginBottom: "8px" }}>
                            HISTÓRICO — {f.resumo}
                          </div>
                          {f.semLancs ? (
                            <>
                              <div style={{ background: "#fff", border: "1px dashed #d3dbcf", borderRadius: "9px", padding: "14px", fontSize: "12.5px", color: "#6b7a6f", textAlign: "center" }}>
                                Nenhum adiantamento ou salário lançado neste período. Use{' '}
                                <strong>
                                  Adiantar
                                </strong>
                                {' '}para registrar.
                              </div>
                            </>
                          ) : null}
                          {(f.lancs || []).map((l, k1) => (
                            <Fragment key={k1}>
                              <div onClick={l.edit} style={{ display: "grid", gridTemplateColumns: "0.55fr 1.2fr 1.8fr 0.7fr", gap: "10px", alignItems: "center", background: "#fff", border: "1px solid #eef2ea", borderRadius: "9px", padding: "9px 13px", marginBottom: "6px", fontSize: "12.5px", cursor: "pointer" }} className="h8">
                                <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                                  {l.data}
                                </div>
                                <div>
                                  <span style={{ fontSize: "11.5px", fontWeight: "600", background: l.bgCat, color: l.corCat, padding: "3px 10px", borderRadius: "14px" }}>
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
                        </div>
                      </>
                    ) : null}
                  </div>
                </Fragment>
              ))}
              {ui.noFunc ? (
                <>
                  <div style={{ padding: "18px", textAlign: "center", fontSize: "12.5px", color: "#6b7a6f" }}>
                    Nenhum funcionário ainda. Clique em{' '}
                    <strong>
                      Novo funcionário
                    </strong>
                    {' '}para cadastrar.
                  </div>
                </>
              ) : null}
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
              <strong style={{ color: "#16241b" }}>
                A pagar
              </strong>
              {' '}= salário − adiantamentos − salários pagos no período. O{' '}
              <strong style={{ color: "#16241b" }}>
                próximo pagamento
              </strong>
              {' '}é o dia escolhido no cadastro, contado a partir do último salário pago.
            </div>
          </>
        ) : null}
        {ui.funcViewDiarias ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              <div style={{ flex: "1", minWidth: "240px", fontSize: "12.5px", color: "#66756a" }}>
                Pessoas contratadas por dia · cada diária entra no{' '}
                <strong style={{ color: "#16241b" }}>
                  Financeiro
                </strong>
                {' '}como custo e só sai do banco quando é{' '}
                <strong style={{ color: "#16241b" }}>
                  paga
                </strong>
                {' '}·{' '}
                <strong style={{ color: "#16241b" }}>
                  {ui.periodLabel}
                </strong>
              </div>
              <button onClick={ui.newDiaria} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 15px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
                <span style={{ fontSize: "16px", lineHeight: "1" }}>
                  ＋
                </span>
                {' '}Nova diária
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "14px", marginBottom: "18px" }}>
              {(ui.diariaStats || []).map((s, k0) => (
                <Fragment key={k0}>
                  <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "15px 17px" }}>
                    <div style={{ fontSize: "12px", color: "#66756a", fontWeight: "600" }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "23px", color: s.color || "#0f2a18", marginTop: "6px" }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#6b7a6f" }}>
                      {s.sub}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", overflow: "auto" }}>
              <div style={{ minWidth: "960px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "92px minmax(140px,1.3fr) minmax(140px,1.4fr) minmax(110px,1fr) 110px 110px 150px", gap: "14px", padding: "12px 20px", borderBottom: "1px solid #e7ece3", fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                  <span>
                    DATA
                  </span>
                  <span>
                    DIARISTA
                  </span>
                  <span>
                    SERVIÇO
                  </span>
                  <span>
                    BANCO
                  </span>
                  <span style={{ textAlign: "right" }}>
                    VALOR
                  </span>
                  <span>
                    SITUAÇÃO
                  </span>
                  <span />
                </div>
                {(ui.diariaRows || []).map((d, k0) => (
                  <Fragment key={k0}>
                    <div style={{ display: "grid", gridTemplateColumns: "92px minmax(140px,1.3fr) minmax(140px,1.4fr) minmax(110px,1fr) 110px 110px 150px", gap: "14px", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #f3f6f0", fontSize: "13px" }} className="h4">
                      <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b" }}>
                          {d.data}
                        </span>
                        <span style={{ fontSize: "11px", color: "#6b7a6f" }}>
                          {d.semana}
                        </span>
                      </span>
                      <span style={{ fontWeight: "600", color: "#0f2a18" }}>
                        {d.diarista}
                      </span>
                      <span style={{ color: "#435349" }}>
                        {d.servico}
                      </span>
                      <span style={{ color: d.bancoColor }}>
                        {d.banco}
                      </span>
                      <span style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: "#b3283d" }}>
                        {d.valor}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                        <span style={{ fontSize: "11.5px", color: d.situacaoColor, background: d.situacaoBg, padding: "3px 9px", borderRadius: "14px", fontWeight: "600" }}>
                          {d.situacao}
                        </span>
                        {d.pagInfo ? (
                          <span style={{ fontSize: "11px", color: "#6b7a6f" }}>
                            {d.pagInfo}
                          </span>
                        ) : null}
                      </span>
                      <span style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        {!d.paga ? (
                          <button onClick={d.pagar} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
                            Pagar
                          </button>
                        ) : null}
                        <button onClick={d.edit} style={{ background: "#fff", color: "#2c3a31", border: "1px solid #d3dbcf", borderRadius: "8px", padding: "6px 11px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h4">
                          Editar
                        </button>
                      </span>
                    </div>
                  </Fragment>
                ))}
                {ui.noDiaria ? (
                  <>
                    <div style={{ padding: "22px", textAlign: "center", fontSize: "12.5px", color: "#6b7a6f" }}>
                      Nenhuma diária lançada neste período.
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
