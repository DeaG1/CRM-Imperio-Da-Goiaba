// Não vem do design: cadastro/edição de usuário (Configurações → Usuários).
'use client';

import type { CSSProperties } from 'react';
import type { Vals } from '../types';

const label: CSSProperties = { fontSize: '11.5px', fontWeight: 600, color: '#4f5e54', marginBottom: '5px', display: 'block' };
const campo: CSSProperties = {
  width: '100%', padding: '9px 11px', border: '1px solid #d3dbcf', borderRadius: '8px', fontSize: '13px',
  fontFamily: "'Inter',sans-serif", color: '#16241b', background: '#fff', boxSizing: 'border-box',
};

export function UsuarioForm({ ui }: { ui: Vals }) {
  const novo = ui.usuarioNovo;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <div style={{ gridColumn: '1/-1' }}>
        <label style={label}>Nome</label>
        <input data-field="nome" value={ui.draft.nome ?? ''} onChange={ui.updateDraft} placeholder="Ex.: Maria Souza" style={campo} />
      </div>
      <div>
        <label style={label}>Usuário (para entrar)</label>
        <input data-field="usuario" value={ui.draft.usuario ?? ''} onChange={ui.updateDraft} disabled={!novo} autoComplete="off"
          placeholder="ex.: maria" style={{ ...campo, ...(novo ? {} : { background: '#f4f7f1', color: '#66756a' }) }} />
      </div>
      <div>
        <label style={label}>Perfil</label>
        <select data-field="role" value={ui.draft.role ?? 'colaborador'} onChange={ui.updateDraft} style={campo}>
          <option value="colaborador">Funcionário — entrada, saída e estoque</option>
          <option value="admin">Admin — acesso total</option>
        </select>
      </div>
      <div>
        <label style={label}>{novo ? 'Senha inicial' : 'Nova senha (opcional)'}</label>
        <input type="password" data-field="senha" value={ui.draft.senha ?? ''} onChange={ui.updateDraft} autoComplete="new-password"
          placeholder={novo ? 'mínimo 6 caracteres' : 'deixe em branco para manter'} style={campo} />
      </div>
      {!novo ? (
        <div>
          <label style={label}>Situação</label>
          <select data-field="ativo" value={ui.draft.ativo ?? 'sim'} onChange={ui.updateDraft} style={campo}>
            <option value="sim">Ativo</option>
            <option value="nao">Inativo (sem acesso)</option>
          </select>
        </div>
      ) : null}
      <div style={{ gridColumn: '1/-1', background: '#eef6ef', border: '1px solid #cfe3d3', borderRadius: '9px', padding: '10px 13px', fontSize: '12px', color: '#17642f' }}>
        {novo
          ? 'Passe o usuário e a senha inicial para a pessoa; ela pode trocar depois em "Minha senha".'
          : 'Desativar, trocar o perfil ou redefinir a senha encerra as sessões abertas dessa pessoa.'}
      </div>
    </div>
  );
}
