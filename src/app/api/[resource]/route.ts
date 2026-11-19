/* eslint-disable @typescript-eslint/no-explicit-any */
import { registrar } from '@/server/audit';
import { getDb } from '@/server/db';
import { handle, readJson } from '@/server/http';
import { getResource } from '@/server/resources';
import { requireUser } from '@/server/session';

type Ctx = { params: Promise<{ resource: string }> };

/** Lista todos os registros do recurso. */
export const GET = handle(async (_req: Request, ctx: Ctx) => {
  const def = getResource((await ctx.params).resource);
  await requireUser(def.read);
  const db = await getDb();
  const rows = await db.select().from(def.table as any).orderBy(...def.order(def.table));
  return Response.json(rows.map(def.toClient));
});

/** Cria um registro. O id é gerado pelo banco. */
export const POST = handle(async (req: Request, ctx: Ctx) => {
  const nome = (await ctx.params).resource;
  const def = getResource(nome);
  const user = await requireUser(def.write);
  const db = await getDb();
  const values = await def.parse(await readJson(req), { user, db });
  const [row] = await db.insert(def.table).values(values as any).returning();
  await registrar(db, user, nome, (row as any).id, 'criou', null, row);
  return Response.json(def.toClient(row), { status: 201 });
});
