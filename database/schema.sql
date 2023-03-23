set client_min_messages to warning;
-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;
create schema "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"userName" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	"accountBalance" NUMERIC(12, 2) DEFAULT 1000,
	"createdAt" timestamptz NOT NULL default now(),
  "lastDeposit" timestamptz NOT NULL default now(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."bets" (
	"betId" serial NOT NULL,
	"gameId" TEXT NOT NULL,
	"createdAt" timestamptz NOT NULL default now(),
	"gameStart" timestamptz,
  "sportType" TEXT NOT NULL,
	"betType" TEXT NOT NULL,
	"betAmount" integer NOT NULL,
	"winningTeam" TEXT NOT NULL,
	"homeTeam" TEXT NOT NULL,
	"awayTeam" TEXT NOT NULL,
  "homeTeamScore" INT,
  "awayTeamScore" INT,
	"price" integer NOT NULL,
	"points" NUMERIC(12, 1),
	"potentialWinnings" float4 NOT NULL,
	"status" TEXT NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "bets_pk" PRIMARY KEY ("betId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."deposits" (
	"depositId" serial NOT NULL,
	"createdAt" timestamptz NOT NULL default now(),
	"depositAmount" NUMERIC(12, 2) NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "deposits_pk" PRIMARY KEY ("depositId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "bets" ADD CONSTRAINT "bets_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
