// Baseado no design (Imperio da Goiaba CRM v2.dc.html) e mantido à mão: rotas vêm das Configurações.
'use client';

import type { Vals } from '../types';

export function ClienteForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Nome do estabelecimento
          </label>
          <input data-field="nome" value={ui.draft.nome ?? ''} onChange={ui.updateDraft} placeholder="Ex.: Mercado Bom Preço" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Responsável / comprador
          </label>
          <input data-field="resp" value={ui.draft.resp ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            CNPJ / CPF
          </label>
          <input data-field="cnpj" value={ui.draft.cnpj ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Telefone / WhatsApp
          </label>
          <input data-field="tel" value={ui.draft.tel ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            E-mail
          </label>
          <input data-field="email" value={ui.draft.email ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Endereço completo
          </label>
          <input data-field="endereco" value={ui.draft.endereco ?? ''} onChange={ui.updateDraft} placeholder="Rua, número, bairro, cidade/UF, CEP" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        {ui.isEditingCliente ? (
          <>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
                Região / rota
              </label>
              <select data-field="rota" value={ui.draft.rota ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
                {ui.rotaOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
                {ui.draft.rota && !ui.rotaOptions.includes(ui.draft.rota) ? <option value={ui.draft.rota}>{ui.draft.rota}</option> : null}
              </select>
            </div>
          </>
        ) : null}
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Frequência de entrega
          </label>
          <input data-field="freq" value={ui.draft.freq ?? ''} onChange={ui.updateDraft} placeholder="Ex.: 2×/sem · Seg e Qui" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
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
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Prazo de pagamento (dias)
          </label>
          <input type="number" data-field="prazo" data-num="1" value={ui.draft.prazo ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Observações do vendedor
          </label>
          <textarea data-field="obs" value={ui.draft.obs ?? ''} onChange={ui.updateDraft} rows={2} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box", resize: "vertical" }} />
        </div>
        <div style={{ gridColumn: "1/-1", background: "#eef6ef", border: "1px solid #cfe3d3", borderRadius: "9px", padding: "10px 13px", fontSize: "12px", color: "#17642f" }}>
          O{' '}
          <strong>
            health score
          </strong>
          {' '}e o{' '}
          <strong>
            % do faturamento
          </strong>
          {' '}são calculados automaticamente a partir destes campos.
        </div>
      </div>
    </>
  );
}
