CREATE SEQUENCE "public"."entrada_codigo_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1040 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."pedido_codigo_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 2041 CACHE 1;--> statement-breakpoint
CREATE TABLE "bancos" (
	"id" serial PRIMARY KEY NOT NULL,
	"instituicao" text NOT NULL,
	"agencia" text DEFAULT '' NOT NULL,
	"conta" text DEFAULT '' NOT NULL,
	"apelido" text DEFAULT '' NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"saldo_inicial" numeric(14, 2) DEFAULT 0 NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"resp" text DEFAULT '' NOT NULL,
	"cnpj" text DEFAULT '' NOT NULL,
	"tel" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"endereco" text DEFAULT '' NOT NULL,
	"rota" text DEFAULT 'Sul A' NOT NULL,
	"freq" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'ativo' NOT NULL,
	"cobranca" text DEFAULT 'Em dia' NOT NULL,
	"forma" text DEFAULT 'PIX' NOT NULL,
	"limite" numeric(14, 2) DEFAULT 0 NOT NULL,
	"prazo" integer DEFAULT 14 NOT NULL,
	"tend" text DEFAULT '→' NOT NULL,
	"ult" text DEFAULT '—' NOT NULL,
	"obs" text DEFAULT '' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entradas" (
	"id" text PRIMARY KEY DEFAULT 'C-' || nextval('entrada_codigo_seq') NOT NULL,
	"fornecedor" text NOT NULL,
	"data" date NOT NULL,
	"peso_kg" numeric(14, 3) DEFAULT 0 NOT NULL,
	"valor" numeric(14, 2) DEFAULT 0 NOT NULL,
	"perda_kg" numeric(14, 3) DEFAULT 0 NOT NULL,
	"motivo" text DEFAULT '—' NOT NULL,
	"pago" text DEFAULT 'Pendente' NOT NULL,
	"data_pag" date,
	"forma_pag" text DEFAULT 'PIX' NOT NULL,
	"itens" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fornecedores" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"regiao" text DEFAULT '' NOT NULL,
	"contato" text DEFAULT '' NOT NULL,
	"produtos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funcionarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"cargo" text DEFAULT '' NOT NULL,
	"salario" numeric(14, 2) DEFAULT 0 NOT NULL,
	"tel" text DEFAULT '' NOT NULL,
	"dia_pag" integer DEFAULT 5 NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lancamentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" date NOT NULL,
	"categoria" text NOT NULL,
	"descricao" text DEFAULT '' NOT NULL,
	"valor" numeric(14, 2) DEFAULT 0 NOT NULL,
	"diarista" text DEFAULT '' NOT NULL,
	"funcionario_id" integer,
	"veiculo_id" integer,
	"banco_id" integer,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pedidos" (
	"id" text PRIMARY KEY DEFAULT '#' || nextval('pedido_codigo_seq') NOT NULL,
	"cliente" text NOT NULL,
	"rota" text DEFAULT '' NOT NULL,
	"data_pedido" date NOT NULL,
	"entrega" date NOT NULL,
	"peso_kg" numeric(14, 3) DEFAULT 0 NOT NULL,
	"valor" numeric(14, 2) DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'Pendente' NOT NULL,
	"pag" text DEFAULT 'Pendente' NOT NULL,
	"venc" date,
	"receb_dias" integer DEFAULT 0 NOT NULL,
	"perda_kg" numeric(14, 3) DEFAULT 0 NOT NULL,
	"motivo" text DEFAULT '—' NOT NULL,
	"data_pag" date,
	"forma_pag" text DEFAULT '' NOT NULL,
	"itens" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perdas" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" date NOT NULL,
	"produto_id" integer,
	"nome" text DEFAULT '' NOT NULL,
	"un" text DEFAULT 'KG' NOT NULL,
	"qtd" numeric(14, 3) DEFAULT 0 NOT NULL,
	"motivo" text DEFAULT 'armazenagem' NOT NULL,
	"obs" text DEFAULT '' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "produtos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"un" text DEFAULT 'KG' NOT NULL,
	"compra" numeric(14, 2),
	"venda" numeric(14, 2),
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expira_em" timestamp with time zone NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"usuario" text NOT NULL,
	"senha_hash" text NOT NULL,
	"role" text DEFAULT 'colaborador' NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_usuario_unique" UNIQUE("usuario")
);
--> statement-breakpoint
CREATE TABLE "veiculos" (
	"id" serial PRIMARY KEY NOT NULL,
	"placa" text NOT NULL,
	"marca" text DEFAULT '' NOT NULL,
	"modelo" text DEFAULT '' NOT NULL,
	"ano" integer,
	"ativo" boolean DEFAULT true NOT NULL,
	"obs" text DEFAULT '' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_funcionario_id_funcionarios_id_fk" FOREIGN KEY ("funcionario_id") REFERENCES "public"."funcionarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_veiculo_id_veiculos_id_fk" FOREIGN KEY ("veiculo_id") REFERENCES "public"."veiculos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_banco_id_bancos_id_fk" FOREIGN KEY ("banco_id") REFERENCES "public"."bancos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perdas" ADD CONSTRAINT "perdas_produto_id_produtos_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entradas_data_idx" ON "entradas" USING btree ("data");--> statement-breakpoint
CREATE INDEX "lancamentos_data_idx" ON "lancamentos" USING btree ("data");--> statement-breakpoint
CREATE INDEX "pedidos_entrega_idx" ON "pedidos" USING btree ("entrega");--> statement-breakpoint
CREATE INDEX "pedidos_cliente_idx" ON "pedidos" USING btree ("cliente");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");