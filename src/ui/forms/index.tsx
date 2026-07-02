"use client";

import { forwardRef } from "react";
import { clsx } from "clsx";

/**
 * Primitivos de formulário do ContaUp.
 *
 * Todo formulário do app deve ser montado com estes componentes — eles são a
 * única fonte dos estilos de campo (cores vêm dos tokens MD3 em globals.css,
 * nunca de hex inline).
 */

// ─── Field: rótulo + controle + dica/erro ─────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, required, hint, error, children, className }: FieldProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label className="text-label-sm uppercase tracking-widest text-on-surface-variant/80">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-label-sm text-error">{error}</p>
      ) : hint ? (
        <p className="text-label-sm text-on-surface-variant/60">{hint}</p>
      ) : null}
    </div>
  );
}

// ─── Controles ────────────────────────────────────────────────────────────────

const controlClass = clsx(
  "w-full rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface",
  "bg-surface-container-low border border-outline-variant/40",
  "placeholder:text-on-surface-variant/40",
  "transition-all outline-none",
  "focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={clsx(controlClass, className)} {...props} />;
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={clsx(controlClass, "min-h-24 resize-y", className)} {...props} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={clsx(controlClass, "appearance-none pr-10 cursor-pointer [&>option]:bg-surface-container-high", className)}
          {...props}
        >
          {children}
        </select>
        <svg
          className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    );
  }
);

// ─── Botões ───────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "tonal" | "ghost" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-fixed active:scale-[0.98] font-semibold",
  tonal: "bg-surface-container-high text-on-surface border border-outline-variant/40 hover:bg-surface-container-highest",
  ghost: "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface",
  danger: "bg-secondary-container/40 text-secondary border border-secondary/20 hover:bg-secondary-container/60",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

// ─── Seção de formulário (a "ficha") ─────────────────────────────────────────

export function FormSection({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={clsx("flex flex-col gap-4", className)}>
      {title && (
        <h3 className="text-label-sm uppercase tracking-widest text-primary border-l-2 border-primary pl-3">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

// ─── Alerta inline (erros de submissão / avisos) ─────────────────────────────

export function FormAlert({ tone = "error", children }: { tone?: "error" | "info"; children: React.ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={clsx(
        "rounded-xl px-4 py-3 text-body-sm border",
        tone === "error"
          ? "bg-error-container/20 border-error/20 text-error"
          : "bg-surface-container-low border-outline-variant/40 text-on-surface-variant"
      )}
    >
      {children}
    </div>
  );
}
