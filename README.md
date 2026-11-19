# Império da Goiaba — CRM (Next.js)

CRM do hortifruti: vendas, compras, estoque, financeiro, equipe e frota. A interface vem do design
**`Imperio da Goiaba CRM v2.dc.html`** (pasta `../Design-Goiaba`). O backend está no próprio
Next.js (Route Handlers) e grava em PostgreSQL.

## Rodar

```bash
npm install
npm run db:demo   # opcional: tabelas + usuários + dados de exemplo do design
npm run dev       # http://localhost:3000
```

Sem `DATABASE_URL`, o app usa o **PGlite**, um Postgres embutido que grava em `.data/pglite`.
Não precisa instalar nada. As migrações rodam sozinhas na primeira requisição e, com o banco
vazio, são criados os usuários padrão:

| usuário       | senha      | perfil                                     |
| ------------- | ---------- | ------------------------------------------ |
| `admin`       | `admin123` | acesso total                               |
| `funcionario` | `func123`  | entradas, saídas, estoque e perdas         |

**Troque essas senhas**: menu lateral → *Minha senha* (ou Configurações → Usuários). Também dá
para defini-las antes do primeiro uso com `SEED_ADMIN_PASSWORD` / `SEED_FUNC_PASSWORD`.

> O PGlite aceita um processo por vez. Pare o `npm run dev` antes de rodar os comandos `npm run db…`.

### Produção: Cloudflare Workers + Supabase

O app roda no **Cloudflare Workers** (adaptador OpenNext) numa conta Cloudflare própria (subdomínio **`gestao-crm.workers.dev`**)
— endereço `https://<nome-do-worker>.gestao-crm.workers.dev` (nome em [wrangler.jsonc](wrangler.jsonc)); nunca na conta `velasqui`. O banco é Postgres no
**Supabase**, ligado pelo **Hyperdrive** (pool de conexões da Cloudflare).

1. **Supabase** — crie o projeto com *Data API desligada* e *RLS automático ligado* (o app fala
   direto com o banco; a API REST exporia as tabelas). Região São Paulo, se houver. Copie a
   connection string **Direct connection** (Project Settings → Database).
2. **Tabelas e usuários** (do seu computador, direto no Supabase):
   ```bash
   # PowerShell: $env:DATABASE_URL="postgresql://postgres:SENHA@db.xxxx.supabase.co:5432/postgres"
   npm run db:migrate
   SEED_ADMIN_PASSWORD='senha-forte' SEED_FUNC_PASSWORD='outra-senha' npm run db:seed
   # ou, para levar o banco local: npm run db -- backup  (sem DATABASE_URL)  e depois
   #   npm run db -- restore backups/arquivo.json   (com DATABASE_URL do Supabase)
   ```
3. **Hyperdrive** — `npx wrangler login` e
   `npx wrangler hyperdrive create crm-imperio-db --connection-string="<Direct connection>"`.
   Cole o `id` devolvido em [wrangler.jsonc](wrangler.jsonc) (`hyperdrive[0].id`).
4. **Publicar** — pelo **Workers Builds** (recomendado): no painel da Cloudflare, *Workers &
   Pages → Create → Import a repository*, escolha o repositório, pasta raiz `web`, comando de
   build `npx opennextjs-cloudflare build`, comando de deploy `npx opennextjs-cloudflare deploy`.
   Cada push publica sozinho. Ou do computador: `npm run cf:deploy` (no Windows exige o *Modo de
   Desenvolvedor* ligado, por causa de symlinks; em Linux/macOS/WSL funciona direto).

Migrações **não** rodam no Worker: sempre que houver migração nova em `drizzle/`, rode
`npm run db:migrate` com a `DATABASE_URL` do Supabase antes (ou logo depois) de publicar.

### Produção: servidor Node + PostgreSQL (alternativa)

```bash
DATABASE_URL=postgres://usuario:senha@host:5432/imperio_crm
npm run db:migrate
npm run db:seed        # cria admin/funcionario se não houver usuários
npm run build && npm start
```

