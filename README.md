# Zero-Err

Error-prevention document generation app for ADHD-friendly workflows. Prevents careless mistakes, forgotten saves, and file mismanagement.

## Rules

All development must follow the rules in **`.cursor/rules/zero-err-app.mdc`** (naming, feature structure, DB/RLS, UX, stack, generator-as-wizard).

## Stack

- Next.js 14 (App Router)
- Supabase (DB + Auth)
- Tailwind CSS, React Hook Form + Zod, Lucide React

## Setup

1. Copy `.env.local.example` to `.env.local` and set Supabase URL and anon key.
2. Run migrations in Supabase (SQL in `supabase/migrations/001_ze_templates.sql`).
3. `npm install` then `npm run dev`.

## Structure

- `src/features/ze_templates/` — template types, ZeTemplateCard.
- `src/features/ze_generator/` — ZeGeneratorWizard, placeholder replacement.
- `src/features/ze_auth/` — useZeAuth.
- Generator flow: select template → fill inputs → generate → copy (read-only output).
