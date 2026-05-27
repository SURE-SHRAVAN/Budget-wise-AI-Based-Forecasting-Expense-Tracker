import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-graphite shadow-md border-transparent",
  secondary: "bg-secondary text-ink border-line hover:bg-platinum",
  ghost: "bg-transparent text-graphite hover:bg-secondary hover:text-ink border-transparent",
  danger: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
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