Com `DATABASE_URL` os usuários **não** são criados sozinhos; rode `db:seed`. Variáveis: veja
[.env.example](.env.example).

## Comandos

| comando | o que faz |
| --- | --- |
| `npm test` | testes de ponta a ponta da API (banco temporário; não toca nos seus dados) |
| `npm run db:migrate` | aplica as migrações (`drizzle/`) |
| `npm run db:seed` | cria os usuários padrão se não houver nenhum |
| `npm run db:demo` | carrega os dados de exemplo do design (só em banco vazio) |
| `npm run db -- backup [arquivo]` | exporta tudo para JSON (padrão: `backups/`) |
| `npm run db -- restore <arquivo>` | **apaga os dados atuais** e restaura o backup |
| `npm run db -- user:add <usuario> <senha> <admin\|colaborador> [nome]` | cria usuário |
| `npm run db -- user:senha <usuario> <nova-senha>` | troca senha (ex.: admin esqueceu) |
| `npm run db -- user:desativar <usuario>` / `user:list` | bloqueia acesso / lista usuários |
| `npm run db:generate` | gera migração depois de mudar `src/server/db/schema.ts` |
| `npm run design:sync` | regenera as telas a partir do `.dc.html` |

## Funcionalidades

**Operação.** Clientes (ficha com métricas, crédito e histórico de interações), entradas
(compras/coletas com itens e perdas), saídas (vendas com itens, aviso de estoque e de limite de
crédito), estoque (entradas − perdas − saídas), perdas no depósito, fornecedores (prazo de
pagamento e produtos que vendem), produtos (preço médio, margem, markup e perda calculados).

**Financeiro.**
- *Competência × caixa.* Vendas, compras e custos entram no resultado do período pela data do
  fato; só entram no caixa, no saldo do banco e no fluxo de caixa quando são **baixados**.
- *Toda baixa tem conta.* Receber venda, pagar compra e pagar custo pedem data, forma e conta
  (um banco ou o **Caixa**). Saldo da conta = saldo inicial + recebimentos − pagamentos.
- *Contas a pagar/receber:* tudo em aberto por vencimento, com Receber/Pagar, vencidos e saldo
  projetado (hoje + a receber − a pagar).
- *Vencimentos:* venda = entrega + prazo do cliente; compra = coleta + prazo do fornecedor;
  custo = data do lançamento. Venda pendente vencida vira **Atrasado** sozinha; cancelada ou
  devolvida não é dívida.
- *Custos:* qualquer lançamento pode ser registrado como pago ou **a pagar**; diárias nascem a pagar.
- *Indicadores:* DRE, ciclo de caixa (prazo ao produtor = média real), KPIs do painel,
  relatórios (clientes, inadimplentes, pedidos por rota, compras, ranking de produtos, perdas,
  fluxo de caixa com a conta de cada movimento) e exportação CSV/PDF.

**Equipe e frota.** Funcionários (salário, adiantamentos, próximo pagamento — folha sempre de
um mês), diárias, veículos (gasolina, manutenção e multas por carro), bancos.

**Configurações** (admin):
- *Metas* — todos os limites das cores verde/amarelo/vermelho (perda, markup, ticket,
  inadimplência, minimercados, giro, ciclo, variação de preço, concentração, cenários).
- *Empresa e listas* — nome no menu e rotas de entrega.
- *Usuários* — cadastrar, mudar perfil, desativar, redefinir senha. Desativar/redefinir derruba as
  sessões abertas; é impossível ficar sem admin ativo.
- *Histórico* — quem criou, alterou ou excluiu o quê e quando, com antes → depois.
- *Backup* — baixa o JSON completo.

Todos os usuários têm **Minha senha** no menu lateral. A tela se **atualiza sozinha** a cada
minuto e ao voltar para a aba, sem interromper quem está editando.

## API

Todas as rotas exigem sessão (cookie `crm_session`, httpOnly, SameSite) e, nas gravações, corpo
JSON. Erros voltam como `{ "erro": "mensagem em português" }`.

