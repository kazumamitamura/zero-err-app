"use client";

/**
 * ジェネレーターウィザード：テンプレート選択 → 入力フィールドのみ表示 → プレースホルダー置換 → 読取専用で結果表示。
 * リッチテキストエディタは使わない（設計方針）。
 */
import { useState } from "react";
import type { ZeTemplate } from "../ze_templates/types";
import { zeReplacePlaceholders } from "./zeReplacePlaceholders";

interface ZeGeneratorWizardProps {
  template: ZeTemplate;
  onBack: () => void;
}

export function ZeGeneratorWizard({ template, onBack }: ZeGeneratorWizardProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState<string | null>(null);

  const fields = template.content_schema?.fields ?? [];
  const output = generated ?? zeReplacePlaceholders(template.fixed_text, values);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setGenerated(null);
  };

  const handleGenerate = () => {
    setGenerated(zeReplacePlaceholders(template.fixed_text, values));
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="text-slate-600 underline hover:text-slate-800"
      >
        ← Back
      </button>
      <h2 className="text-xl font-bold text-slate-800">{template.title}</h2>

      <div className="space-y-4">
        {fields.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              {field.label}
            </span>
            <input
              type={field.type === "date" ? "date" : "text"}
              value={values[field.key] ?? ""}
              onChange={(event) => handleChange(field.key, event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700"
      >
        Generate
      </button>

      <div>
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Result (read-only)
        </span>
        <textarea
          readOnly
          value={output}
          rows={8}
          className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
        />
      </div>
    </div>
  );
}
