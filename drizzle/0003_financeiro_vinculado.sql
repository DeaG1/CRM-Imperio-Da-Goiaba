ALTER TABLE "lancamentos" DROP CONSTRAINT "lancamentos_banco_id_bancos_id_fk";
--> statement-breakpoint
ALTER TABLE "entradas" ADD COLUMN "fornecedor_id" integer;--> statement-breakpoint
ALTER TABLE "entradas" ADD COLUMN "venc" date;--> statement-breakpoint
ALTER TABLE "entradas" ADD COLUMN "banco_id" integer;--> statement-breakpoint
ALTER TABLE "pedidos" ADD COLUMN "cliente_id" integer;--> statement-breakpoint
ALTER TABLE "pedidos" ADD COLUMN "banco_id" integer;--> statement-breakpoint
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_fornecedor_id_fornecedores_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_banco_id_bancos_id_fk" FOREIGN KEY ("banco_id") REFERENCES "public"."bancos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_banco_id_bancos_id_fk" FOREIGN KEY ("banco_id") REFERENCES "public"."bancos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_banco_id_bancos_id_fk" FOREIGN KEY ("banco_id") REFERENCES "public"."bancos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
-- liga pedidos e compras existentes aos cadastros pelo nome
UPDATE "pedidos" p SET "cliente_id" = (SELECT c."id" FROM "clientes" c WHERE c."nome" = p."cliente" ORDER BY c."id" LIMIT 1) WHERE p."cliente_id" IS NULL;--> statement-breakpoint
UPDATE "entradas" e SET "fornecedor_id" = (SELECT f."id" FROM "fornecedores" f WHERE f."nome" = e."fornecedor" ORDER BY f."id" LIMIT 1) WHERE e."fornecedor_id" IS NULL;--> statement-breakpoint
-- vencimento dos pedidos em aberto: entrega + prazo do cliente
UPDATE "pedidos" p SET "venc" = p."entrega" + COALESCE((SELECT c."prazo" FROM "clientes" c WHERE c."id" = p."cliente_id"), 0) WHERE p."venc" IS NULL AND p."pag" <> 'Pago';--> statement-breakpoint
-- compras em aberto sem vencimento: vencem na data da coleta
UPDATE "entradas" SET "venc" = "data" WHERE "venc" IS NULL AND "pago" <> 'Pago';
