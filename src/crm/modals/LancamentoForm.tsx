// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function LancamentoForm({ ui }: { ui: Vals }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Data do lançamento
          </label>
          <input type="date" data-field="data" value={ui.draft.data ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Categoria
          </label>
          <select data-field="categoria" value={ui.draft.categoria ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            {(ui.lancCategorias || []).map((o, k0) => (
              <Fragment key={k0}>
                <option value={o}>
                  {o}
                </option>
              </Fragment>
            ))}
          </select>
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Descrição
          </label>
          <input data-field="descricao" value={ui.draft.descricao ?? ''} onChange={ui.updateDraft} placeholder="Ex.: troca de óleo do caminhão" style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Valor (R$)
          </label>
          <input type="number" step="0.01" data-field="valor" value={ui.draft.valor ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", color: "#16241b", background: "#fff", boxSizing: "border-box", textAlign: "right" }} />
        </div>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
            Funcionário (opcional)
          </label>
          <select data-field="funcionarioId" value={ui.draft.funcionarioId ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
            <option value="">
              —
            </option>
            {(ui.funcionarioOptions || []).map((o, k0) => (
              <Fragment key={k0}>
                <option value={o.id}>
                  {o.nome}
                </option>
              </Fragment>
            ))}
          </select>
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
        {ui.lancTemVeiculo ? (
          <>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: "11.5px", fontWeight: "600", color: "#4f5e54", marginBottom: "5px", display: "block" }}>
                Veículo
              </label>
              <select data-field="veiculoId" value={ui.draft.veiculoId ?? ''} onChange={ui.updateDraft} style={{ width: "100%", padding: "9px 11px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "13px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#fff", boxSizing: "border-box" }}>
                <option value="">
                  —
                </option>
                {(ui.veiculoOptions || []).map((o, k0) => (
                  <Fragment key={k0}>
                    <option value={o.id}>
                      {o.nome}
                    </option>
                  </Fragment>
                ))}
              </select>
            </div>
          </>
        ) : null}
        <div style={{ gridColumn: "1/-1", background: "#ffffff", borderRadius: "9px", padding: "10px 13px", fontSize: "12px", color: "#4f5e54", lineHeight: "1.5" }}>
          O lançamento entra no{' '}
          <strong>
            total de custos
          </strong>
          {' '}do período, no{' '}
          <strong>
            relatório de lançamentos
          </strong>
          {' '}e — quando vinculado a um funcionário — desconta do{' '}
          <strong>
            a pagar
          </strong>
          {' '}dele.
        </div>
      </div>
    </>
  );
}
