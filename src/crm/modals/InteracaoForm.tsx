// Não vem do design: registro de interações com o cliente (substitui o histórico fixo do protótipo).
'use client';

import type { CSSProperties } from 'react';
import type { Vals } from '../types';

const label: CSSProperties = { fontSize: '11.5px', fontWeight: 600, color: '#4f5e54', marginBottom: '5px', display: 'block' };
const campo: CSSProperties = {
  width: '100%', padding: '9px 11px', border: '1px solid #d3dbcf', borderRadius: '8px', fontSize: '13px',
  fontFamily: "'Inter',sans-serif", color: '#16241b', background: '#fff', boxSizing: 'border-box',
};

export function InteracaoForm({ ui }: { ui: Vals }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <div>
        <label style={label}>Data</label>
        <input type="date" data-field="data" value={ui.draft.data ?? ''} onChange={ui.updateDraft} style={campo} />
      </div>
      <div>
        <label style={label}>Tipo</label>
        <select data-field="tipo" value={ui.draft.tipo ?? ''} onChange={ui.updateDraft} style={campo}>
          {ui.tiposInteracao.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <label style={label}>O que aconteceu</label>
        <textarea
          data-field="texto"
          value={ui.draft.texto ?? ''}
          onChange={ui.updateDraft}
          rows={4}
          placeholder="Ex.: Conferência de gôndola; cliente pediu mais folhosas na próxima entrega."
          style={{ ...campo, resize: 'vertical' }}
        />
      </div>
      <div style={{ gridColumn: '1/-1', background: '#eef6ef', border: '1px solid #cfe3d3', borderRadius: '9px', padding: '10px 13px', fontSize: '12px', color: '#17642f' }}>
        Fica no <strong>histórico de interações</strong> da ficha, com o seu nome como autor.
      </div>
    </div>
  );
}
