// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function BancoForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Banco
          </label>
          <select data-field="instituicao" value={ui.draft.instituicao ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            {(ui.bancoLista || []).map((o, k0) => (
              <Fragment key={k0}>
                <option value={o.v}>
                  {o.v}
                </option>
              </Fragment>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Saldo inicial (R$)
          </label>
          <input data-field="saldoInicial" value={ui.draft.saldoInicial ?? ''} onChange={ui.updateDraft} placeholder="0,00" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box", textAlign: "right", fontVariantNumeric: "tabular-nums" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Apelido
          </label>
          <input data-field="apelido" value={ui.draft.apelido ?? ''} onChange={ui.updateDraft} placeholder="Ex.: Conta do caixa" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Situação
          </label>
          <select data-field="ativo" value={ui.draft.ativo ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="sim">
              Ativo
            </option>
            <option value="nao">
              Inativo
            </option>
          </select>
        </div>
      </div>
    </>
  );
}
