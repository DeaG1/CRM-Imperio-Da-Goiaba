CREATE TABLE "interacoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"cliente_id" integer NOT NULL,
	"data" date NOT NULL,
	"tipo" text NOT NULL,
	"texto" text DEFAULT '' NOT NULL,
	"autor_id" integer,
	"autor_nome" text DEFAULT '' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "interacoes" ADD CONSTRAINT "interacoes_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interacoes" ADD CONSTRAINT "interacoes_autor_id_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "interacoes_cliente_idx" ON "interacoes" USING btree ("cliente_id");