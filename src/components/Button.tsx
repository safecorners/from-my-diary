import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "border-primary bg-primary text-on-primary hover:bg-body",
  secondary: "border-hairline bg-canvas text-ink hover:bg-surface-soft",
  destructive: "border-error/40 bg-surface-raised text-error hover:bg-error/5",
  ghost: "border-transparent bg-transparent text-body hover:bg-surface-soft",
};

export function Button({ className = "", variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition disabled:opacity-55 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
