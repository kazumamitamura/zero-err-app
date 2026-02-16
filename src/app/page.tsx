import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-slate-800">Zero-Err</h1>
      <div className="grid gap-4">
        <Link
          href="/templates"
          className="flex min-h-[80px] items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-lg font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          テンプレートを使う
        </Link>
        <Link
          href="/templates/new"
          className="flex min-h-[80px] items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-lg font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          テンプレートを追加
        </Link>
      </div>
    </main>
  );
}
