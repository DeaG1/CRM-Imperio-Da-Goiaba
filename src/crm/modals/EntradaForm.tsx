// Baseado no design (Imperio da Goiaba CRM v2.dc.html) e mantido à mão: vencimento e conta do pagamento ao produtor.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function EntradaForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Fornecedor (produtor)
          </label>
          <select data-field="fornecedor" value={ui.draft.fornecedor ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            {(ui.fornecedorOptions || []).map((o, k0) => (
              <Fragment key={k0}>
                <option value={o}>
                  {o}
                </option>
              </Fragment>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Data da coleta
          </label>
          <input type="date" data-field="data" value={ui.draft.data ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Pagamento ao produtor
          </label>
          <select data-field="pago" value={ui.draft.pago ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="Pendente">
              Pendente
            </option>
            <option value="Pago">
              Pago
            </option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Vencimento
          </label>
          <input type="date" data-field="venc" value={ui.draft.venc ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
          <div style={{ fontSize: "11px", color: "#6b7a6f", marginTop: "4px" }}>
            Em branco = vence na data da coleta.
          </div>
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Data do pagamento
          </label>
          <input type="date" data-field="dataPag" value={ui.draft.dataPag ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Forma de pagamento
          </label>
          <select data-field="formaPag" value={ui.draft.formaPag ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="PIX">
              PIX
            </option>
            <option value="Cartão de crédito">
              Cartão de crédito
            </option>
            <option value="Boleto">
              Boleto
            </option>
            <option value="Dinheiro">
              Dinheiro
            </option>
          </select>
        </div>
        {ui.draft.pago === 'Pago' ? (
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Conta de onde saiu
          </label>
          <select data-field="bancoId" value={ui.draft.bancoId ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="">Caixa (dinheiro, sem banco)</option>
            {(ui.bancoOptions || []).map((o) => (
              <option key={o.id} value={o.id}>{o.nome}</option>
            ))}
          </select>
        </div>
        ) : null}
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Motivo da perda
          </label>
          <select data-field="motivo" value={ui.draft.motivo ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="—">
              —
            </option>
            <option value="transporte">
              Transporte
            </option>
            <option value="armazenagem">
              Armazenagem
            </option>
            <option value="vencimento">
              Vencimento
            </option>
            <option value="manuseio">
              Manuseio
            </option>
          </select>
        </div>
        <div style={{ gridColumn: "1/-1", border: "1px solid #e7ece3", borderRadius: "11px", overflow: "hidden", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3" }}>
            <div style={{ flex: "1", fontSize: "12.5px", fontWeight: "700", color: "#2c3a31" }}>
              Produtos recebidos
            </div>
            <button onClick={ui.addItem} style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "7px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
              <span style={{ fontSize: "14px", lineHeight: "1" }}>
                ＋
              </span>
              {' '}Adicionar produto
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.75fr 0.7fr 0.8fr 0.7fr 0.6fr 0.9fr 0.3fr", gap: "8px", padding: "8px 14px", fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px", borderBottom: "1px solid #f3f6f0" }}>
            <div>
              PRODUTO
            </div>
            <div>
              UNIDADE
            </div>
            <div style={{ textAlign: "right" }}>
              QTD
            </div>
            <div style={{ textAlign: "right" }}>
              R$/UN
            </div>
            <div style={{ textAlign: "right" }}>
              PERDA
            </div>
            <div style={{ textAlign: "right" }}>
              PERDA %
            </div>
            <div style={{ textAlign: "right" }}>
              SUBTOTAL
            </div>
            <div />
          </div>
          {(ui.itemRows || []).map((it, k0) => (
            <Fragment key={k0}>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.75fr 0.7fr 0.8fr 0.7fr 0.6fr 0.9fr 0.3fr", gap: "8px", padding: "7px 14px", alignItems: "center", borderBottom: "1px solid #f4f7f1" }}>
                <select data-idx={it.idx} data-f="produtoId" value={it.produtoId ?? ''} onChange={ui.updateItem} style={{ width: "100%", padding: "7px 8px", border: "1px solid #d3dbcf", borderRadius: "7px", fontSize: "12.5px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
                  <option value="">
                    Selecione…
                  </option>
                  {(ui.produtoOptions || []).map((po, k1) => (
                    <Fragment key={k1}>
                      <option value={po.id}>
                        {po.nome}
                      </option>
                    </Fragment>
                  ))}
                </select>
                <select data-idx={it.idx} data-f="un" value={it.un ?? ''} onChange={ui.updateItem} style={{ width: "100%", padding: "7px 6px", border: "1px solid #d3dbcf", borderRadius: "7px", fontSize: "12px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
                  {(ui.unidades || []).map((u, k1) => (
                    <Fragment key={k1}>
                      <option value={u}>
                        {u}
                      </option>
                    </Fragment>
                  ))}
                </select>
                <input type="number" data-idx={it.idx} data-f="kg" value={it.kg ?? ''} onChange={ui.updateItem} style={{ width: "100%", padding: "7px 8px", border: "1px solid #d3dbcf", borderRadius: "7px", fontSize: "12.5px", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b", background: "#fff", boxSizing: "border-box", textAlign: "right" }} />
                <input type="number" step="0.01" data-idx={it.idx} data-f="preco" value={it.preco ?? ''} onChange={ui.updateItem} style={{ width: "100%", padding: "7px 8px", border: "1px solid #d3dbcf", borderRadius: "7px", fontSize: "12.5px", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b", background: "#fff", boxSizing: "border-box", textAlign: "right" }} />
                <input type="number" data-idx={it.idx} data-f="perdaKg" value={it.perdaKg ?? ''} onChange={ui.updateItem} style={{ width: "100%", padding: "7px 8px", border: "1px solid #d3dbcf", borderRadius: "7px", fontSize: "12.5px", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b", background: "#fff", boxSizing: "border-box", textAlign: "right" }} />
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "12.5px", fontWeight: "600", color: it.perdaColor }}>
                  {it.perdaPct}
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "12.5px", color: "#435349" }}>
                  {it.subtotal}
                </div>
                <button onClick={it.remove} style={{ justifySelf: "end", width: "24px", height: "24px", borderRadius: "6px", border: "1px solid #f2c6cd", background: "#fff", color: "#d6334a", cursor: "pointer", fontSize: "13px", lineHeight: "1" }} className="h7">
                  ✕
                </button>
              </div>
            </Fragment>
          ))}
          {ui.noItens ? (
            <>
              <div style={{ padding: "16px 14px", textAlign: "center", fontSize: "12.5px", color: "#6b7a6f" }}>
                Nenhum produto ainda. Clique em{' '}
                <strong>
                  Adicionar produto
                </strong>
                {' '}para lançar o que entrou.
              </div>
            </>
          ) : null}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.75fr 0.7fr 0.8fr 0.7fr 0.6fr 0.9fr 0.3fr", gap: "8px", padding: "11px 14px", background: "#f7f4ec", borderTop: "1px solid #ecdcc6", alignItems: "center", fontSize: "12.5px" }}>
            <div style={{ fontWeight: "700", color: "#8a5a2a" }}>
              Totais
            </div>
            <div />
            <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: "#0f2a18" }}>
              {ui.entTotals.peso}
            </div>
            <div />
            <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: "#0f2a18" }}>
              {ui.entTotals.perdaKg}
            </div>
            <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: ui.entTotals.perdaColor }}>
              {ui.entTotals.perdaPct}
            </div>
            <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: "#0f2a18" }}>
              {ui.entTotals.valor}
            </div>
            <div />
          </div>
        </div>
        <div style={{ gridColumn: "1/-1", background: "#f7f4ec", border: "1px solid #ecdcc6", borderRadius: "9px", padding: "10px 13px", fontSize: "12px", color: "#8a5a2a" }}>
          A{' '}
          <strong>
            perda
          </strong>
          {' '}é registrada aqui (a mercadoria estraga sobre o que foi comprado) e alimenta o Índice de perdas. O{' '}
          <strong>
            valor
          </strong>
          {' '}alimenta a{' '}
          <strong>
            Compra de mercadoria
          </strong>
          {' '}no Financeiro.
        </div>
      </div>
    </>
  );
}
