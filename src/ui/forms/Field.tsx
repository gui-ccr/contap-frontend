import { clsx } from "clsx";

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
