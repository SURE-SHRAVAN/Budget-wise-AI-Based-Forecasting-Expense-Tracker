import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export const Input = ({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`min-h-12 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink shadow-sm outline-none transition placeholder:text-graphite/60 focus:border-accent focus:ring-4 focus:ring-accent/10 ${className}`}
    {...props}
  />
);

export const Select = ({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`min-h-12 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10 ${className}`}
    {...props}
  />
);

export const Field = ({ children, label }: { children: ReactNode; label: string }) => (
  <label className="grid gap-2 text-sm font-medium text-ink">
    {label}
    {children}
  </label>
);
