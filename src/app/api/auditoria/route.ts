import { and, desc, eq, type SQL } from 'drizzle-orm';
import { getDb } from '@/server/db';
import { auditoria } from '@/server/db/schema';
import { handle } from '@/server/http';
import { requireUser } from '@/server/session';

/** Histórico de alterações (mais recente primeiro). Filtros: ?recurso=&registro=&limite= */
export const GET = handle(async (req: Request) => {
  await requireUser(['admin']);
  const url = new URL(req.url);
  const recurso = url.searchParams.get('recurso');
  const registro = url.searchParams.get('registro');
  const limite = Math.min(Math.max(Number(url.searchParams.get('limite')) || 200, 1), 1000);
  const filtros: SQL[] = [];
  if (recurso) filtros.push(eq(auditoria.recurso, recurso));
  if (registro) filtros.push(eq(auditoria.registroId, registro));
  const db = await getDb();
  const rows = await db.select().from(auditoria)
    .where(filtros.length ? and(...filtros) : undefined)
    .orderBy(desc(auditoria.quando), desc(auditoria.id)).limit(limite);
  return Response.json(rows.map((r) => ({ ...r, quando: r.quando instanceof Date ? r.quando.toISOString() : r.quando })));
});
