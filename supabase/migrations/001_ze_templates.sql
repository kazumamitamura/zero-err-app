-- ステップ3: Database
-- Zero-Err: ze_templates テーブルと RLS（設計図 .cursorrules 準拠）
create table if not exists public.ze_templates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  content_schema jsonb not null default '{"fields":[]}'::jsonb,
  fixed_text text not null default '',
  is_public boolean not null default false,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ze_templates enable row level security;

-- SELECT: own rows OR is_public
create policy ze_templates_select_policy on public.ze_templates
  for select
  using (
    auth.uid() = owner_id
    or is_public = true
  );

-- INSERT: only own rows
create policy ze_templates_insert_policy on public.ze_templates
  for insert
  with check (auth.uid() = owner_id);

-- UPDATE: only own rows (never edit others' public templates)
create policy ze_templates_update_policy on public.ze_templates
  for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- DELETE: only own rows
create policy ze_templates_delete_policy on public.ze_templates
  for delete
  using (auth.uid() = owner_id);

create index if not exists ze_templates_owner_id on public.ze_templates (owner_id);
create index if not exists ze_templates_is_public on public.ze_templates (is_public) where is_public = true;
