-- Zero-Err: ユーザープロフィールは ze_ 接頭語で専用テーブルに分離する
-- ※ auth.users は Supabase 認証用（触らない）。アプリのプロフィール情報は ze_profiles に格納。

create table if not exists public.ze_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ze_profiles enable row level security;

-- SELECT: 自分の行のみ
create policy ze_profiles_select_policy on public.ze_profiles
  for select
  using (auth.uid() = id);

-- INSERT: 自分の行のみ（新規登録時にトリガーで挿入）
create policy ze_profiles_insert_policy on public.ze_profiles
  for insert
  with check (auth.uid() = id);

-- UPDATE: 自分の行のみ
create policy ze_profiles_update_policy on public.ze_profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- DELETE: 自分の行のみ（通常は auth 削除で CASCADE される）
create policy ze_profiles_delete_policy on public.ze_profiles
  for delete
  using (auth.uid() = id);

-- 新規登録時に ze_profiles に1行自動作成（public.profiles ではなく ze_profiles を使う）
create or replace function public.ze_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.ze_profiles (id, display_name, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists ze_on_auth_user_created on auth.users;
create trigger ze_on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.ze_handle_new_user();

comment on table public.ze_profiles is 'Zero-Err アプリ用ユーザープロフィール。認証は auth.users、登録情報はここ。';
