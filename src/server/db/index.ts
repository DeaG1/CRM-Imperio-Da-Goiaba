/**
 * Conexão com o banco — três modos:
 *
 * 1. **Cloudflare Workers** (produção): binding `HYPERDRIVE` → Postgres (Supabase).
 *    Workers não deixam reaproveitar conexões entre requisições, então cada
 *    requisição abre a sua (o Hyperdrive mantém o pool do lado da Cloudflare).
 *    Migrações NÃO rodam aqui: use `npm run db:migrate` antes do deploy.
 * 2. **`DATABASE_URL`** (comandos `npm run db…`, ou servidor Node comum): driver `pg`.
 * 3. **Sem nada configurado** (desenvolvimento): PGlite, Postgres embutido em
 *    `PGLITE_DIR` (padrão `.data/pglite`). Carregado só quando usado, para não
 *    entrar no pacote do Worker.
 *
 * Nos modos 2 e 3, `getDb()` aplica as migrações pendentes na primeira chamada
 * (desligue com `DB_AUTO_MIGRATE=false`) e, no PGlite, cria os usuários padrão.
 */
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';
import * as schema from './schema';

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

type Conn = { db: Db; kind: 'postgres' | 'pglite'; migrate: () => Promise<void>; close: () => Promise<void> };

const g = globalThis as unknown as { __crmConn?: Promise<Conn>; __crmReady?: Promise<Db> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const semEmpacotar = (modulo: string): Promise<any> => import(/* webpackIgnore: true */ /* turbopackIgnore: true */ modulo);

const MIGRATIONS = () => path.join(/* turbopackIgnore: true */ process.cwd(), 'drizzle');

/** SSL para Postgres remoto (Supabase etc.); local e Hyperdrive dispensam. */
function sslPara(url: string) {
  if (/sslmode=/.test(url)) return undefined; // a própria URL decide
  if (/@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url)) return false;
  return { rejectUnauthorized: false };
}

async function connect(): Promise<Conn> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const pool = new Pool({ connectionString: url, max: Number(process.env.DB_POOL_MAX || 5), ssl: sslPara(url) });
    const db = drizzlePg(pool, { schema });
    return {
      db: db as unknown as Db,
      kind: 'postgres',
      migrate: async () => {
        const { migrate } = await import('drizzle-orm/node-postgres/migrator');
        await migrate(db, { migrationsFolder: MIGRATIONS() });
      },
      close: () => pool.end(),
    };
  }
  // desenvolvimento: Postgres embutido. O nome do módulo vem de variável para o
  // empacotador e o rastreador do build NÃO incluírem o PGlite (vários MB) no Worker.
  const fs = await import('node:fs');
  const { PGlite } = await semEmpacotar('@electric-sql/pglite');
  const { drizzle: drizzlePglite } = await semEmpacotar('drizzle-orm/pglite');
  const dir = process.env.PGLITE_DIR || path.join(/* turbopackIgnore: true */ process.cwd(), '.data', 'pglite');
  fs.mkdirSync(/* turbopackIgnore: true */ path.dirname(dir), { recursive: true });
  const client = new PGlite(dir);
  const db = drizzlePglite(client, { schema });
  return {
    db: db as unknown as Db,
    kind: 'pglite',
    migrate: async () => {
      const { migrate } = await semEmpacotar('drizzle-orm/pglite/migrator');
      await migrate(db, { migrationsFolder: MIGRATIONS() });
    },
    close: () => client.close(),
  };
}

/** Conexão persistente (modos 2 e 3). Os comandos `npm run db…` usam direto. */
export function getConn(): Promise<Conn> {
  // reaproveita entre recargas do `next dev` (o PGlite não aceita dois donos)
  if (!g.__crmConn) g.__crmConn = connect();
  return g.__crmConn;
}

// ---------------------------------------------------------------- Cloudflare (Hyperdrive)
type CfEnv = { HYPERDRIVE?: { connectionString: string } };

function dbHyperdrive(): Db | null {
  let cf: { env: CfEnv } | null = null;
  try {
    cf = getCloudflareContext() as unknown as { env: CfEnv };
  } catch {
    return null; // fora do Worker (next dev, next start, scripts)
  }
  const url = cf?.env?.HYPERDRIVE?.connectionString;
  if (!url) return null;
  // Um pool novo a cada chamada, nunca compartilhado entre requisições: no Worker, a
  // conexão aberta numa requisição é fechada pelo runtime quando ela termina, e
  // compartilhar travava as simultâneas ("This socket has been closed"). Dentro da
  // chamada a conexão é reaproveitada (máx. 2: uma transação + uma consulta). O pool
  // de verdade fica no Hyperdrive.
  const pool = new Pool({ connectionString: url, max: 2 });
  // fim da requisição: o runtime fecha os sockets ociosos — esperado, não é erro
  pool.on('error', () => {});
  return drizzlePg(pool, { schema }) as unknown as Db;
}

/** Banco pronto para uso. */
export function getDb(): Promise<Db> {
  const cf = dbHyperdrive();
  if (cf) return Promise.resolve(cf);
  if (!g.__crmReady) {
    g.__crmReady = (async () => {
      const conn = await getConn();
      if (process.env.DB_AUTO_MIGRATE !== 'false') await conn.migrate();
      if (conn.kind === 'pglite') {
        const { ensureDefaultUsers } = await import('./seed');
        await ensureDefaultUsers(conn.db);
      }
      return conn.db;
    })().catch((e) => {
      g.__crmReady = undefined;
      throw e;
    });
  }
  return g.__crmReady;
}

export { schema };
