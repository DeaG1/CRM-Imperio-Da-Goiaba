/**
 * Utilitários de banco (rodar com `npm run db -- <comando>`):
 *   migrate            aplica as migrações pendentes
 *   seed               cria os usuários padrão (admin / funcionario) se não houver usuários
 *   demo               carrega os dados de exemplo do design (só em banco vazio)
 *   user:add <usuario> <senha> <admin|colaborador> [nome]
 *   user:senha <usuario> <nova-senha>
 *   user:desativar <usuario>
 *   user:list
 *   backup [arquivo.json]   exporta todos os dados (padrão: backups/backup-<data>.json)
 *   restore <arquivo.json>  APAGA os dados atuais e restaura o backup
 *   recalcular [entradas|pedidos] [--aplicar]
 *                      refaz o valor total pelos itens, com centavos (corrige o arredondamento
 *                      antigo para reais). Sem --aplicar só MOSTRA o que mudaria.
 *
 * Banco: DATABASE_URL do ambiente; senão, a de `.env.producao` (Supabase); senão, o PGlite
 * local (.data/pglite). Para forçar o local mesmo com `.env.producao`, use DATABASE_URL= vazio.
 */
try { process.loadEnvFile('.env.producao'); } catch { /* opcional */ }

import fs from 'node:fs';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { registrar } from '../src/server/audit';
import { exportar, importar } from '../src/server/backup';
import { getConn } from '../src/server/db';
import { entradas, pedidos, users } from '../src/server/db/schema';
import { totalItens } from '../src/shared/dinheiro';
import { ensureDefaultUsers, seedDemo } from '../src/server/db/seed';
import { hashPassword } from '../src/server/password';

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  // mostra em qual banco vai mexer (sem a senha)
  const alvo = process.env.DATABASE_URL
    ? 'PostgreSQL em ' + (process.env.DATABASE_URL.match(/@([^/:]+)/)?.[1] ?? '?')
    : 'PGlite local (' + (process.env.PGLITE_DIR || '.data/pglite') + ')';
  console.log(`banco: ${alvo}`);
  const conn = await getConn();
  const db = conn.db;
  try {
    switch (cmd) {
      case 'recalcular': {
        // corrige totais gravados antes da correção dos centavos (eram arredondados para reais)
        const aplicar = args.includes('--aplicar');
        const quais = args.filter((a) => !a.startsWith('--'));
        const tabelas = quais.length ? quais : ['entradas'];
        for (const nome of tabelas) {
          const t = nome === 'entradas' ? entradas : nome === 'pedidos' ? pedidos : null;
          if (!t) throw new Error(`tabela desconhecida: ${nome} (use entradas ou pedidos)`);
          const rows = await db.select().from(t);
          const mudar = rows
            .filter((r) => (r.itens || []).length)
            .map((r) => ({ r, novo: totalItens(r.itens) }))
            .filter(({ r, novo }) => Math.abs(novo - Number(r.valor)) > 0.001);
          const dif = mudar.reduce((s, m) => s + (m.novo - Number(m.r.valor)), 0);
          console.log(`\n${nome}: ${rows.length} registro(s), ${mudar.length} com valor arredondado (diferença total R$ ${dif.toFixed(2)})`);
          for (const { r, novo } of mudar) {
            const sit = 'pago' in r ? r.pago : r.pag;
            const quando = 'data' in r ? r.data : r.entrega;
            console.log(`  ${r.id}  ${quando}  R$ ${Number(r.valor).toFixed(2)} → R$ ${novo.toFixed(2)}  (${sit})`);
          }
          if (aplicar && mudar.length) {
            await db.transaction(async (tx) => {
              for (const { r, novo } of mudar) await tx.update(t).set({ valor: novo }).where(eq(t.id, r.id));
            });
            for (const { r, novo } of mudar) {
              await registrar(db, null, nome, r.id, 'alterou', { valor: Number(r.valor) }, { valor: novo });
            }
            console.log(`  ✓ ${mudar.length} valor(es) corrigido(s) e registrado(s) no histórico`);
          }
        }
        if (!aplicar) console.log('\n(simulação — nada foi gravado. Para aplicar: npm run db -- recalcular ' + tabelas.join(' ') + ' --aplicar)');
        break;
      }
      case 'migrate':
        await conn.migrate();
        console.log(`migrações aplicadas (${conn.kind})`);
        break;
      case 'seed':
        await conn.migrate();
        if (!(await ensureDefaultUsers(db, true))) console.log('já existem usuários — nada a fazer');
        break;
      case 'demo':
        await conn.migrate();
        await ensureDefaultUsers(db, true);
        await seedDemo(db);
        break;
      case 'user:add': {
        const [usuario, senha, role, ...nome] = args;
        if (!usuario || !senha || !['admin', 'colaborador'].includes(role)) {
          throw new Error('uso: user:add <usuario> <senha> <admin|colaborador> [nome]');
        }
        await db.insert(users).values({
          usuario: usuario.toLowerCase(), senhaHash: await hashPassword(senha),
          role: role as 'admin' | 'colaborador', nome: nome.join(' ') || usuario,
        });
        console.log(`usuário ${usuario} criado`);
        break;
      }
      case 'user:senha': {
        const [usuario, senha] = args;
        if (!usuario || !senha) throw new Error('uso: user:senha <usuario> <nova-senha>');
        const r = await db.update(users).set({ senhaHash: await hashPassword(senha) })
          .where(eq(users.usuario, usuario.toLowerCase())).returning({ id: users.id });
        console.log(r.length ? 'senha alterada' : 'usuário não encontrado');
        break;
      }
      case 'user:desativar': {
        const r = await db.update(users).set({ ativo: false })
          .where(eq(users.usuario, String(args[0] || '').toLowerCase())).returning({ id: users.id });
        console.log(r.length ? 'usuário desativado' : 'usuário não encontrado');
        break;
      }
      case 'backup': {
        await conn.migrate();
        const dados = await exportar(db);
        const arq = args[0] || path.join('backups', `backup-${dados.geradoEm.slice(0, 19).replace(/[:T]/g, '-')}.json`);
        fs.mkdirSync(path.dirname(path.resolve(arq)), { recursive: true });
        fs.writeFileSync(arq, JSON.stringify(dados));
        console.log(`backup gravado em ${arq}`);
        for (const [t, linhas] of Object.entries(dados.tabelas)) console.log(`  ${t}: ${linhas.length}`);
        break;
      }
      case 'restore': {
        if (!args[0]) throw new Error('uso: restore <arquivo.json>');
        await conn.migrate();
        const resumo = await importar(db, JSON.parse(fs.readFileSync(args[0], 'utf8')));
        console.log('backup restaurado (todas as sessões foram encerradas):');
        for (const [t, n] of Object.entries(resumo)) console.log(`  ${t}: ${n}`);
        break;
      }
      case 'user:list':
        console.table(await db.select({ usuario: users.usuario, nome: users.nome, role: users.role, ativo: users.ativo }).from(users));
        break;
      default:
        console.log('comandos: migrate | seed | demo | backup | restore | user:add | user:senha | user:desativar | user:list');
        process.exitCode = 1;
    }
  } finally {
    await conn.close();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
