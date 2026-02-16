import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import type { ZeSchemaField } from "../ze_templates/types";

/**
 * 日付フィールドなら日本語表記（例: 2月16日(金)）に変換。それ以外はそのまま。パース失敗時は元の文字列を返す。
 */
export function zeFormatValueByField(
  value: string,
  field: ZeSchemaField | undefined
): string {
  if (!value) return value;
  if (!field || field.type !== "date") return value;
  try {
    const date = parseISO(value);
    if (Number.isNaN(date.getTime())) return value;
    return format(date, "M月d日(eee)", { locale: ja });
  } catch {
    return value;
  }
}

/**
 * fixed_text 内の {{key}} を values の値で置換する。
 * fields を渡すと type "date" の値は自動で「○月○日(曜)」形式にフォーマットする。
 */
export function zeReplacePlaceholders(
  fixedText: string,
  values: Record<string, string>,
  fields?: ZeSchemaField[]
): string {
  const keyToField = new Map<string, ZeSchemaField>(
    (fields ?? []).map((f) => [f.key, f])
  );

  return Object.entries(values).reduce((text, [key, value]) => {
    const field = keyToField.get(key);
    const displayValue = zeFormatValueByField(value ?? "", field);
    return text.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), displayValue);
  }, fixedText);
}
