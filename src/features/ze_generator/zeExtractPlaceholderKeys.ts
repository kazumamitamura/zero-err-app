/**
 * fixed_text から {{キー名}} のキー名を抽出する。
 * 入力欄が content_schema に無い場合のフォールバック用。
 */
export function zeExtractPlaceholderKeys(fixedText: string): string[] {
  const keys = new Set<string>();
  const regex = /\{\{([^}]+)\}\}/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(fixedText)) !== null) {
    keys.add(match[1].trim());
  }
  return Array.from(keys);
}
