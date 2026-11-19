/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from 'drizzle-orm';
import { registrar } from '@/server/audit';
import { getDb, type Db } from '@/server/db';
import { handle, HttpError, notFound, readJson } from '@/server/http';
import { getResource, parseId } from '@/server/resources';
import { requireUser } from '@/server/session';

type Ctx = { params: Promise<{ resource: string; id: string }> };

async function target(ctx: Ctx) {
  const p = await ctx.params;
  const def = getResource(p.resource);
  return { def, id: parseId(def, p.id), nome: p.resource };
}

const codigoDb = (e: any): string | undefined => e?.code ?? e?.cause?.code;

export const GET = handle(async (_req: Request, ctx: Ctx) => {
  const { def, id } = await target(ctx);
  await requireUser(def.read);
  const db = await getDb();
  const [row] = await db.select().from(def.table as any).where(eq(def.table.id, id)).limit(1);
  if (!row) throw notFound();
  return Response.json(def.toClient(row));
});

/** Atualiza o registro inteiro (o corpo é o formulário completo da interface). */
export const PUT = handle(async (req: Request, ctx: Ctx) => {
  const { def, id, nome } = await target(ctx);
  const user = await requireUser(def.write);
  const db = await getDb();
  const [existing] = await db.select().from(def.table as any).where(eq(def.table.id, id)).limit(1);
  if (!existing) throw notFound();
  const values = await def.parse(await readJson(req), { user, db, existing });
  // atualização + propagação (ex.: renomear cliente atualiza os pedidos) numa transação só
  const row = await db.transaction(async (tx) => {
    const [r] = await tx.update(def.table).set(values as any).where(eq(def.table.id, id)).returning();
    if (def.afterUpdate) await def.afterUpdate(tx as unknown as Db, existing, r);
    return r;
  });
  await registrar(db, user, nome, id, 'alterou', existing, row);
  return Response.json(def.toClient(row));
});

export const DELETE = handle(async (_req: Request, ctx: Ctx) => {
  const { def, id, nome } = await target(ctx);
  const user = await requireUser(def.remove);
  const db = await getDb();
  if (def.beforeDelete) await def.beforeDelete(db, id);
  try {
    const rows = await db.delete(def.table).where(eq(def.table.id, id)).returning();
    if (!rows.length) throw notFound();
    await registrar(db, user, nome, id, 'excluiu', rows[0], null);
  } catch (e) {
    // 23503 = foreign key; 23001 = RESTRICT (vínculos que impedem exclusão)
    if ((codigoDb(e) === '23503' || codigoDb(e) === '23001') && def.emUso) throw new HttpError(409, def.emUso);
    throw e;
  }
  return Response.json({ ok: true });
});
