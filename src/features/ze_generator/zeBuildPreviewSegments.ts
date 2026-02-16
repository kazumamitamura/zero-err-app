import type { ZeSchemaField } from "../ze_templates/types";

export interface ZePreviewSegment {
  type: "normal" | "replaced";
  text: string;
  index?: number;
}

/**
 * プレビュー表示用に本文を「通常」と「置換部分」に分割する。
 * 置換部分に index（①=0, ②=1）を付与し、色付け表示に使う。
 * 結合した文字列はコピー用（番号なし）と同一。
 */
export function zeBuildPreviewSegments(
  fixedText: string,
  values: Record<string, string>,
  fields: ZeSchemaField[]
): ZePreviewSegment[] {
  const segments: ZePreviewSegment[] = [];
  const keyToIndex = new Map(fields.map((f, i) => [f.key, i]));
  let pos = 0;
  const regex = /\{\{([^}]+)\}\}/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(fixedText)) !== null) {
    const key = match[1].trim();
    const index = keyToIndex.get(key) ?? -1;
    const value = key in values ? String(values[key] ?? "") : "";
    segments.push({ type: "normal", text: fixedText.slice(pos, match.index) });
    segments.push({ type: "replaced", text: value, index });
    pos = regex.lastIndex;
  }
  segments.push({ type: "normal", text: fixedText.slice(pos) });
  return segments;
}

/** セグメントを結合したプレーン文字列（コピー用・①②なし） */
export function zeSegmentsToPlainText(segments: ZePreviewSegment[]): string {
  return segments.map((s) => s.text).join("");
}
