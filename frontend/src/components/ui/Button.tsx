import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-white text-black hover:bg-zinc-200 shadow-glow",
  secondary: "bg-white/10 text-white border-white/15 hover:bg-white/15",
  ghost: "bg-transparent text-zinc-300 hover:bg-white/10",
  danger: "bg-red-500/15 text-red-200 border-red-400/20 hover:bg-red-500/25",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

export const Button = ({ children, className = "", icon, variant = "primary", ...props }: ButtonProps) => (
  <button
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    {...props}
  >
    {icon}
    {children}
  </button>
);
