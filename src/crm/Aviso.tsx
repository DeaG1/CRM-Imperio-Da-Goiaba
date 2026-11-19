'use client';

/** Aviso flutuante (erros da API e confirmações). */
export function Aviso({ texto, tipo, onClose }: { texto: string; tipo: 'erro' | 'ok'; onClose: () => void }) {
  const erro = tipo === 'erro';
  return (
    <div
      role={erro ? 'alert' : 'status'}
      style={{
        position: 'fixed', right: 24, bottom: 24, zIndex: 100, maxWidth: 420,
        display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px 12px 16px',
        background: erro ? '#fbe7ea' : '#e7f1e8', color: erro ? '#b3283d' : '#17642f',
        border: `1px solid ${erro ? '#f2c6cd' : '#cfe3d3'}`, borderRadius: 11,
        boxShadow: '0 12px 32px rgba(15,42,24,0.16)', fontFamily: "'Inter',sans-serif", fontSize: 13.5, fontWeight: 500,
      }}
    >
      <span style={{ flex: 1, lineHeight: 1.45 }}>{texto}</span>
      <button
        onClick={onClose}
        aria-label="Fechar aviso"
        style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 2 }}
      >
        ✕
      </button>
    </div>
  );
}

/** Tela enquanto a sessão e os dados carregam. */
export function Carregando() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f2a18', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, color: '#a9c2ae', fontSize: 13 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(227,180,66,0.5)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/imperio-logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        Carregando…
      </div>
    </div>
  );
}
