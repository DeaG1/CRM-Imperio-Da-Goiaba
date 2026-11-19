// Não vem do design: troca da própria senha.
'use client';

import type { CSSProperties } from 'react';
import type { Vals } from '../types';

const label: CSSProperties = { fontSize: '11.5px', fontWeight: 600, color: '#4f5e54', marginBottom: '5px', display: 'block' };
const campo: CSSProperties = {
  width: '100%', padding: '9px 11px', border: '1px solid #d3dbcf', borderRadius: '8px', fontSize: '13px',
  fontFamily: "'Inter',sans-serif", color: '#16241b', background: '#fff', boxSizing: 'border-box',
};

export function SenhaForm({ ui }: { ui: Vals }) {
  const naoConfere = !!ui.draft.confirma && ui.draft.confirma !== ui.draft.nova;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={label}>Senha atual</label>
        <input type="password" data-field="atual" value={ui.draft.atual ?? ''} onChange={ui.updateDraft} autoComplete="current-password" style={campo} />
      </div>
      <div>
        <label style={label}>Nova senha</label>
        <input type="password" data-field="nova" value={ui.draft.nova ?? ''} onChange={ui.updateDraft} autoComplete="new-password" placeholder="mínimo 6 caracteres" style={campo} />
      </div>
      <div>
        <label style={label}>Repita a nova senha</label>
        <input type="password" data-field="confirma" value={ui.draft.confirma ?? ''} onChange={ui.updateDraft} autoComplete="new-password"
          style={{ ...campo, borderColor: naoConfere ? '#d6334a' : '#d3dbcf' }} />
        {naoConfere ? <div style={{ fontSize: '11.5px', color: '#b3283d', marginTop: '4px' }}>As senhas não conferem.</div> : null}
      </div>
    </div>
  );
}
