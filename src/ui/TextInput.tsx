import { ChangeEvent, ReactNode } from "react";

export interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  iconName: string;
  error?: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  rightElement?: ReactNode;
  required?: boolean;
  autoComplete?: string;
}

export function TextInput({
  label,
  name,
  value,
  onChange,
  iconName,
  error,
  type = "text",
  placeholder,
  rightElement,
  required,
  autoComplete,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-base">
      <label className="text-label-md text-on-surface-variant" htmlFor={name}>
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-4 text-on-surface-variant/50 pointer-events-none select-none text-[20px]">
          {iconName}
        </span>
        <input
          className={[
            "w-full bg-surface-container-lowest border rounded-xl py-3 text-body-md text-on-surface",
            "placeholder:text-on-surface-variant/30 focus:outline-none transition-all pl-11",
            rightElement ? "pr-12" : "pr-4",
            error
              ? "border-error focus:border-error focus:ring-1 focus:ring-error/30"
              : "border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/30",
          ].join(" ")}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
        />
        {rightElement && (
          <div className="absolute right-4 flex items-center">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-label-sm text-error mt-xs">{error}</p>}
    </div>
  );
}
