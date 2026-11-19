import { eq } from 'drizzle-orm';
import { registrar } from '@/server/audit';
import { getDb } from '@/server/db';
import { users } from '@/server/db/schema';
import { handle, HttpError, notFound, readJson } from '@/server/http';
import { hashPassword } from '@/server/password';
import { requireUser } from '@/server/session';
import { edicaoUsuario, encerrarSessoes, garantirOutroAdmin, publico } from '@/server/usuarios';

type Ctx = { params: Promise<{ id: string }> };

/** Edita nome, perfil, ativo e (opcional) redefine a senha. Não há exclusão: desative. */
export const PUT = handle(async (req: Request, ctx: Ctx) => {
  const quem = await requireUser(['admin']);
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id)) throw notFound();
  const d = edicaoUsuario.parse(await readJson(req));
  const db = await getDb();
  const [antes] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!antes) throw notFound('Usuário não encontrado.');
  if (id === quem.id && (!d.ativo || d.role !== 'admin')) {
    throw new HttpError(409, 'Você não pode desativar nem tirar o perfil de admin da sua própria conta.');
  }
  if (antes.role === 'admin' && antes.ativo && (!d.ativo || d.role !== 'admin')) await garantirOutroAdmin(db, id);
  const set: Partial<typeof users.$inferInsert> = { nome: d.nome, role: d.role, ativo: d.ativo };
  if (d.senha) set.senhaHash = await hashPassword(d.senha);
  const [depois] = await db.update(users).set(set).where(eq(users.id, id)).returning();
  // desativado, senha redefinida ou perfil trocado: derruba as sessões abertas dele
  if (id !== quem.id && (!d.ativo || d.senha || d.role !== antes.role)) await encerrarSessoes(db, id);
  await registrar(db, quem, 'usuarios', id, 'alterou', { ...publico(antes), senha: '' }, { ...publico(depois), senha: d.senha ? '(redefinida)' : '' });
  return Response.json(publico(depois));
});
