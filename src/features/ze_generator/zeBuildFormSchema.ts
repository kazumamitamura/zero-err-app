import { z } from "zod";
// もし型定義のインポートパスが違う場合は調整してください
import { ZeContentSchema } from "@/features/ze_templates/types"; 

export function zeBuildFormSchema(schema: ZeContentSchema) {
  // 【重要】ここに : Record<string, z.ZodTypeAny> を追加して、
  // 必須(String)も任意(Optional)も許容するようにします。
  const shape: Record<string, z.ZodTypeAny> = {};

  // fieldsが存在しない場合のガード
  if (!schema.fields) {
    return z.object({});
  }

  for (const field of schema.fields) {
    const base = z.string();
    
    // required が true なら必須、false なら任意（デフォルト空文字）
    // ※ ここで型が分岐するため、上記の ZodTypeAny が必要になります
    shape[field.key] = field.required
      ? base.min(1, `${field.label}を入力してください`)
      : base.optional().default("");
  }

  return z.object(shape);
}