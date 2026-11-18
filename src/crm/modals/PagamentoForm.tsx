// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import type { Vals } from '../types';

export function PagamentoForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
          <select data-field="forma" value={ui.draft.forma ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
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
            <option value="Prazo">
              Prazo
            </option>
          </select>
        </div>
        <div style={{ background: "#eef6ef", border: "1px solid #cfe3d3", borderRadius: "9px", padding: "10px 13px", fontSize: "12px", color: "#17642f" }}>
          Ao salvar, o pedido é marcado como{' '}
          <strong>
            Pago
          </strong>
          {' '}e os{' '}
          <strong>
            dias até recebimento
          </strong>
          {' '}(data da entrega → data do pagamento) alimentam o ciclo de caixa.
        </div>
      </div>
    </>
  );
}
