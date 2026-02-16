"use client";

import { ZeTemplateCard } from "@/features/ze_templates";
import type { ZeTemplate } from "@/features/ze_templates/types";
import { ZeGeneratorWizard } from "@/features/ze_generator";
import { useState } from "react";

export default function TemplatesPage() {
  const [selected, setSelected] = useState<ZeTemplate | null>(null);
  const [templates] = useState<ZeTemplate[]>([]);

  if (selected) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <ZeGeneratorWizard template={selected} onBack={() => setSelected(null)} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Use Template</h1>
      {templates.length === 0 ? (
        <p className="text-slate-600">No templates yet. Create one from home.</p>
      ) : (
        <div className="grid gap-3">
          {templates.map((template) => (
            <ZeTemplateCard
              key={template.id}
              template={template}
              onSelect={setSelected}
            />
          ))}
        </div>
      )}
    </main>
  );
}
