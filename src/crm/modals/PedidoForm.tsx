// Baseado no design (Imperio da Goiaba CRM v2.dc.html) e mantido à mão: recebimento com conta, vencimento automático e limite de crédito.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function PedidoForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Cliente
          </label>
          <select data-field="cliente" value={ui.draft.cliente ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            {(ui.clienteOptions || []).map((o, k0) => (
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
            Rota (automática do cliente)
          </label>
          <input value={ui.draft.rota ?? ''} disabled style={{ width: "100%", padding: "9px 11px", border: "1px solid #e7ece3", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#66756a", background: "#f4f7f1", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Data do pedido
          </label>
          <input type="date" data-field="dataPedido" value={ui.draft.dataPedido ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Data de entrega
          </label>
          <input type="date" data-field="entrega" value={ui.draft.entrega ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div style={{ gridColumn: "1/-1", border: "1px solid #e7ece3", borderRadius: "11px", overflow: "hidden", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#f4f7f1", borderBottom: "1px solid #e7ece3" }}>
            <div style={{ flex: "1", fontSize: "12.5px", fontWeight: "700", color: "#2c3a31" }}>
              Itens do pedido
            </div>
            <button onClick={ui.addItem} style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "7px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
              <span style={{ fontSize: "14px", lineHeight: "1" }}>
                ＋
              </span>
              {' '}Adicionar produto
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 0.8fr 0.9fr 0.9fr 1fr 0.3fr", gap: "8px", padding: "8px 14px", fontSize: "10.5px", fontWeight: "700", color: "#6b7a6f", letterSpacing: "0.3px", borderBottom: "1px solid #f3f6f0" }}>
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
              SUBTOTAL
            </div>
            <div />
          </div>
          {(ui.itemRows || []).map((it, k0) => (
            <Fragment key={k0}>
              <div style={{ display: "grid", gridTemplateColumns: "1.8fr 0.8fr 0.9fr 0.9fr 1fr 0.3fr", gap: "8px", padding: "7px 14px", alignItems: "center", borderBottom: "1px solid #f4f7f1" }}>
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
                <div>
                  <input type="number" step="any" data-idx={it.idx} data-f="kg" value={it.kg ?? ''} onChange={ui.updateItem} style={{ width: "100%", padding: "7px 8px", border: `1px solid ${it.kgBorder}`, borderRadius: "7px", fontSize: "12.5px", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b", background: "#fff", boxSizing: "border-box", textAlign: "right" }} />
                  <div style={{ fontSize: "10px", textAlign: "right", marginTop: "2px", color: it.dispColor, fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                    {it.dispTxt}
                  </div>
                </div>
                <input type="number" step="0.01" data-idx={it.idx} data-f="preco" value={it.preco ?? ''} onChange={ui.updateItem} style={{ width: "100%", padding: "7px 8px", border: "1px solid #d3dbcf", borderRadius: "7px", fontSize: "12.5px", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b", background: "#fff", boxSizing: "border-box", textAlign: "right" }} />
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
                Nenhum item ainda. Clique em{' '}
                <strong>
                  Adicionar produto
                </strong>
                {' '}para lançar caixas/kg por produto.
              </div>
            </>
          ) : null}
          {ui.temAlertaEstoque ? (
            <>
              <div style={{ background: "#f6efd8", borderTop: "1px solid #ecdcc6", padding: "11px 14px" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#8a6d2a", marginBottom: "4px" }}>
                  ⚠ Estoque insuficiente
                </div>
                {(ui.estoqueAlertas || []).map((a, k0) => (
                  <Fragment key={k0}>
                    <div style={{ fontSize: "11.5px", color: "#8a6d2a" }}>
                      {a.txt}
                    </div>
                  </Fragment>
                ))}
                <div style={{ fontSize: "11px", color: "#a08a5a", marginTop: "4px" }}>
                  Dá para salvar, mas o estoque fica negativo. Confira se falta lançar uma entrada.
                </div>
              </div>
            </>
          ) : null}
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 0.8fr 0.9fr 0.9fr 1fr 0.3fr", gap: "8px", padding: "11px 14px", background: "#eef6ef", borderTop: "1px solid #cfe3d3", alignItems: "center", fontSize: "12.5px" }}>
            <div style={{ fontWeight: "700", color: "#17642f" }}>
              Totais
            </div>
            <div />
            <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: "#0f2a18" }}>
              {ui.pedTotals.peso}
            </div>
            <div />
            <div style={{ textAlign: "right", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: "700", color: "#0f2a18" }}>
              {ui.pedTotals.valor}
            </div>
            <div />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Status do pedido
          </label>
          <select data-field="status" value={ui.draft.status ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="Pendente">
              Pendente
            </option>
            <option value="Em rota">
              Em rota
            </option>
            <option value="Entregue">
              Entregue
            </option>
            <option value="Devolvido">
              Devolvido
            </option>
            <option value="Cancelado">
              Cancelado
            </option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Status de pagamento
          </label>
          <select data-field="pag" value={ui.draft.pag === 'Pago' ? 'Pago' : 'Pendente'} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="Pendente">A receber</option>
            <option value="Pago">Recebido</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Vencimento
          </label>
          <input type="date" data-field="venc" value={ui.draft.venc && ui.draft.venc !== '—' ? ui.draft.venc : ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
          <div style={{ fontSize: "11px", color: "#6b7a6f", marginTop: "4px" }}>
            Em branco = entrega + prazo do cliente. Passou do vencimento sem receber, fica &quot;Atrasado&quot; sozinho.
          </div>
        </div>
        {ui.draft.pag === 'Pago' ? (
          <>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Recebido em
          </label>
          <input type="date" data-field="dataPagIso" value={ui.draft.dataPagIso ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Conta que recebeu
          </label>
          <select data-field="bancoId" value={ui.draft.bancoId ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="">Caixa (dinheiro, sem banco)</option>
            {(ui.bancoOptions || []).map((o) => (
              <option key={o.id} value={o.id}>{o.nome}</option>
            ))}
          </select>
        </div>
          </>
        ) : null}
        {ui.alertaCredito ? (
          <div role="alert" style={{ gridColumn: "1/-1", background: "#fbe7ea", border: "1px solid #f2c6cd", borderRadius: "9px", padding: "10px 13px", fontSize: "12.5px", color: "#b3283d" }}>
            {ui.alertaCredito}
          </div>
        ) : null}
        <div style={{ gridColumn: "1/-1", background: "#eef6ef", border: "1px solid #cfe3d3", borderRadius: "9px", padding: "10px 13px", fontSize: "12px", color: "#17642f" }}>
          O{' '}
          <strong>
            peso total
          </strong>
          {' '}e o{' '}
          <strong>
            valor
          </strong>
          {' '}são somados dos itens acima e alimentam automaticamente o faturamento. A perda é registrada nas Entradas (compras).
        </div>
      </div>
    </>
  );
}
