/** public.ze_templates の行型（Supabase 取得結果用） */
export type ZeTemplateRow = {
  id: string;
  owner_id: string;
  title: string;
  content_schema: ZeContentSchemaDb;
  fixed_text: string;
  is_public: boolean;
  category: string | null;
  created_at: string;
  updated_at: string;
};

export interface ZeContentSchemaDb {
  fields: Array<{
    key: string;
    label: string;
    type: "text" | "date" | "number";
    required?: boolean;
  }>;
}
