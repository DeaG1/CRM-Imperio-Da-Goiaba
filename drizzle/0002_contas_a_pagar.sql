ALTER TABLE "lancamentos" ADD COLUMN "pago" text DEFAULT 'Pago' NOT NULL;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD COLUMN "data_pag" date;--> statement-breakpoint
-- lançamentos que já existiam eram tratados como pagos na própria data
UPDATE "lancamentos" SET "data_pag" = "data" WHERE "pago" = 'Pago' AND "data_pag" IS NULL;
