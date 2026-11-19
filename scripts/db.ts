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
 *
 * Banco: DATABASE_URL do ambiente; senão, a de `.env.producao` (Supabase); senão, o PGlite
 * local (.data/pglite). Para forçar o local mesmo com `.env.producao`, use DATABASE_URL= vazio.
 */
try { process.loadEnvFile('.env.producao'); } catch { /* opcional */ }

import fs from 'node:fs';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { exportar, importar } from '../src/server/backup';
import { getConn } from '../src/server/db';
import { users } from '../src/server/db/schema';
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
