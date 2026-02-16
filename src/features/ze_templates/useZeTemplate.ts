"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ZeTemplate } from "./types";
import { zeNormalizeContentSchema } from "./zeNormalizeContentSchema";

/**
 * 指定 id の ze_template を1件取得。RLS により権限のない場合はエラー。
 * content_schema は正規化し、id/key の違いで入力欄が消えないようにする。
 */
export function useZeTemplate(id: string | null) {
  const [template, setTemplate] = useState<ZeTemplate | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    supabase
      .from("ze_templates")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        setLoading(false);
        if (err) {
          setError(err);
          setTemplate(null);
          return;
        }
        const row = data as ZeTemplate;
        if (row?.content_schema) {
          row.content_schema = zeNormalizeContentSchema(row.content_schema);
        }
        setTemplate(row);
      });
  }, [id]);

  return { template, loading, error };
}
