import { createBrowserClient } from "@supabase/ssr";

/** ブラウザ用 Supabase クライアント（認証・ze_ テーブルアクセス用） */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
