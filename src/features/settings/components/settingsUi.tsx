"use client";

import { useState } from "react";
import { Eye, EyeOff, ChevronDown, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type SaveState = "idle" | "loading" | "saved";

/** Input estilizado padrão ContaUp */
export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2.5 rounded-2xl text-sm text-white placeholder-gray-600 outline-none transition-all focus:ring-1 focus:ring-[#10b981]/50 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#242424" }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

/** Select estilizado */
export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl text-sm text-white outline-none appearance-none cursor-pointer transition-all focus:ring-1 focus:ring-[#10b981]/50"
          style={{ background: "#242424" }}
        >
          {options.map((o) => (
            <option
              key={o.value}
              value={o.value}
              style={{ background: "#242424" }}
            >
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        />
      </div>
    </div>
  );
}

/** Toggle switch */
export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 cursor-pointer"
      style={{ background: checked ? "#10b981" : "#333" }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

/** Card container de seção */
export function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl p-6 transition-all"
      style={{ background: "#1e1e1e" }}
    >
      {children}
    </div>
  );
}

/** Cabeçalho de seção com ícone */
export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: "#10b98118" }}
      >
        <Icon size={18} color="#10b981" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

/** Botão salvar com estados idle / loading / saved */
export function SaveButton({
  state,
  onClick,
}: {
  state: SaveState;
  onClick: () => void;
}) {
  return (
    <div
      className="flex justify-end mt-6 pt-5"
      style={{ borderTop: "1px solid #2a2a2a" }}
    >
      <button
        onClick={onClick}
        disabled={state === "loading"}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-lg min-w-40 justify-center  cursor-pointer"
        style={{
          background:
            state === "saved"
              ? "#059669"
              : "linear-gradient(135deg,#10b981,#059669)",
        }}
      >
        {state === "loading" && <Loader2 size={15} className="animate-spin" />}
        {state === "saved" && <Check size={15} />}
        {state === "loading"
          ? "Salvando..."
          : state === "saved"
            ? "Salvo!"
            : "Salvar alterações"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOOK: simula save com feedback visual
// ─────────────────────────────────────────────────────────────
export function useSave(onSave?: () => void) {
  const [state, setState] = useState<SaveState>("idle");
  const save = () => {
    setState("loading");
    setTimeout(() => {
      onSave?.();
      setState("saved");
      toast.success("Configurações salvas com sucesso!");
      setTimeout(() => setState("idle"), 2000);
    }, 600);
  };
  return { state, save };
}
