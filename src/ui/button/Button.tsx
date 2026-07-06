import { forwardRef } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "tonal" | "ghost" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-fixed active:scale-[0.98] font-semibold",
  tonal: "bg-surface-container-high text-on-surface border border-outline-variant/40 hover:bg-surface-container-highest",
  ghost: "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface",
  danger: "bg-secondary-container/40 text-secondary border border-secondary/20 hover:bg-secondary-container/60",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "primary", className, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-label-md",
          "transition-all cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          buttonVariants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
