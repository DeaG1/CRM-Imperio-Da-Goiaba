// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function DiariaForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Data da diária
          </label>
          <input type="date" data-field="data" value={ui.draft.data ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Valor (R$)
          </label>
          <input data-field="valor" value={ui.draft.valor ?? ''} onChange={ui.updateDraft} placeholder="0,00" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box", textAlign: "right", fontVariantNumeric: "tabular-nums" }} />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Nome do diarista
          </label>
          <input data-field="diarista" value={ui.draft.diarista ?? ''} onChange={ui.updateDraft} placeholder="Ex.: João Pereira" list="diaristas-list" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
          <datalist id="diaristas-list">
            {(ui.diaristaNomes || []).map((n, k0) => (
              <Fragment key={k0}>
                <option value={n.v} />
              </Fragment>
            ))}
          </datalist>
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Serviço
          </label>
          <input data-field="descricao" value={ui.draft.descricao ?? ''} onChange={ui.updateDraft} placeholder="Ex.: descarga do caminhão da CEASA" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Banco
          </label>
          <select data-field="bancoId" value={ui.draft.bancoId ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="">
              —
            </option>
            {(ui.bancoOptions || []).map((o, k0) => (
              <Fragment key={k0}>
                <option value={o.id}>
                  {o.nome}
                </option>
              </Fragment>
            ))}
          </select>
        </div>
        <div style={{ gridColumn: "1/-1", background: "#eef6ef", border: "1px solid #cfe3d3", borderRadius: "9px", padding: "10px 13px", fontSize: "12px", color: "#17642f", lineHeight: "1.5" }}>
          A diária entra como custo no Financeiro (categoria Diária) e desconta do saldo do banco escolhido.
        </div>
      </div>
    </>
  );
}
