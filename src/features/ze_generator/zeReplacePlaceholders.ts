import { format, parseISO, isValid } from "date-fns";
import { ja } from "date-fns/locale";
import type { ZeSchemaField } from "../ze_templates/types";

/**
 * 日付文字列を Date にパースする。
 * YYYY-MM-DD / YYYY/MM/DD / MM-DD(当年) に対応。失敗時は null。
 */
function zeParseDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  let normalized = trimmed.replace(/\//g, "-");
  const currentYear = new Date().getFullYear();

  if (/^\d{1,2}-\d{1,2}$/.test(normalized)) {
    normalized = `${currentYear}-${normalized}`;
  }

  const parts = normalized.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(y, m, d);
    if (isValid(dateObj)) return dateObj;
  }

  try {
    const iso = parseISO(trimmed);
    if (isValid(iso)) return iso;
  } catch {
    // ignore
  }
  return null;
}

/**
 * 日付フィールドなら日本語表記（例: 2月16日(月)）に変換。それ以外はそのまま。パース失敗時は元の文字列を返す。
 * YYYY-MM-DD / YYYY/MM/DD / MM/DD(当年) などの入力に対応。
 */
export function zeFormatValueByField(
  value: string,
  field: ZeSchemaField | undefined
): string {
  if (!value) return value;
  if (!field || field.type !== "date") return value;

  const dateObj = zeParseDate(value);
  if (dateObj) {
    return format(dateObj, "M月d日(eee)", { locale: ja });
  }
  return value;
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
