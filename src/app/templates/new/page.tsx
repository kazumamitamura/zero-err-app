"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useZeAuth } from "@/features/ze_auth";
import { zeExtractPlaceholderKeys } from "@/features/ze_generator";
import type { ZeSchemaField } from "@/features/ze_templates/types";

const FIELD_TYPES: { value: ZeSchemaField["type"]; label: string }[] = [
  { value: "text", label: "テキスト" },
  { value: "date", label: "日付" },
  { value: "number", label: "数値" },
];

export default function NewTemplatePage() {
  const { userId, loading: authLoading } = useZeAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [fixedText, setFixedText] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [fields, setFields] = useState<ZeSchemaField[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const addField = useCallback(() => {
    setFields((prev) => [...prev, { key: "", label: "", type: "text", required: false }]);
  }, []);

  const updateField = useCallback((index: number, updates: Partial<ZeSchemaField>) => {
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  }, []);

  const removeField = useCallback((index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const fillFieldsFromText = useCallback(() => {
    const keys = zeExtractPlaceholderKeys(fixedText);
    const existingKeys = new Set(fields.map((f) => f.key));
    const newFields: ZeSchemaField[] = [...fields];
    keys.forEach((key) => {
      if (!existingKeys.has(key)) {
        newFields.push({ key, label: key, type: "text", required: false });
        existingKeys.add(key);
      }
    });
    setFields(newFields);
    setMessage({ type: "ok", text: "本文から入力項目を追加しました。" });
  }, [fixedText, fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!userId) {
      setMessage({ type: "error", text: "テンプレートを追加するにはログインが必要です。" });
      return;
    }
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setMessage({ type: "error", text: "テンプレート名を入力してください。" });
      return;
    }
    const validFields = fields.filter((f) => f.key.trim() !== "");
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("ze_templates").insert({
        owner_id: userId,
        title: trimmedTitle,
        category: category.trim() || null,
        fixed_text: fixedText.trim() || "",
        content_schema: { fields: validFields },
        is_public: isPublic,
      });
      if (error) throw error;
      setMessage({ type: "ok", text: "テンプレートを追加しました。" });
      setTitle("");
      setCategory("");
      setFixedText("");
      setFields([]);
      setIsPublic(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "保存に失敗しました。",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-slate-600">読み込み中…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">テンプレートを追加</h1>

      {!userId && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p className="font-medium">ログインが必要です</p>
          <p className="mt-1 text-sm">テンプレートを保存するには、ログインしてください。</p>
        </div>
      )}

      <div className="mb-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-800">追加の仕方（ワード・エクセル・ドキュメント・スプレッドシート対応）</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>ワード・エクセル・Googleドキュメント・スプレッドシートなどから、使いたい文章を<strong>コピーして「本文」に貼り付け</strong>ます。</li>
          <li>入力してもらいたい部分は <code className="rounded bg-slate-200 px-1">{{"{{キー名}}"}}</code> で囲みます。</li>
          <li>例：到着が <code className="rounded bg-slate-200 px-1">{{"{{分数}}"}}</code> 分遅れる → 本文に「分数」と入力する欄ができます。</li>
          <li>「キー名」は半角英数字がおすすめです（例：<code>minutes</code>, <code>station</code>, <code>理由</code> も可）。</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <p
            role="alert"
            className={
              message.type === "ok"
                ? "rounded-lg bg-green-50 p-3 text-green-800"
                : "rounded-lg bg-red-50 p-3 text-red-800"
            }
          >
            {message.text}
          </p>
        )}

        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
            テンプレート名 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            placeholder="例：電車遅延の連絡"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
            カテゴリ（任意）
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            placeholder="例：連絡"
          />
        </div>

        <div>
          <label htmlFor="fixed_text" className="mb-1 block text-sm font-medium text-slate-700">
            本文（ここにワード・エクセル等からコピーした文を貼り付け）
          </label>
          <textarea
            id="fixed_text"
            value={fixedText}
            onChange={(e) => setFixedText(e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            placeholder={`例：\nお疲れ様です。\n到着が{{分数}}分ほど遅れる見込みです。\nよろしくお願いいたします。`}
          />
          <button
            type="button"
            onClick={fillFieldsFromText}
            className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            本文から入力項目を自動抽出
          </button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">入力項目（本文の &#123;&#123;キー名&#125;&#125; と一致させる）</span>
            <button
              type="button"
              onClick={addField}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600"
            >
              入力項目を追加
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={index}
                className="flex flex-wrap items-end gap-2 rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="flex-1 min-w-[80px]">
                  <span className="text-xs text-slate-500">キー（本文の &#123;&#123;〇〇&#125;&#125; の〇〇）</span>
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) => updateField(index, { key: e.target.value })}
                    className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    placeholder="例：minutes"
                  />
                </div>
                <div className="flex-1 min-w-[80px]">
                  <span className="text-xs text-slate-500">表示名</span>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
                    className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    placeholder="例：遅延分数"
                  />
                </div>
                <div className="w-24">
                  <span className="text-xs text-slate-500">種類</span>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(index, { type: e.target.value as ZeSchemaField["type"] })}
                    className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  >
                    {FIELD_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-1 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={field.required ?? false}
                    onChange={(e) => updateField(index, { required: e.target.checked })}
                  />
                  必須
                </label>
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="rounded border border-red-200 bg-red-50 px-2 py-1.5 text-sm text-red-700 hover:bg-red-100"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-slate-700">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          他のユーザーにも公開する
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || !userId}
            className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {saving ? "保存中…" : "保存する"}
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </main>
  );
}
