import { registrar } from '@/server/audit';
import { lerConfig, salvarConfig } from '@/server/config';
import { getDb } from '@/server/db';
import { handle, readJson } from '@/server/http';
import { requireUser } from '@/server/session';

export const GET = handle(async () => {
  await requireUser();
  return Response.json(await lerConfig(await getDb()));
});

/** Atualiza metas, listas e dados da empresa (só admin). */
export const PUT = handle(async (req: Request) => {
  const quem = await requireUser(['admin']);
  const db = await getDb();
  const { antes, depois } = await salvarConfig(db, await readJson(req), quem.nome);
  await registrar(db, quem, 'configuracoes', 1, 'alterou', { ...antes.metas, rotas: antes.rotas, empresa: antes.empresa.nome }, { ...depois.metas, rotas: depois.rotas, empresa: depois.empresa.nome });
  return Response.json(depois);
});
