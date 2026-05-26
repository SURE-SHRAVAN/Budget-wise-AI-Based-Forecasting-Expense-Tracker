import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "border-white/10 bg-white/10 text-zinc-200",
  success: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  danger: "border-red-300/20 bg-red-400/10 text-red-200",
};

export const Badge = ({ children, tone = "neutral" }: { children: ReactNode; tone?: BadgeTone }) => (
  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>
);
