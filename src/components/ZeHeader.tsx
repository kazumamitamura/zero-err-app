"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useZeAuth } from "@/features/ze_auth";

/**
 * 全ページ共通ヘッダー。Zero-Err ロゴでホームに戻れる。ログイン・新規登録・ログアウトを表示。
 */
export function ZeHeader() {
  const router = useRouter();
  const { userId, loading } = useZeAuth();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-slate-800 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded"
        >
          Zero-Err
        </Link>
        <nav className="flex items-center gap-3" aria-label="アカウント">
          {!loading && (
            <>
              {userId ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  ログアウト
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    新規登録
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
