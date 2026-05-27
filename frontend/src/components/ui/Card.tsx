import type { HTMLAttributes, ReactNode } from "react";

export const Card = ({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) => (
  <div
    className={`rounded-xl border border-line bg-white shadow-card backdrop-blur-xl ${className}`}
    {...props}
  >
    {children}
  </div>
);