| rota | método | |
| --- | --- | --- |
| `/api/auth/login` · `logout` · `me` | POST · POST · GET | sessão (5 erros seguidos = 15 min de bloqueio) |
| `/api/auth/senha` | POST | `{ atual, nova }` — troca a própria senha |
| `/api/bootstrap` | GET | usuário, configurações e todas as coleções que o perfil pode ver |
| `/api/<recurso>` | GET / POST | lista / cria |
| `/api/<recurso>/<id>` | GET / PUT / DELETE | lê / atualiza / exclui |
| `/api/configuracoes` | GET / PUT | metas, rotas, empresa (PUT só admin) |
| `/api/usuarios` · `/api/usuarios/<id>` | GET, POST · PUT | gestão de usuários (admin) |
| `/api/auditoria?recurso=&registro=&limite=` | GET | histórico de alterações (admin) |
| `/api/backup` | GET | backup completo em JSON (admin) |

| recurso | ler | gravar | excluir |
| --- | --- | --- | --- |
| `clientes`, `produtos`, `fornecedores` | todos | admin | admin |
| `entradas`, `pedidos`, `perdas` | todos | todos¹ | admin |
| `funcionarios`, `bancos`, `veiculos`, `lancamentos`, `interacoes` | admin | admin | admin |

¹ O funcionário não dá baixa em venda (recebimento, data, forma e conta).

O servidor valida tudo (zod) e recalcula o que não deve vir do navegador: códigos `#2050` /
`C-1046` (sequências), totais pelos itens, dias até receber, vencimentos, situação "Atrasado",
nomes vindos dos cadastros, autor das interações. **Vínculos:** venda → cliente e compra →
fornecedor por id; renomear cliente, fornecedor ou produto atualiza o histórico; cadastro em uso
(cliente com vendas, fornecedor com compras, produto usado, conta com movimento) não pode ser
excluído — o sistema orienta a marcar como inativo. Toda gravação entra no histórico.

## Estrutura

```
drizzle/                 migrações SQL
scripts/
  db.ts                  migrate / seed / demo / backup / restore / usuários
  test-e2e.mjs           npm test
  convert-design.mjs     gera as telas a partir do .dc.html
src/
  app/api/               Route Handlers
  server/
    db/schema.ts         tabelas          db/index.ts   conexão + migração automática
    db/seed.ts           usuários padrão e demonstração
    resources.ts         validação, permissões, vínculos e formato de cada recurso
    config.ts            configurações     audit.ts      histórico de alterações
    backup.ts            exportar/importar usuarios.ts   regras de usuários
    session.ts           sessões e acesso  password.ts   hash scrypt
  shared/config-padrao.ts  metas e listas padrão (servidor e interface)
  crm/
    CrmApp.tsx           estado e regras de negócio da interface (KPIs, DRE, estoque, contas…)
    api.ts               cliente HTTP
    AppView.tsx, screens/, modals/, layout/   telas
```

Os indicadores (DRE, ciclo de caixa, estoque, relatórios) são calculados no navegador a partir das
coleções, como no protótipo; o servidor guarda os dados, aplica as regras e as permissões.

## Atualizar a partir de uma nova versão do design

```bash
npm run design:sync
```

Regenera as telas e o `hover.css`, mas não mexe em `CrmApp.tsx` nem nos arquivos mantidos à mão
(lista em `MANUAL` no script — telas que ganharam funções que o design não tinha). Se o design
mudar a lógica, leve a mudança para `CrmApp.tsx` (e, se envolver dados, para
`src/server/resources.ts` e o schema).

## Limitações conhecidas

- O perfil funcionário recebe as vendas com valores (a tela esconde), porque o formulário de
  saída precisa dos preços.
- Restaurar backup só pelo comando (com o sistema parado), de propósito: apaga os dados atuais.
- O `tsconfig` usa `strict: false` porque a lógica da interface veio do JavaScript do design.
