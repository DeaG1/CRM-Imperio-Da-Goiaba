// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import type { Vals } from '../types';
import { ClienteForm } from './ClienteForm';
import { PedidoForm } from './PedidoForm';
import { FornecedorForm } from './FornecedorForm';
import { ProdutoForm } from './ProdutoForm';
import { EntradaForm } from './EntradaForm';
import { LancamentoForm } from './LancamentoForm';
import { DiariaForm } from './DiariaForm';
import { BancoForm } from './BancoForm';
import { VeiculoForm } from './VeiculoForm';
import { FuncionarioForm } from './FuncionarioForm';
import { PerdaForm } from './PerdaForm';
import { PagamentoForm } from './PagamentoForm';

export function ModalShell({ ui }: { ui: Vals }) {
  return (
    <>
      <div onClick={ui.closeModalBackdrop} style={{ position: "fixed", inset: "0", background: "rgba(20,25,18,0.48)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "50", padding: "24px" }}>
        <div onClick={ui.stopProp} style={{ background: "#ffffff", borderRadius: "16px", width: ui.modalWidth, maxWidth: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 70px rgba(0,0,0,0.35)", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #e7ece3", display: "flex", alignItems: "center", gap: "12px", background: "#fff" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#e3b341" }} />
            <div style={{ flex: "1", fontFamily: "'Inter',sans-serif", fontWeight: "700", fontSize: "17px", color: "#0f2a18" }}>
              {ui.modalTitle}
            </div>
            <button onClick={ui.closeModal} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e7ece3", background: "#fff", cursor: "pointer", fontSize: "16px", color: "#66756a", lineHeight: "1" }} className="h4">
              ✕
            </button>
          </div>
          <div style={{ flex: "1", overflowY: "auto", padding: "22px 24px" }}>
            {ui.modalCliente ? <ClienteForm ui={ui} /> : null}
            {ui.modalPedido ? <PedidoForm ui={ui} /> : null}
            {ui.modalFornecedor ? <FornecedorForm ui={ui} /> : null}
            {ui.modalProduto ? <ProdutoForm ui={ui} /> : null}
            {ui.modalEntrada ? <EntradaForm ui={ui} /> : null}
            {ui.modalLancamento ? <LancamentoForm ui={ui} /> : null}
            {ui.modalDiaria ? <DiariaForm ui={ui} /> : null}
            {ui.modalBanco ? <BancoForm ui={ui} /> : null}
            {ui.modalVeiculo ? <VeiculoForm ui={ui} /> : null}
            {ui.modalFuncionario ? <FuncionarioForm ui={ui} /> : null}
            {ui.modalPerda ? <PerdaForm ui={ui} /> : null}
            {ui.modalPagamento ? <PagamentoForm ui={ui} /> : null}
          </div>
          <div style={{ padding: "15px 24px", borderTop: "1px solid #e7ece3", display: "flex", alignItems: "center", gap: "10px", background: "#fff" }}>
            {ui.isEditing ? (
              <>
                <button onClick={ui.deleteFromModal} style={{ background: "#fff", color: "#d6334a", border: "1px solid #f2c6cd", borderRadius: "9px", padding: "9px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h7">
                  Excluir
                </button>
              </>
            ) : null}
            <div style={{ flex: "1" }} />
            <button onClick={ui.closeModal} style={{ background: "#fff", color: "#2c3a31", border: "1px solid #d3dbcf", borderRadius: "9px", padding: "9px 18px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h4">
              Cancelar
            </button>
            <button onClick={ui.saveDraft} style={{ background: "#1d7a3e", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 22px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h5">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
