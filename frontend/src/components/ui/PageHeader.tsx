import type { ReactNode } from "react";

export const PageHeader = ({ action, eyebrow, title }: { action?: ReactNode; eyebrow: string; title: string }) => (
  <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{eyebrow}</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
    </div>
    {action}
  </div>
);
