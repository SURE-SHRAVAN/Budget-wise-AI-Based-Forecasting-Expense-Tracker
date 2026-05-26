import type { ReactNode } from "react";

export const EmptyState = ({ action, title, text }: { action?: ReactNode; title: string; text: string }) => (
  <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.035] p-8 text-center">
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-400">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  </div>
);
