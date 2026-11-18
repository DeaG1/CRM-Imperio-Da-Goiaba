// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function PerdaForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Data da perda
          </label>
          <input type="date" data-field="data" value={ui.draft.data ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Produto
          </label>
          <select data-field="produtoId" value={ui.draft.produtoId ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="">
              Selecione…
            </option>
            {(ui.produtoOptions || []).map((po, k0) => (
              <Fragment key={k0}>
                <option value={po.id}>
                  {po.nome}
                </option>
              </Fragment>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Unidade
          </label>
          <select data-field="un" value={ui.draft.un ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            {(ui.unidades || []).map((u, k0) => (
              <Fragment key={k0}>
                <option value={u}>
                  {u}
                </option>
              </Fragment>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Quantidade perdida
          </label>
          <input type="number" step="0.01" data-field="qtd" value={ui.draft.qtd ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b", background: "#fff", boxSizing: "border-box", textAlign: "right" }} />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Motivo
          </label>
          <select data-field="motivo" value={ui.draft.motivo ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="armazenagem">
              Armazenagem
            </option>
            <option value="vencimento">
              Vencimento
            </option>
            <option value="manuseio">
              Manuseio
            </option>
            <option value="recusa do cliente">
              Recusa do cliente
            </option>
            <option value="sobra de rota">
              Sobra de rota
            </option>
          </select>
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Observação
          </label>
          <input data-field="obs" value={ui.draft.obs ?? ''} onChange={ui.updateDraft} placeholder="Ex.: caixa amassada no empilhamento" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div style={{ gridColumn: "1/-1", background: "#f7f4ec", border: "1px solid #ecdcc6", borderRadius: "9px", padding: "10px 13px", fontSize: "12px", color: "#8a5a2a" }}>
          Esta perda{' '}
          <strong>
            desconta do estoque
          </strong>
          {' '}e entra no{' '}
          <strong>
            índice de perdas
          </strong>
          {' '}junto com a perda registrada nas compras.
        </div>
      </div>
    </>
  );
}
