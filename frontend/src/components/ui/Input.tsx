import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export const Input = ({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`min-h-12 w-full rounded-lg border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40 focus:ring-4 focus:ring-white/10 ${className}`}
    {...props}
  />
);

export const Select = ({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`min-h-12 w-full rounded-lg border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition focus:border-white/40 focus:ring-4 focus:ring-white/10 ${className}`}
    {...props}
  />
);

export const Field = ({ children, label }: { children: ReactNode; label: string }) => (
  <label className="grid gap-2 text-sm font-medium text-zinc-300">
    {label}
    {children}
  </label>
);
