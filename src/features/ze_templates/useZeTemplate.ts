"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ZeTemplate } from "./types";

/**
 * 指定 id の ze_template を1件取得。RLS により権限のない場合はエラー。
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
        setTemplate(data as ZeTemplate);
      });
  }, [id]);

  return { template, loading, error };
}
