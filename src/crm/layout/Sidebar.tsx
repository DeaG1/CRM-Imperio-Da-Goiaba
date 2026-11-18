// Gerado a partir do design (Imperio da Goiaba CRM v2.dc.html) por scripts/convert-design.mjs.
'use client';

import { Fragment } from 'react';
import type { Vals } from '../types';

export function Sidebar({ ui }: { ui: Vals }) {
  return (
    <>
      <aside style={{ width: "248px", flex: "0 0 248px", background: "#0f2a18", color: "#eef2ea", display: "flex", flexDirection: "column", padding: "0" }}>
        <div style={{ padding: "24px 22px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", flex: "0 0 44px", boxShadow: "0 0 0 1px rgba(227,180,66,0.5)" }}>
            <img src="/assets/imperio-logo.png" alt="Império da Goiaba" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ lineHeight: "1.1" }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: "600", fontSize: "15px", letterSpacing: "-0.2px" }}>
              Império da Goiaba
            </div>
            <div style={{ fontSize: "11px", color: "#a9c2ae", letterSpacing: "0.3px" }}>
              Gestão da operação
            </div>
          </div>
        </div>
        <nav style={{ flex: "1", padding: "14px 12px", display: "flex", flexDirection: "column", gap: "3px", overflowY: "auto" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1px", color: "#7d9c86", padding: "8px 12px 4px" }}>
            OPERAÇÃO
          </div>
          {(ui.navItems || []).map((n, k0) => (
            <Fragment key={k0}>
              <button onClick={n.onClick} style={{ display: "flex", alignItems: "center", gap: "11px", width: "100%", textAlign: "left", border: "none", cursor: "pointer", padding: "10px 12px", borderRadius: "9px", fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: n.weight, background: n.bg, color: n.fg, transition: "background .12s" }} className="h1">
                <span style={{ width: "7px", height: "7px", borderRadius: "2px", background: n.dot, flex: "0 0 7px" }} />
                <span style={{ flex: "1" }}>
                  {n.label}
                </span>
                {n.badge ? (
                  <>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: "11px", background: "rgba(255,255,255,0.12)", padding: "1px 7px", borderRadius: "20px", color: "#cfe0d2" }}>
                      {n.badge}
                    </span>
                  </>
                ) : null}
              </button>
            </Fragment>
          ))}
        </nav>
        <div style={{ padding: "14px 16px 10px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ lineHeight: "1.2", fontSize: "12px" }}>
            <div style={{ fontWeight: "600", color: "#eef2ea" }}>
              {ui.roleName}
            </div>
            <div style={{ color: "#a9c2ae", fontSize: "11px" }}>
              {ui.roleSub}
            </div>
          </div>
        </div>
        <div style={{ padding: "0 16px 14px" }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", borderRadius: "9px", padding: "3px", gap: "3px" }}>
            <button onClick={ui.setRoleAdmin} style={{ flex: "1", border: "none", borderRadius: "7px", padding: "7px 0", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.roleAdminBg, color: ui.roleAdminFg }}>
              Admin
            </button>
            <button onClick={ui.setRoleColab} style={{ flex: "1", border: "none", borderRadius: "7px", padding: "7px 0", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter',sans-serif", background: ui.roleColabBg, color: ui.roleColabFg }}>
              Funcionário
            </button>
          </div>
          <button onClick={ui.logout} style={{ width: "100%", marginTop: "8px", border: "1px solid rgba(255,255,255,0.16)", background: "transparent", color: "#a9c2ae", borderRadius: "8px", padding: "7px 0", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter',sans-serif" }} className="h2">
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}
