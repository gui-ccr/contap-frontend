import { forwardRef } from "react";
import { clsx } from "clsx";

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
