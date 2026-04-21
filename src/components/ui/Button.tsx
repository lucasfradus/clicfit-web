import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "dark";

const variantClasses: Record<Variant, string> = {
  primary: "bg-yellow text-ink hover:bg-white",
  outline:
    "border border-cream/40 text-cream hover:border-yellow hover:text-yellow",
  dark: "bg-ink text-yellow hover:bg-[#1a1a1a]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-3 px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors";

type ButtonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = ButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function LinkButton({
  variant = "primary",
  className,
  children,
  href,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      href={href}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...rest}
    >
      {children}
    </a>
  );
}
