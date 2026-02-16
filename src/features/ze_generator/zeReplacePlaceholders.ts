/**
 * fixed_text 内の {{key}} プレースホルダーを values の値で置換する。
 * ジェネレーターの中核ロジック。
 */
export function zeReplacePlaceholders(
  fixedText: string,
  values: Record<string, string>
): string {
  return Object.entries(values).reduce(
    (text, [key, value]) =>
      text.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value ?? ""),
    fixedText
  );
}
