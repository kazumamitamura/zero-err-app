"use client";

import Link from "next/link";
import { ZeTemplateCard, useZeTemplatesList } from "@/features/ze_templates";

export default function TemplatesPage() {
  const { templates, loading, error } = useZeTemplatesList();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">テンプレートを使う</h1>

      {loading && (
        <p className="text-slate-600">読み込み中…</p>
      )}

      {error && (
        <p className="text-red-600" role="alert">
          テンプレートの取得に失敗しました。
        </p>
      )}

      {!loading && !error && templates.length === 0 && (
        <p className="text-slate-600">テンプレートがありません。ホームの「テンプレートを追加」から作成できます。</p>
      )}

      {!loading && !error && templates.length > 0 && (
        <div className="grid gap-3">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/templates/use/${template.id}`}
              className="block focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded-xl"
            >
              <ZeTemplateCard template={template} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
