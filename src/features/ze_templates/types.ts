/** DB ze_templates および UI 用のテンプレート型 */
export interface ZeTemplate {
  id: string;
  owner_id: string;
  title: string;
  content_schema: ZeContentSchema;
  fixed_text: string;
  is_public: boolean;
  category: string | null;
  created_at?: string;
  updated_at?: string;
}

/** content_schema の JSON 構造（入力フィールド定義の配列） */
export interface ZeContentSchema {
  fields: ZeSchemaField[];
}

/** 1 フィールドの定義（key, label, type, required） */
export interface ZeSchemaField {
  key: string;
  label: string;
  type: "text" | "date" | "number";
  required?: boolean;
}
