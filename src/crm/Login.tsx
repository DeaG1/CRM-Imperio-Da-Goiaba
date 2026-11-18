// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import type { Vals } from './types';

export function Login({ ui }: { ui: Vals }) {
  return (
    <>
      <div data-screen-label="Login" style={{ minHeight: "100vh", width: "100%", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", background: "#ffffff", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 56px", background: "radial-gradient(60% 55% at 50% 45%, #1f4a2a 0%, #13291b 55%, #0b1d12 100%)" }}>
          <div style={{ position: "absolute", left: "50%", top: "45%", width: "420px", height: "420px", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(227,180,66,0.16) 0%, rgba(227,180,66,0) 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: "50%", top: "45%", width: "520px", height: "520px", transform: "translate(-50%,-50%)", borderRadius: "50%", boxShadow: "inset 0 0 0 1px rgba(227,180,66,0.10)", pointerEvents: "none" }} />
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "20px", maxWidth: "440px" }}>
            <div style={{ width: "180px", height: "180px", borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 1px #3d5a47, 0 0 0 8px #0b1d12, 0 0 0 9px rgba(227,180,66,0.5), 0 24px 60px rgba(0,0,0,0.55)" }}>
              <img src="/assets/imperio-logo.png" alt="Império da Goiaba" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <h1 style={{ margin: "0", color: "#f4f1e4", fontSize: "40px", fontWeight: "500", letterSpacing: "-0.02em", lineHeight: "1.1" }}>
              Império da Goiaba
            </h1>
            <p style={{ margin: "0", color: "#c8d6cb", fontSize: "16px", lineHeight: "1.55", textWrap: "pretty" }}>
              Vendas, estoque, caixa e equipe do hortifruti num lugar só.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "48px 72px", borderLeft: "1px solid #e7ece3" }}>
          <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <h2 style={{ margin: "0", fontSize: "26px", fontWeight: "500", letterSpacing: "-0.015em", color: "#16241b" }}>
                Entrar
              </h2>
              <p style={{ margin: "0", color: "#5a6a5f", fontSize: "14px" }}>
                Escolha o perfil e informe a senha.
              </p>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#2c3a31" }}>
                Perfil de acesso
              </span>
              <select value={ui.loginRole ?? ''} onChange={ui.setLoginRole} style={{ height: "42px", padding: "0 10px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "14px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#ffffff" }}>
                <option value="admin">
                  Admin — acesso total
                </option>
                <option value="colaborador">
                  Funcionário — entrada, saída e estoque
                </option>
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#2c3a31" }}>
                Senha
              </span>
              <input type="password" value={ui.loginPass ?? ''} onChange={ui.setLoginPass} onKeyDown={ui.loginOnKey} placeholder="Qualquer senha entra no protótipo" style={{ height: "42px", padding: "0 12px", border: "1px solid #d3dbcf", borderRadius: "8px", fontSize: "14px", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#ffffff" }} />
            </label>
            <button onClick={ui.doLogin} style={{ height: "44px", marginTop: "4px", background: "#1d7a3e", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }} className="h5">
              Entrar no sistema
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
