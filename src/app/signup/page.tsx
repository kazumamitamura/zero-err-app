"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) throw err;
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="rounded-lg bg-green-50 p-4 text-green-800">
            <p className="font-medium">登録完了</p>
            <p className="mt-1 text-sm">
              確認メールを送信しました。メール内のリンクをクリックして認証を完了してください。認証後は
              <Link href="/login" className="mx-1 font-medium underline">ログイン</Link>
              できます。
            </p>
          </div>
          <Link
            href="/"
            className="mt-6 inline-block text-center text-slate-600 underline hover:text-slate-800"
          >
            ホームへ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">新規登録</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              パスワード（6文字以上）
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-800 py-2.5 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "登録中…" : "登録する"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          すでにアカウントをお持ちの方は
          <Link href="/login" className="ml-1 font-medium text-slate-800 underline hover:no-underline">
            ログイン
          </Link>
        </p>
      </div>
    </main>
  );
}
