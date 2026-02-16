import type { ZeTemplate } from "./types";

interface ZeTemplateCardProps {
  template: ZeTemplate;
}

/** テンプレートカード（親で Link で包んで /templates/use/[id] へ遷移させる想定） */
export function ZeTemplateCard({ template }: ZeTemplateCardProps) {
  return (
    <div className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
      <span className="font-medium text-slate-800">{template.title}</span>
      {template.category && (
        <span className="ml-2 text-sm text-slate-500">{template.category}</span>
      )}
    </div>
  );
}
