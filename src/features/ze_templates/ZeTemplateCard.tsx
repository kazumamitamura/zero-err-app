import type { ZeTemplate } from "./types";

interface ZeTemplateCardProps {
  template: ZeTemplate;
  onSelect: (template: ZeTemplate) => void;
}

export function ZeTemplateCard({ template, onSelect }: ZeTemplateCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template)}
      className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
    >
      <span className="font-medium text-slate-800">{template.title}</span>
      {template.category && (
        <span className="ml-2 text-sm text-slate-500">{template.category}</span>
      )}
    </button>
  );
}
