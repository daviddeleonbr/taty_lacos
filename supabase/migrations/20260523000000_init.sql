-- =================================================================
-- Lúa & Lis · Ateliê de Laços
-- Migration inicial — schema completo
-- =================================================================
-- Como aplicar (recomendado):
--   npx supabase login
--   npx supabase link --project-ref <SEU_PROJECT_REF>
--   npm run db:push
--
-- Alternativa: copiar/colar no SQL Editor do dashboard Supabase.
--
-- Filosofia: todo acesso ao banco é server-side via service_role
-- (configurado em SUPABASE_SERVICE_ROLE_KEY). RLS habilitado em todas
-- as tabelas com policies que bloqueiam acesso anônimo/autenticado —
-- service_role bypassa RLS automaticamente.
-- =================================================================

-- ---------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- Tabela: orders
-- Cada pedido feito pela cliente (formulário /encomenda) ou
-- gerenciado pela Bruna no admin.
-- ---------------------------------------------------------------
create table if not exists public.orders (
  id                   text primary key,         -- ex: LL-2026-0001
  created_at           timestamptz not null default now(),
  desired_date         date,

  -- Cliente
  customer_name        text not null,
  customer_email       text not null,
  customer_phone       text,
  customer_city        text,
  customer_state       text,

  -- Filha
  child_name           text,
  child_age_range      text,
  child_head_size      text,

  -- Peça
  piece_style_id       text,
  piece_style_label    text,
  piece_colors         text[] not null default '{}',
  piece_materials      text[] not null default '{}',
  piece_customization  text,
  piece_occasion       text,

  -- Esteira de produção (array de OrderStage como JSONB)
  stages               jsonb not null default '[]'::jsonb,

  -- Operacional
  total_price          numeric(10,2),
  tracking_code        text,
  internal_notes       text
);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Nenhuma policy permissiva: client (anon/authenticated) não acessa.
-- Apenas o service_role pode ler/escrever, bypassando RLS.

-- ---------------------------------------------------------------
-- Tabela: site_content
-- Conteúdo editável da home (hero, banner, fundadora, galeria,
-- categorias, produtos destaque). Linha única (id = 1).
-- ---------------------------------------------------------------
create table if not exists public.site_content (
  id         integer primary key default 1,
  content    jsonb not null,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

alter table public.site_content enable row level security;

-- ---------------------------------------------------------------
-- Tabela: encomenda_styles
-- Modelos de referência exibidos na primeira etapa do formulário
-- de encomenda. CRUD pela Bruna em /admin/modelos.
-- ---------------------------------------------------------------
create table if not exists public.encomenda_styles (
  id          text primary key,
  label       text not null,
  description text not null default '',
  image       text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists encomenda_styles_sort_idx
  on public.encomenda_styles (sort_order asc, created_at asc);

alter table public.encomenda_styles enable row level security;

-- =================================================================
-- BUCKET DE STORAGE — criar manualmente no Supabase Dashboard
-- =================================================================
-- Vá em Storage → Create a new bucket:
--   Name:           lacos
--   Public bucket:  ON  (qualquer URL é acessível publicamente)
--   File size:      5 MB (ou o que preferir)
--   Allowed MIME:   image/*
--
-- Policies (depois de criar o bucket, em Storage → Policies → lacos):
--   Não crie nenhuma policy para anon/authenticated.
--   O upload acontece SEMPRE via service_role no servidor.
--   A leitura é via URL pública (bucket é public).
-- =================================================================

-- =================================================================
-- Pronto. Configure no .env.local:
--   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
--   SUPABASE_SERVICE_ROLE_KEY=eyJ... (Settings → API → service_role)
--   SUPABASE_STORAGE_BUCKET=lacos
-- =================================================================
