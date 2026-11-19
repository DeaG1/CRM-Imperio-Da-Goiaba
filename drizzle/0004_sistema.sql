CREATE TABLE "auditoria" (
	"id" serial PRIMARY KEY NOT NULL,
	"quando" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" integer,
	"user_nome" text DEFAULT '' NOT NULL,
	"recurso" text NOT NULL,
	"registro_id" text DEFAULT '' NOT NULL,
	"acao" text NOT NULL,
	"resumo" text DEFAULT '' NOT NULL,
	"antes" jsonb,
	"depois" jsonb
);
--> statement-breakpoint
CREATE TABLE "configuracoes" (
	"id" integer PRIMARY KEY NOT NULL,
	"dados" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_por" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fornecedores" ADD COLUMN "prazo" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auditoria_quando_idx" ON "auditoria" USING btree ("quando");--> statement-breakpoint
CREATE INDEX "auditoria_registro_idx" ON "auditoria" USING btree ("recurso","registro_id");