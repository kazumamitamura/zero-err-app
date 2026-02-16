"use client";

/**
 * ジェネレーターウィザード：content_schema から動的フォーム生成 → リアルタイムプレビュー（readOnly）→ コピー。
 * リッチテキストエディタは使わない（設計方針）。
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch } from "react-hook-form";
import { useCallback, useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ZeTemplate } from "../ze_templates/types";
import type { ZeSchemaField } from "../ze_templates/types";
import { zeReplacePlaceholders } from "./zeReplacePlaceholders";
import { zeBuildFormSchema } from "./zeBuildFormSchema";
import { zeExtractPlaceholderKeys } from "./zeExtractPlaceholderKeys";

interface ZeGeneratorWizardProps {
  template: ZeTemplate;
  onBack: () => void;
}

type FormValues = Record<string, string>;

export function ZeGeneratorWizard({ template, onBack }: ZeGeneratorWizardProps) {
  const fields = useMemo(() => {
    const fromSchema = template.content_schema?.fields ?? [];
    if (fromSchema.length > 0) return fromSchema;
    const keys = zeExtractPlaceholderKeys(template.fixed_text);
    return keys.map((key): ZeSchemaField => ({ key, label: key, type: "text", required: false }));
  }, [template.content_schema?.fields, template.fixed_text]);

  const contentSchemaForValidation = useMemo(() => ({ fields }), [fields]);
  const schema = zeBuildFormSchema(contentSchemaForValidation);
  const defaultValues: FormValues = {};
  fields.forEach((field) => {
    defaultValues[field.key] = "";
  });

  const {
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const watchedValues = (useWatch({ control, defaultValue: defaultValues }) as FormValues) ?? {};
  const valuesAsStrings: Record<string, string> = {};
  Object.entries(watchedValues).forEach(([key, value]) => {
    valuesAsStrings[key] = value != null ? String(value) : "";
  });
  const previewText = zeReplacePlaceholders(template.fixed_text, valuesAsStrings);

  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(previewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [previewText]);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="text-slate-600 underline hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded"
      >
        ← 一覧へ戻る
      </button>

      <h2 className="text-xl font-bold text-slate-800">{template.title}</h2>

      <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
        <p className="font-medium text-slate-800">入力の仕方</p>
        <p className="mt-1">
          下の入力欄に値を入れると、プレビュー内の <code className="rounded bg-slate-200 px-1">{"{{キー名}}"}</code> がその値に置き換わります。キー名と入力項目の「キー」は同じにしてください。
        </p>
      </div>

      <form className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label htmlFor={field.key} className="mb-1 block text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={field.key}
              type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
              {...register(field.key)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              aria-invalid={!!errors[field.key]}
              aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
            />
            {errors[field.key] && (
              <p id={`${field.key}-error`} className="mt-1 text-sm text-red-600" role="alert">
                {errors[field.key]?.message}
              </p>
            )}
          </div>
        ))}
      </form>

      <section aria-label="プレビュー">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-slate-700">プレビュー（編集不可・ここに入力が反映されます）</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" aria-hidden />
                コピーしました
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden />
                コピー
              </>
            )}
          </button>
        </div>
        <textarea
          readOnly
          value={previewText}
          rows={10}
          className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
          aria-readonly="true"
        />
      </section>
    </div>
  );
}
