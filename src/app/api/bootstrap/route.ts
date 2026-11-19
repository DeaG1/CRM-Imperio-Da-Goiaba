/* eslint-disable @typescript-eslint/no-explicit-any */
import { asc } from 'drizzle-orm';
import { lerConfig } from '@/server/config';
import { getDb } from '@/server/db';
import { users } from '@/server/db/schema';
import { handle } from '@/server/http';
import { resources } from '@/server/resources';
import { requireUser } from '@/server/session';
import { publico } from '@/server/usuarios';

/**
 * Carga inicial da interface: usuário logado, configurações e todas as coleções
 * que o perfil pode ler (as demais vêm vazias).
 */
export const GET = handle(async () => {
  const user = await requireUser();
  const db = await getDb();
  const data: Record<string, unknown> = {};
  for (const [nome, def] of Object.entries(resources)) {
    if (!def.read.includes(user.role)) { data[nome] = []; continue; }
    const rows = await db.select().from(def.table as any).orderBy(...def.order(def.table));
    data[nome] = rows.map(def.toClient);
  }
  data.usuarios = user.role === 'admin' ? (await db.select().from(users).orderBy(asc(users.id))).map(publico) : [];
  return Response.json({ user, config: await lerConfig(db), data });
});
