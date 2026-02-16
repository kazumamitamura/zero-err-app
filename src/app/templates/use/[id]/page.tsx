"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useZeTemplate } from "@/features/ze_templates";
import { ZeGeneratorWizard } from "@/features/ze_generator";

export default function UseTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const { template, loading, error } = useZeTemplate(id);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-slate-600">読み込み中…</p>
      </main>
    );
  }

  if (error || !template) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-red-600" role="alert">
          テンプレートが見つかりません。
        </p>
        <Link href="/templates" className="mt-4 inline-block text-slate-700 underline hover:text-slate-900">
          一覧へ戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <ZeGeneratorWizard
        template={template}
        onBack={() => router.push("/templates")}
      />
    </main>
  );
}
