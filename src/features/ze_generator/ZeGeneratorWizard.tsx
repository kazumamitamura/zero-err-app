"use client";

/**
 * ジェネレーターウィザード：①②の番号と色で入力・プレビューを対応させ、コピー時は番号なしのプレーンテキスト。
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch } from "react-hook-form";
import { useCallback, useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ZeTemplate } from "../ze_templates/types";
import type { ZeSchemaField } from "../ze_templates/types";
import { zeBuildFormSchema } from "./zeBuildFormSchema";
import { zeExtractPlaceholderKeys } from "./zeExtractPlaceholderKeys";
import { zeBuildPreviewSegments, zeSegmentsToPlainText } from "./zeBuildPreviewSegments";

interface ZeGeneratorWizardProps {
  template: ZeTemplate;
  onBack: () => void;
}

type FormValues = Record<string, string>;

const ZE_FIELD_COLORS = [
  "border-l-4 border-l-blue-500 bg-blue-50/80",
  "border-l-4 border-l-emerald-500 bg-emerald-50/80",
  "border-l-4 border-l-amber-500 bg-amber-50/80",
  "border-l-4 border-l-violet-500 bg-violet-50/80",
  "border-l-4 border-l-rose-500 bg-rose-50/80",
  "border-l-4 border-l-cyan-500 bg-cyan-50/80",
] as const;

const ZE_PREVIEW_COLORS = [
  "bg-blue-100 text-blue-900 rounded px-0.5",
  "bg-emerald-100 text-emerald-900 rounded px-0.5",
  "bg-amber-100 text-amber-900 rounded px-0.5",
  "bg-violet-100 text-violet-900 rounded px-0.5",
  "bg-rose-100 text-rose-900 rounded px-0.5",
  "bg-cyan-100 text-cyan-900 rounded px-0.5",
] as const;

function zeCircledNumber(index: number): string {
  if (index < 0 || index > 19) return `(${index + 1})`;
  return String.fromCharCode(0x2460 + index);
}

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

  const segments = useMemo(
    () => zeBuildPreviewSegments(template.fixed_text, valuesAsStrings, fields),
    [template.fixed_text, valuesAsStrings, fields]
  );
  const copyText = useMemo(() => zeSegmentsToPlainText(segments), [segments]);

  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [copyText]);

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

      <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-800">入力の仕方</p>
        <p className="mt-1">
          各入力欄の <strong>①・②・③</strong> は、プレビュー内の色付き部分と対応しています。入力するとその位置に反映され、<strong>コピー時は番号や色は含まれず本文だけ</strong>がコピーされます。
        </p>
      </div>

      <form className="space-y-4">
        {fields.map((field, index) => {
          const colorClass = ZE_FIELD_COLORS[index % ZE_FIELD_COLORS.length];
          const num = zeCircledNumber(index);
          return (
            <div
              key={field.key}
              className={`rounded-lg border border-slate-200 p-3 ${colorClass}`}
            >
              <label
                htmlFor={field.key}
                className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-800"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">
                  {num}
                </span>
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                id={field.key}
                type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                {...register(field.key)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                aria-invalid={!!errors[field.key]}
                aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
              />
              {errors[field.key] && (
                <p id={`${field.key}-error`} className="mt-1 text-sm text-red-600" role="alert">
                  {errors[field.key]?.message}
                </p>
              )}
            </div>
          );
        })}
      </form>

      <section aria-label="プレビュー" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-slate-700">
            プレビュー（色付き＝入力が反映される場所・コピー時は番号なし）
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" aria-hidden />
                コピーしました
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden />
                コピー（番号なしで本文のみ）
              </>
            )}
          </button>
        </div>
        <div
          className="min-h-[200px] w-full resize-none rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 whitespace-pre-wrap font-sans text-[15px] leading-relaxed"
          role="textbox"
          aria-readonly="true"
        >
          {segments.map((seg, i) =>
            seg.type === "normal" ? (
              <span key={i}>{seg.text}</span>
            ) : (
              <span
                key={i}
                className={seg.index !== undefined && seg.index >= 0 ? ZE_PREVIEW_COLORS[seg.index % ZE_PREVIEW_COLORS.length] : "bg-slate-200 rounded px-0.5"}
                title={seg.index !== undefined && seg.index >= 0 ? zeCircledNumber(seg.index) : undefined}
              >
                {seg.text || "\u00A0"}
              </span>
            )
          )}
        </div>
      </section>
    </div>
  );
}
