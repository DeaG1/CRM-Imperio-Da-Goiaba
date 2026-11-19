import { asc } from 'drizzle-orm';
import { registrar } from '@/server/audit';
import { getDb } from '@/server/db';
import { users } from '@/server/db/schema';
import { handle, HttpError, readJson } from '@/server/http';
import { hashPassword } from '@/server/password';
import { requireUser } from '@/server/session';
import { novoUsuario, publico } from '@/server/usuarios';

export const GET = handle(async () => {
  await requireUser(['admin']);
  const db = await getDb();
  const rows = await db.select().from(users).orderBy(asc(users.id));
  return Response.json(rows.map(publico));
});

export const POST = handle(async (req: Request) => {
  const quem = await requireUser(['admin']);
  const d = novoUsuario.parse(await readJson(req));
  const db = await getDb();
  try {
    const [u] = await db.insert(users).values({ nome: d.nome, usuario: d.usuario, role: d.role, senhaHash: await hashPassword(d.senha) }).returning();
    await registrar(db, quem, 'usuarios', u.id, 'criou', null, publico(u));
    return Response.json(publico(u), { status: 201 });
  } catch (e) {
    const code = (e as { code?: string; cause?: { code?: string } })?.cause?.code ?? (e as { code?: string })?.code;
    if (code === '23505') throw new HttpError(409, 'Esse nome de usuário já existe.');
    throw e;
  }
});
