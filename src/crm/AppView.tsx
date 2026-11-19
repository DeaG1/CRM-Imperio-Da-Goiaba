// Baseado no design (Imperio da Goiaba CRM v2.dc.html) e mantido à mão: inclui a tela de Contas a pagar/receber.
'use client';

import type { Vals } from './types';
import { Dashboard } from './screens/Dashboard';
import { ClientesLista } from './screens/ClientesLista';
import { ClienteFicha } from './screens/ClienteFicha';
import { Saidas } from './screens/Saidas';
import { Entradas } from './screens/Entradas';
import { Fornecedores } from './screens/Fornecedores';
import { Produtos } from './screens/Produtos';
import { Estoque } from './screens/Estoque';
import { Funcionarios } from './screens/Funcionarios';
import { Bancos } from './screens/Bancos';
import { Veiculos } from './screens/Veiculos';
import { Financeiro } from './screens/Financeiro';
import { Contas } from './screens/Contas';
import { Configuracoes } from './screens/Configuracoes';
import { Relatorios } from './screens/Relatorios';
import { ModalShell } from './modals/ModalShell';
import { Login } from './Login';
import { Sidebar } from './layout/Sidebar';
import { Topbar } from './layout/Topbar';

export function AppView({ ui }: { ui: Vals }) {
  return (
    <>
      {ui.logged ? (
        <>
          <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", fontFamily: "'Inter',sans-serif", color: "#16241b", background: "#ffffff" }}>
            <Sidebar ui={ui} />
            <main style={{ flex: "1", display: "flex", flexDirection: "column", minWidth: "0", overflow: "hidden" }}>
              <Topbar ui={ui} />
              <div style={{ flex: "1", overflowY: "auto", padding: "26px 30px 60px", background: "#ffffff" }}>
                {ui.isDashboard ? <Dashboard ui={ui} /> : null}
                {ui.showClienteList ? <ClientesLista ui={ui} /> : null}
                {ui.showClienteDetail ? <ClienteFicha ui={ui} /> : null}
                {ui.isPedidos ? <Saidas ui={ui} /> : null}
                {ui.isEntradas ? <Entradas ui={ui} /> : null}
                {ui.isFornecedores ? <Fornecedores ui={ui} /> : null}
                {ui.isProdutos ? <Produtos ui={ui} /> : null}
                {ui.isEstoque ? <Estoque ui={ui} /> : null}
                {ui.isFuncionarios ? <Funcionarios ui={ui} /> : null}
                {ui.isBancos ? <Bancos ui={ui} /> : null}
                {ui.isVeiculos ? <Veiculos ui={ui} /> : null}
                {ui.isFinanceiro ? <Financeiro ui={ui} /> : null}
                {ui.isContas ? <Contas ui={ui} /> : null}
                {ui.isConfiguracoes ? <Configuracoes ui={ui} /> : null}
                {ui.isRelatorios ? <Relatorios ui={ui} /> : null}
              </div>
            </main>
            {ui.modalOpen ? <ModalShell ui={ui} /> : null}
          </div>
        </>
      ) : null}
      {ui.semLogin ? <Login ui={ui} /> : null}
    </>
  );
}
