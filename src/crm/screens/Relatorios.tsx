// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Relatorios({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ maxWidth: "1280px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", background: "#eef2ea", borderRadius: "10px", padding: "3px", gap: "3px" }}>
            <button onClick={ui.setRelClientes} style={{ border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.relTabCliBg, color: ui.relTabCliFg }}>
              Clientes
            </button>
            <button onClick={ui.setRelInad} style={{ border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.tabInaBg, color: ui.tabInaFg }}>
              Inadimplentes
            </button>
            <button onClick={ui.setRelPedidos} style={{ border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.relTabPedBg, color: ui.relTabPedFg }}>
              Pedidos
            </button>
            <button onClick={ui.setRelCompras} style={{ border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.tabComBg, color: ui.tabComFg }}>
              Compras
            </button>
            <button onClick={ui.setRelProdutos} style={{ border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.tabProBg, color: ui.tabProFg }}>
              Produtos
            </button>
            <button onClick={ui.setRelPerdas} style={{ border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.tabPerBg, color: ui.tabPerFg }}>
              Perdas
            </button>
            <button onClick={ui.setRelLanc} style={{ border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.relTabLanBg, color: ui.relTabLanFg }}>
              Lançamentos
            </button>
          </div>
          <div style={{ flex: "1" }} />
          <div style={{ display: "flex", gap: "7px", alignItems: "center" }} data-no-print="1">
            <button onClick={ui.exportarCSV} style={{ background: "#fff", color: "#2c3a31", border: "1px solid #d3dbcf", borderRadius: "8px", padding: "8px 13px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h4">
              Exportar CSV
            </button>
            <button onClick={ui.imprimirRelatorio} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 13px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" }} className="h5">
              Imprimir / PDF
            </button>
          </div>
        </div>
        <div style={{ fontSize: "12.5px", color: "#66756a", marginBottom: "14px" }}>
          <strong style={{ color: "#2c3a31" }}>
            {ui.relNomeAtual}
          </strong>
          {' '}· filtrado por {ui.periodLabel}
        </div>
        {ui.relClientes ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "16px" }}>
              {(ui.relClientesTot || []).map((s, k0) => (
                <Fragment key={k0}>
                  <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "16px 18px" }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.9fr 1fr 0.6fr 1fr 0.9fr 0.6fr 0.7fr 0.9fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
                <div>
                  CLIENTE
                </div>
                <div>
                  ROTA
                </div>
                <div>
                  STATUS
                </div>
                <div style={{ textAlign: "right" }}>
                  PED.
                </div>
                <div style={{ textAlign: "right" }}>
                  FATURADO
                </div>
                <div style={{ textAlign: "right" }}>
                  /ENTREGA
                </div>
                <div style={{ textAlign: "right" }}>
                  % FAT
                </div>
                <div style={{ textAlign: "right" }}>
                  INAD.
                </div>
                <div style={{ textAlign: "right" }}>
                  SAÚDE
                </div>
              </div>
              {(ui.relClientesRows || []).map((c, k0) => (
                <Fragment key={k0}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.9fr 1fr 0.6fr 1fr 0.9fr 0.6fr 0.7fr 0.9fr", gap: "8px", padding: "12px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center" }}>
                    <div style={{ fontWeight: "600", color: "#0f2a18", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.nome}
                    </div>
                    <div style={{ color: "#435349" }}>
                      {c.rota}
                    </div>
                    <div style={{ color: "#435349" }}>
                      {c.status}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                      {c.pedidos}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: "#0f2a18" }}>
                      {c.fatTxt}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                      {c.teTxt}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                      {c.part}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: c.inadColor }}>
                      {c.inad}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", color: c.healthColor, background: c.healthBg, padding: "3px 9px", borderRadius: "14px" }}>
                        {c.healthLabel}
                      </span>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
              Ranking por faturamento no período. Faturado, ticket por entrega e % de participação vêm dos pedidos entregues.
            </div>
          </>
        ) : null}
        {ui.relPedidos ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "16px" }}>
              {(ui.relPedidosTot || []).map((s, k0) => (
                <Fragment key={k0}>
                  <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "16px 18px" }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "14px" }}>
              <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: "700", color: "#0f2a18", margin: "0 0 14px" }}>
                  Pedidos por status
                </h3>
                {(ui.relStatus || []).map((s, k0) => (
                  <Fragment key={k0}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #f3f6f0" }}>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: s.color, background: s.bg, padding: "3px 11px", borderRadius: "14px", minWidth: "74px", textAlign: "center" }}>
                        {s.label}
                      </span>
                      <span style={{ flex: "1", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "15px", fontWeight: "600", color: "#0f2a18" }}>
                        {s.count}
                      </span>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", color: "#435349" }}>
                        {s.valor}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: "700", color: "#0f2a18", margin: "0 0 14px" }}>
                  Desempenho por rota
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 0.6fr 1fr 1fr 0.7fr", gap: "8px", paddingBottom: "9px", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#6b7a6f" }}>
                  <div>
                    ROTA
                  </div>
                  <div style={{ textAlign: "right" }}>
                    PED.
                  </div>
                  <div style={{ textAlign: "right" }}>
                    QTD
                  </div>
                  <div style={{ textAlign: "right" }}>
                    FATURADO
                  </div>
                  <div style={{ textAlign: "right" }}>
                    TICKET
                  </div>
                </div>
                {(ui.relRotas || []).map((r, k0) => (
                  <Fragment key={k0}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 0.6fr 1fr 1fr 0.7fr", gap: "8px", padding: "11px 0", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center" }}>
                      <div style={{ fontWeight: "600", color: "#0f2a18" }}>
                        {r.rota}
                      </div>
                      <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                        {r.ped}
                      </div>
                      <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                        {r.peso}
                      </div>
                      <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600" }}>
                        {r.fat}
                      </div>
                      <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                        {r.ticket}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
              Todos os números respeitam o período selecionado e são somados dos pedidos lançados.
            </div>
          </>
        ) : null}
        {ui.relLanc ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "16px" }}>
              {(ui.relLancTot || []).map((s, k0) => (
                <Fragment key={k0}>
                  <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "16px 18px" }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 0.8fr 0.9fr 0.9fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
                <div>
                  DATA
                </div>
                <div>
                  MOVIMENTAÇÃO
                </div>
                <div>
                  TIPO
                </div>
                <div style={{ textAlign: "right" }}>
                  ENTRADA
                </div>
                <div style={{ textAlign: "right" }}>
                  SAÍDA
                </div>
              </div>
              {(ui.relLancRows || []).map((l, k0) => (
                <Fragment key={k0}>
                  <div style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 0.8fr 0.9fr 0.9fr", gap: "8px", padding: "12px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center" }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                      {l.data}
                    </div>
                    <div style={{ color: "#16241b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {l.origem}
                    </div>
                    <div>
                      <span style={{ fontSize: "11.5px", fontWeight: "600", color: l.tipoColor, background: l.tipoBg, padding: "3px 10px", borderRadius: "14px" }}>
                        {l.tipo}
                      </span>
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#2e8b4a", fontWeight: "600" }}>
                      {l.ent}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#b3283d", fontWeight: "600" }}>
                      {l.sai}
                    </div>
                  </div>
                </Fragment>
              ))}
              {ui.noRelLanc ? (
                <>
                  <div style={{ padding: "18px", textAlign: "center", fontSize: "12.5px", color: "#6b7a6f" }}>
                    Sem movimentações no período.
                  </div>
                </>
              ) : null}
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
              Conta tudo:{' '}
              <strong style={{ color: "#16241b" }}>
                vendas pagas
              </strong>
              {' '}(entrada de dinheiro),{' '}
              <strong style={{ color: "#16241b" }}>
                compras dos fornecedores
              </strong>
              {' '}e{' '}
              <strong style={{ color: "#16241b" }}>
                lançamentos de custos
              </strong>
              {' '}(saídas).
            </div>
          </>
        ) : null}
        {ui.verInad ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "16px" }}>
              {(ui.relInadTot || []).map((s, k0) => (
                <Fragment key={k0}>
                  <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "16px 18px" }}>
                    <div style={{ fontSize: "12px", color: "#66756a", fontWeight: "600" }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "19px", color: "#0f2a18", marginTop: "6px" }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.2fr 0.7fr 0.9fr 0.8fr 0.7fr 0.8fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
                <div>
                  CLIENTE
                </div>
                <div>
                  CONTATO
                </div>
                <div style={{ textAlign: "right" }}>
                  PEDIDOS
                </div>
                <div style={{ textAlign: "right" }}>
                  VALOR
                </div>
                <div>
                  VENC. MAIS ANTIGO
                </div>
                <div style={{ textAlign: "right" }}>
                  ATRASO
                </div>
                <div style={{ textAlign: "right" }}>
                  % DELE
                </div>
              </div>
              {(ui.relInad || []).map((r, k0) => (
                <Fragment key={k0}>
                  <div onClick={r.open} style={{ display: "grid", gridTemplateColumns: "1.5fr 1.2fr 0.7fr 0.9fr 0.8fr 0.7fr 0.8fr", gap: "8px", padding: "13px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center", cursor: "pointer" }} className="h6">
                    <div style={{ fontWeight: "600", color: "#0f2a18" }}>
                      {r.cliente}
                      <div style={{ fontSize: "11px", color: "#6b7a6f", fontWeight: "400" }}>
                        {r.resp}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "11.5px", color: "#435349" }}>
                      {r.tel}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                      {r.peds}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: "#b3283d" }}>
                      {r.valor}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                      {r.venc}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: r.diasColor }}>
                      {r.dias}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                      {r.pctCli}
                    </div>
                  </div>
                </Fragment>
              ))}
              {ui.noRelInad ? (
                <>
                  <div style={{ padding: "26px 18px", textAlign: "center" }}>
                    <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#17642f" }}>
                      Nenhum cliente em atraso
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#6b7a6f", marginTop: "4px" }}>
                      Todos os pedidos do período estão pagos ou dentro do prazo.
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
              Clique num cliente para abrir a ficha e o histórico de cobrança.{' '}
              <strong style={{ color: "#16241b" }}>
                % dele
              </strong>
              {' '}= quanto do faturamento daquele cliente está em atraso.
            </div>
          </>
        ) : null}
        {ui.verCompras ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "16px" }}>
              {(ui.relComprasTot || []).map((s, k0) => (
                <Fragment key={k0}>
                  <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "16px 18px" }}>
                    <div style={{ fontSize: "12px", color: "#66756a", fontWeight: "600" }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", fontSize: "21px", color: "#0f2a18", marginTop: "6px" }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.7fr 0.7fr 0.85fr 0.9fr 0.7fr 0.85fr 0.85fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
                <div>
                  FORNECEDOR
                </div>
                <div style={{ textAlign: "right" }}>
                  COLETAS
                </div>
                <div style={{ textAlign: "right" }}>
                  QTD
                </div>
                <div style={{ textAlign: "right" }}>
                  PREÇO MÉD.
                </div>
                <div style={{ textAlign: "right" }}>
                  VALOR
                </div>
                <div style={{ textAlign: "right" }}>
                  PERDA
                </div>
                <div style={{ textAlign: "right" }}>
                  APROVEIT.
                </div>
                <div style={{ textAlign: "right" }}>
                  A PAGAR
                </div>
              </div>
              {(ui.relCompras || []).map((r, k0) => (
                <Fragment key={k0}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.7fr 0.7fr 0.85fr 0.9fr 0.7fr 0.85fr 0.85fr", gap: "8px", padding: "13px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center" }}>
                    <div style={{ fontWeight: "600", color: "#0f2a18" }}>
                      {r.forn}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                      {r.coletas}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                      {r.qtd}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                      {r.medio}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: "#0f2a18" }}>
                      {r.valor}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: r.perdaColor }}>
                      {r.perda}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                      {r.aproveit}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: r.aPagarColor }}>
                      {r.aPagar}
                    </div>
                  </div>
                </Fragment>
              ))}
              {ui.noRelCompras ? (
                <>
                  <div style={{ padding: "22px 18px", textAlign: "center", fontSize: "12.5px", color: "#6b7a6f" }}>
                    Nenhuma compra no período.
                  </div>
                </>
              ) : null}
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
              Ordenado por valor comprado.{' '}
              <strong style={{ color: "#16241b" }}>
                Aproveitamento
              </strong>
              {' '}= quanto da carga chegou em condição de venda.
            </div>
          </>
        ) : null}
        {ui.verProdutos ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "16px" }}>
              {(ui.relProdutosTot || []).map((s, k0) => (
                <Fragment key={k0}>
                  <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "16px 18px" }}>
                    <div style={{ fontSize: "12px", color: "#66756a", fontWeight: "600" }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: "700", fontSize: "19px", color: "#0f2a18", marginTop: "6px" }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.9fr 0.9fr 1fr 1fr 0.7fr 0.7fr", gap: "8px", padding: "12px 18px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3", fontSize: "11px", fontWeight: "700", color: "#5f6e63", letterSpacing: "0.3px" }}>
                <div>
                  PRODUTO
                </div>
                <div style={{ textAlign: "right" }}>
                  COMPRADO
                </div>
                <div style={{ textAlign: "right" }}>
                  VENDIDO
                </div>
                <div style={{ textAlign: "right" }}>
                  FATURAMENTO
                </div>
                <div style={{ textAlign: "right" }}>
                  MARGEM
                </div>
                <div style={{ textAlign: "right" }}>
                  MARKUP
                </div>
                <div style={{ textAlign: "right" }}>
                  PERDA
                </div>
              </div>
              {(ui.relProdutos || []).map((r, k0) => (
                <Fragment key={k0}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.9fr 0.9fr 1fr 1fr 0.7fr 0.7fr", gap: "8px", padding: "13px 18px", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center" }}>
                    <div style={{ fontWeight: "600", color: "#0f2a18" }}>
                      {r.nome}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                      {r.compQ}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                      {r.vendQ}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: "#0f2a18" }}>
                      {r.fat}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#17642f" }}>
                      {r.margem}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: r.markupColor }}>
                      {r.markup}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: r.perdaColor }}>
                      {r.perda}
                    </div>
                  </div>
                </Fragment>
              ))}
              {ui.noRelProdutos ? (
                <>
                  <div style={{ padding: "22px 18px", textAlign: "center", fontSize: "12.5px", color: "#6b7a6f" }}>
                    Nenhum produto movimentado no período.
                  </div>
                </>
              ) : null}
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
              Ordenado por faturamento.{' '}
              <strong style={{ color: "#16241b" }}>
                Margem
              </strong>
              {' '}= faturamento menos o custo de compra da quantidade vendida.
            </div>
          </>
        ) : null}
        {ui.verPerdas ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "16px" }}>
              {(ui.relPerdasTot || []).map((s, k0) => (
                <Fragment key={k0}>
                  <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "16px 18px" }}>
                    <div style={{ fontSize: "12px", color: "#66756a", fontWeight: "600" }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: "700", fontSize: "19px", color: "#0f2a18", marginTop: "6px" }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#6b7a6f" }}>
                      {s.sub}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "14px" }}>
              <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: "700", color: "#0f2a18", margin: "0 0 3px" }}>
                  Perdas por motivo
                </h3>
                <div style={{ fontSize: "12px", color: "#66756a", marginBottom: "16px" }}>
                  Onde a mercadoria está se perdendo.
                </div>
                {(ui.relPerdaMotivos || []).map((m, k0) => (
                  <Fragment key={k0}>
                    <div style={{ marginBottom: "13px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "5px" }}>
                        <div style={{ flex: "1", fontSize: "13px", fontWeight: "600", color: "#16241b", textTransform: "capitalize" }}>
                          {m.motivo}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "#6b7a6f" }}>
                          {m.ocor} ocorr.
                        </div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "13px", fontWeight: "600", color: "#b3283d" }}>
                          {m.qtd}
                        </div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "12px", color: "#435349", width: "38px", textAlign: "right" }}>
                          {m.pct}
                        </div>
                      </div>
                      <div style={{ height: "8px", background: "#f3f6f0", borderRadius: "6px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: m.barra, background: "#a96b3a", borderRadius: "6px" }} />
                      </div>
                    </div>
                  </Fragment>
                ))}
                {ui.noRelPerdas ? (
                  <>
                    <div style={{ padding: "14px 0", textAlign: "center", fontSize: "12.5px", color: "#6b7a6f" }}>
                      Nenhuma perda registrada no período.
                    </div>
                  </>
                ) : null}
              </div>
              <div style={{ background: "#fff", border: "1px solid #e7ece3", borderRadius: "13px", padding: "20px" }}>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: "700", color: "#0f2a18", margin: "0 0 3px" }}>
                  Perdas por produto
                </h3>
                <div style={{ fontSize: "12px", color: "#66756a", marginBottom: "14px" }}>
                  Perecibilidade varia muito por item — meta ≤ 10%.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.7fr", gap: "8px", padding: "8px 0", borderBottom: "1px solid #e7ece3", fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px" }}>
                  <div>
                    PRODUTO
                  </div>
                  <div style={{ textAlign: "right" }}>
                    COMPRADO
                  </div>
                  <div style={{ textAlign: "right" }}>
                    PERDA
                  </div>
                </div>
                {(ui.relPerdaProdutos || []).map((p, k0) => (
                  <Fragment key={k0}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.7fr", gap: "8px", padding: "10px 0", borderBottom: "1px solid #f3f6f0", fontSize: "12.5px", alignItems: "center" }}>
                      <div style={{ fontWeight: "600", color: "#0f2a18" }}>
                        {p.nome}
                      </div>
                      <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#435349" }}>
                        {p.compQ}
                      </div>
                      <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "600", color: p.perdaColor }}>
                        {p.perda}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#66756a", marginTop: "12px" }}>
              Soma a perda registrada na{' '}
              <strong style={{ color: "#16241b" }}>
                coleta
              </strong>
              {' '}(dentro de cada entrada) com as perdas lançadas no{' '}
              <strong style={{ color: "#16241b" }}>
                depósito
              </strong>
              .
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
