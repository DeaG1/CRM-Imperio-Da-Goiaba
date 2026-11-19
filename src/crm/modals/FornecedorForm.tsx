// Baseado no design (Imperio da Goiaba CRM v2.dc.html) e mantido à mão: prazo de pagamento ao produtor.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function FornecedorForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Nome do produtor / fazenda
          </label>
          <input data-field="nome" value={ui.draft.nome ?? ''} onChange={ui.updateDraft} placeholder="Ex.: Fazenda Boa Terra" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Região
          </label>
          <input data-field="regiao" value={ui.draft.regiao ?? ''} onChange={ui.updateDraft} placeholder="Ex.: Londrina, Norte do PR" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Telefone / contato
          </label>
          <input data-field="contato" value={ui.draft.contato ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Prazo para pagar (dias)
          </label>
          <input type="number" min="0" data-field="prazo" value={ui.draft.prazo ?? 0} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
          <div style={{ fontSize: "11px", color: "#6b7a6f", marginTop: "4px" }}>
            Vencimento das compras = coleta + prazo. 0 = à vista.
          </div>
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "6px", display: "block" }}>
            Produtos fornecidos{' '}
            <span style={{ color: "#6b7a6f", fontWeight: "400" }}>
              — {ui.qtdProdVinculados} selecionado(s)
            </span>
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {(ui.produtoCheckList || []).map((pc, k0) => (
              <Fragment key={k0}>
                <button onClick={pc.toggle} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: pc.bg, border: `1px solid ${pc.borda}`, borderRadius: "20px", padding: "7px 13px", fontSize: "12.5px", fontWeight: pc.peso, color: pc.fg, cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h13">
                  <span style={{ fontSize: "11px", color: "#1d7a3e", width: "9px" }}>
                    {pc.marca}
                  </span>
                  {pc.nome}{' '}
                  <span style={{ fontSize: "10.5px", color: "#6b7a6f" }}>
                    {pc.un}
                  </span>
                </button>
              </Fragment>
            ))}
          </div>
          {ui.semProdutoParaVincular ? (
            <>
              <div style={{ background: "#fbe7ea", border: "1px solid #f2c6cd", borderRadius: "9px", padding: "11px 13px", fontSize: "12.5px", color: "#b3283d" }}>
                Nenhum produto cadastrado ainda. Cadastre os produtos primeiro para poder vinculá-los a este fornecedor.
              </div>
            </>
          ) : null}
        </div>
        <div style={{ gridColumn: "1/-1", background: "#eef6ef", border: "1px solid #cfe3d3", borderRadius: "9px", padding: "10px 13px", fontSize: "12px", color: "#17642f" }}>
          <strong>
            Preço de compra
          </strong>
          ,{' '}
          <strong>
            variação
          </strong>
          ,{' '}
          <strong>
            última coleta
          </strong>
          {' '}e{' '}
          <strong>
            aproveitamento
          </strong>
          {' '}são calculados automaticamente a partir das Entradas (compras) deste fornecedor.
        </div>
      </div>
    </>
  );
}
