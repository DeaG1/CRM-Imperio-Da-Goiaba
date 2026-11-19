import { exportar } from '@/server/backup';
import { getDb } from '@/server/db';
import { handle } from '@/server/http';
import { requireUser } from '@/server/session';

/** Baixa o backup completo (JSON). Restaurar: `npm run db -- restore <arquivo>`. */
export const GET = handle(async () => {
  await requireUser(['admin']);
  const dados = await exportar(await getDb());
  const nome = `backup-imperio-${dados.geradoEm.slice(0, 19).replace(/[:T]/g, '-')}.json`;
  return new Response(JSON.stringify(dados), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="${nome}"`,
      'cache-control': 'no-store',
    },
  });
});
