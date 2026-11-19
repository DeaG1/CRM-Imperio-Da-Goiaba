// Não vem do design: baixa única para receber venda, pagar compra e pagar conta (diária/custo).
// Toda baixa informa data, forma e a conta (banco ou caixa) por onde o dinheiro passou.
'use client';

import type { CSSProperties } from 'react';
import type { Vals } from '../types';

const label: CSSProperties = { fontSize: '11.5px', fontWeight: 600, color: '#4f5e54', marginBottom: '5px', display: 'block' };
const campo: CSSProperties = {
  width: '100%', padding: '9px 11px', border: '1px solid #d3dbcf', borderRadius: '8px', fontSize: '13px',
  fontFamily: "'Inter',sans-serif", color: '#16241b', background: '#fff', boxSizing: 'border-box',
};
const FORMAS = ['PIX', 'Boleto', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Transferência', 'Prazo'];

export function BaixaForm({ ui }: { ui: Vals }) {
  const receber = ui.baixaRecebimento;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={label}>{receber ? 'Data do recebimento' : 'Data do pagamento'}</label>
        <input type="date" data-field="dataPag" value={ui.draft.dataPag ?? ''} onChange={ui.updateDraft} style={campo} />
      </div>
      <div>
        <label style={label}>Forma</label>
        <select data-field="forma" value={ui.draft.forma ?? 'PIX'} onChange={ui.updateDraft} style={campo}>
          {FORMAS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label style={label}>{receber ? 'Conta que recebeu' : 'Conta de onde saiu'}</label>
        <select data-field="bancoId" value={ui.draft.bancoId ?? ''} onChange={ui.updateDraft} style={campo}>
          <option value="">Caixa (dinheiro, sem banco)</option>
          {(ui.bancoOptions || []).map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
        </select>
      </div>
      <div style={{ background: '#eef6ef', border: '1px solid #cfe3d3', borderRadius: '9px', padding: '10px 13px', fontSize: '12px', color: '#17642f', lineHeight: 1.5 }}>
        {receber ? (
          <>Ao salvar, a venda fica <strong>Paga</strong>, o valor <strong>entra no saldo da conta</strong> escolhida e os dias até o recebimento alimentam o ciclo de caixa.</>
        ) : (
          <>Ao salvar, fica <strong>Paga</strong>, o valor <strong>sai do saldo da conta</strong> escolhida e entra no fluxo de caixa na data do pagamento.</>
        )}
      </div>
    </div>
  );
}
