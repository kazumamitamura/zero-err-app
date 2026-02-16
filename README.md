# Zero-Err

Error-prevention document generation app for ADHD-friendly workflows. Prevents careless mistakes, forgotten saves, and file mismanagement.

## Rules

All development must follow the rules in **`.cursor/rules/zero-err-app.mdc`** (naming, feature structure, DB/RLS, UX, stack, generator-as-wizard).

## Stack

- Next.js 14 (App Router)
- Supabase (DB + Auth)
- Tailwind CSS, React Hook Form + Zod, Lucide React

## Database（テーブル役割の分離）

- **auth.users** … Supabase 認証用（触らない）。ログイン・セッション管理のみ。
- **public.ze_*** … Zero-Err アプリ用テーブル（すべて `ze_` 接頭語で統一）。
  - **ze_templates** … テンプレート定義。`owner_id` は auth.users(id) を参照。
  - **ze_profiles** … ユーザーのプロフィール登録情報（表示名・アバター等）。認証は auth.users、登録情報はここ。

既存の `public.profiles` がある場合は、004 で旧トリガーを外したうえで、必要なら手動で ze_profiles に移行してから `profiles` を削除してください。

## Setup

1. Copy `.env.local.example` to `.env.local` and set Supabase URL and anon key.
2. Run migrations in order: `001_ze_templates.sql` → `002_fix_json_keys.sql` → `003_ze_profiles.sql` → `004_migrate_profiles_to_ze_if_exists.sql`.
3. `npm install` then `npm run dev`.

## Structure

- `src/features/ze_templates/` — template types, ZeTemplateCard.
- `src/features/ze_generator/` — ZeGeneratorWizard, placeholder replacement.
- `src/features/ze_auth/` — useZeAuth.
- Generator flow: select template → fill inputs → generate → copy (read-only output).
