import { z } from "zod";
import type { ZeContentSchema } from "../ze_templates/types";

/**
 * content_schema から react-hook-form 用の Zod スキーマを動的生成する。
 * required のときは必須、それ以外は optional（空文字許可）。
 */
export function zeBuildFormSchema(contentSchema: ZeContentSchema): z.ZodObject<Record<string, z.ZodString>> {
  const shape: Record<string, z.ZodString> = {};
  const fields = contentSchema?.fields ?? [];

  for (const field of fields) {
    const base = z.string();
    shape[field.key] = field.required
      ? base.min(1, `${field.label}を入力してください`)
      : base.optional().default("");
  }

  return z.object(shape) as z.ZodObject<Record<string, z.ZodString>>;
}
