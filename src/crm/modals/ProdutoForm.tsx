// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function ProdutoForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Nome do produto
          </label>
          <input data-field="nome" value={ui.draft.nome ?? ''} onChange={ui.updateDraft} placeholder="Ex.: Batata" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Unidade padrão
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
        <div style={{ gridColumn: "1/-1", background: "#eef6ef", border: "1px solid #cfe3d3", borderRadius: "9px", padding: "10px 13px", fontSize: "12px", color: "#17642f" }}>
          A{' '}
          <strong>
            unidade padrão
          </strong>
          {' '}já vem selecionada quando você escolher este produto numa entrada ou saída.{' '}
          <strong>
            Preço de compra
          </strong>
          ,{' '}
          <strong>
            venda
          </strong>
          ,{' '}
          <strong>
            markup
          </strong>
          {' '}e{' '}
          <strong>
            % de perda
          </strong>
          {' '}são calculados automaticamente dos lançamentos.
        </div>
      </div>
    </>
  );
}
