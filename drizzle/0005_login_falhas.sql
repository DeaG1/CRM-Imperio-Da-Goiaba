CREATE TABLE "login_falhas" (
	"usuario" text PRIMARY KEY NOT NULL,
	"falhas" integer DEFAULT 0 NOT NULL,
	"desde" timestamp with time zone DEFAULT now() NOT NULL
);
