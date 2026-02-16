import type { ZeContentSchema, ZeSchemaField } from "./types";

/**
 * DB から取得した content_schema を正規化する。
 * フィールドに "id" しかない場合も "key" に揃え、入力欄が確実に表示されるようにする。
 */
export function zeNormalizeContentSchema(raw: unknown): ZeContentSchema {
  if (!raw || typeof raw !== "object") {
    return { fields: [] };
  }
  const obj = raw as { fields?: unknown[] };
  const fields = Array.isArray(obj.fields) ? obj.fields : [];
  const normalized: ZeSchemaField[] = fields.map((f) => {
    if (!f || typeof f !== "object") return null;
    const field = f as Record<string, unknown>;
    const key = (field.key ?? field.id ?? "") as string;
    const label = (field.label ?? key) as string;
    const type = (field.type ?? "text") as "text" | "date" | "number";
    const required = Boolean(field.required);
    if (!key) return null;
    return { key, label, type, required };
  }).filter((f): f is ZeSchemaField => f !== null);
  return { fields: normalized };
}
