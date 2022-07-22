-- public.clubs definition

-- Drop table

-- DROP TABLE public.clubs;

CREATE TABLE public.clubs (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT clubs_name_key null,
	CONSTRAINT clubs_pkey null
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id bigserial NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"clubId" int4 NULL,
	CONSTRAINT users_email_key null,
	CONSTRAINT users_pkey null,
	CONSTRAINT "users_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public.clubs(id) ON DELETE SET NULL ON UPDATE CASCADE
);


-- public.wallets definition

-- Drop table

-- DROP TABLE public.wallets;

CREATE TABLE public.wallets (
	id serial4 NOT NULL,
	hard_currency int4 NOT NULL,
	soft_currency int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"userId" int8 NULL,
	CONSTRAINT wallets_pkey null,
	CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE SET NULL ON UPDATE CASCADE
);


-- public.message definition

-- Drop table

-- DROP TABLE public.message;

CREATE TABLE public.message (
	id serial4 NOT NULL,
	message varchar(255) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"userId" int8 NULL,
	"clubId" int4 NULL,
	CONSTRAINT message_pkey null,
	CONSTRAINT "message_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public.clubs(id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "message_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE SET NULL ON UPDATE CASCADE
);