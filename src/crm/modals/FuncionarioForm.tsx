// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function FuncionarioForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Nome do funcionário
          </label>
          <input data-field="nome" value={ui.draft.nome ?? ''} onChange={ui.updateDraft} placeholder="Ex.: João da Silva" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Função / cargo
          </label>
          <input data-field="cargo" value={ui.draft.cargo ?? ''} onChange={ui.updateDraft} placeholder="Ex.: Motorista" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Telefone
          </label>
          <input data-field="tel" value={ui.draft.tel ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Salário mensal (R$)
          </label>
          <input type="number" step="0.01" data-field="salario" value={ui.draft.salario ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b", background: "#fff", boxSizing: "border-box", textAlign: "right" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Dia do pagamento
          </label>
          <select data-field="diaPag" value={ui.draft.diaPag ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            {(ui.diasDoMes || []).map((d, k0) => (
              <Fragment key={k0}>
                <option value={d.v}>
                  {d.l}
                </option>
              </Fragment>
            ))}
          </select>
        </div>
        <div style={{ gridColumn: "1/-1", background: "#eef6ef", border: "1px solid #cfe3d3", borderRadius: "9px", padding: "10px 13px", fontSize: "12px", color: "#17642f" }}>
          O{' '}
          <strong>
            dia do pagamento
          </strong>
          {' '}define a próxima data prevista. Adiantamentos e salários pagos são lançamentos do Financeiro vinculados a este funcionário, e descontam do valor{' '}
          <strong>
            a pagar
          </strong>
          .
        </div>
      </div>
    </>
  );
}
