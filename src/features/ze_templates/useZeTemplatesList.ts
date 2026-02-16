"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ZeTemplate } from "./types";

/**
 * ze_templates を取得。RLS により is_public = true または owner_id = auth.uid() のみ返る。
 */
export function useZeTemplatesList() {
  const [templates, setTemplates] = useState<ZeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("ze_templates")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        setLoading(false);
        if (err) {
          setError(err);
          return;
        }
        setTemplates((data as ZeTemplate[]) ?? []);
      });
  }, []);

  return { templates, loading, error };
}
