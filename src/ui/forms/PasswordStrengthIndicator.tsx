import React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password?: string;
}

export function PasswordStrengthIndicator({ password = "" }: PasswordStrengthIndicatorProps) {
  const rules = [
    { label: "Mínimo 6 caracteres", test: (p: string) => p.length >= 6 },
    { label: "1 letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
    { label: "1 letra minúscula", test: (p: string) => /[a-z]/.test(p) },
    { label: "1 número", test: (p: string) => /\d/.test(p) },
    { label: "1 caractere especial", test: (p: string) => /[@$!%*?&\-]/.test(p) },
  ];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1 mt-2 p-3 rounded-xl bg-surface-container/50 border border-outline-variant/20">
      <p className="text-xs font-semibold text-on-surface-variant mb-1">Critérios de Senha Forte:</p>
      {rules.map((rule, idx) => {
        const met = rule.test(password);
        return (
          <div key={idx} className={`flex items-center gap-2 text-xs transition-colors ${met ? "text-emerald-400" : "text-on-surface-variant/50"}`}>
            {met ? <Check size={14} /> : <X size={14} />}
            <span>{rule.label}</span>
          </div>
        );
      })}
    </div>
  );
}
