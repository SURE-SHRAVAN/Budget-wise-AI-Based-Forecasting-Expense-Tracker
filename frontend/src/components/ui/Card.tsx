import type { HTMLAttributes, ReactNode } from "react";

export const Card = ({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) => (
  <div
    className={`rounded-lg border border-white/10 bg-white/[0.055] shadow-premium backdrop-blur-xl ${className}`}
    {...props}
  >
    {children}
  </div>
);
