"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Plus, X } from "lucide-react";
import { cargosService, type CargoBackend } from "@/features/cargos/cargosService";

function formatCpfCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    return digits
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
}

function formatCurrency(value: string | number) {
  const numeric = typeof value === "string" ? Number(value.replace(/\D/g, "")) / 100 : value;
  if (isNaN(numeric) || numeric === 0) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(numeric);
}

function parseCurrency(value: string) {
  return Number(value.replace(/\D/g, "")) / 100;
}

export interface NovoFuncionarioData {
  nome: string;
  email?: string;
  cpf_cnpj: string;
  salario: number;
  dia_pagamento: number;
  data_base_pagamento?: string;
  cargo: string;
}

interface NovoFuncionarioModalProps {
  onClose: () => void;
  onSave: (data: NovoFuncionarioData) => Promise<void>;
  initialData?: NovoFuncionarioData;
}

const FORM_EMPTY: NovoFuncionarioData = {
  nome: "",
  email: "",
  cpf_cnpj: "",
  salario: 0,
  dia_pagamento: 1,
  data_base_pagamento: "",
  cargo: "",
};

export function NovoFuncionarioModal({ onClose, onSave, initialData }: NovoFuncionarioModalProps) {
  const [form, setForm] = useState<NovoFuncionarioData>(initialData || FORM_EMPTY);
  const [cargos, setCargos] = useState<CargoBackend[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargosService.listarCargos().then(res => {
      setCargos(res);
      if (res.length > 0 && !initialData) {
        setForm(f => ({ ...f, cargo: res[0].id }));
      }
    }).catch(() => {
      console.warn("Nao foi possivel carregar cargos");
    });
  }, [initialData]);

  function handleChange(key: keyof NovoFuncionarioData, value: any) {
    setForm((f) => ({ ...f, [key]: key === "cpf_cnpj" ? formatCpfCnpj(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.email.includes("@") || !form.email.includes(".")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel cadastrar o funcionario.");
    } finally {
      setSaving(false);
    }
  }

  const labelClass = "text-[10px] font-semibold uppercase tracking-widest mb-1.5 block";
  const inputClass = "w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all focus:ring-1";
  const inputStyle = { background: "#242424", border: "1px solid rgba(255,255,255,0.08)", color: "#e5e2e1" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{ background: "#1a1a1a" }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
          style={{ background: "#1a1a1a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ color: "#e5e2e1" }}>{initialData ? "Editar funcionário (RH)" : "Novo funcionário (RH)"}</h2>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Preencha os dados trabalhistas para {initialData ? "salvar" : "cadastrar"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5 cursor-pointer"
            style={{ color: "#6b7280" }}
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>Nome completo *</label>
              <input required value={form.nome} onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Ex: Joao da Silva" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>E-mail *</label>
              <input required type="email" value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Ex: joao@email.com" className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>CPF ou CNPJ *</label>
              <input required value={form.cpf_cnpj} onChange={(e) => handleChange("cpf_cnpj", e.target.value)}
                placeholder="000.000.000-00 ou 00.000.000/0000-00" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>Salário (R$) *</label>
              <input required type="text" value={formatCurrency(form.salario) || ""} 
                onChange={(e) => handleChange("salario", parseCurrency(e.target.value))}
                placeholder="R$ 0,00" className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>Dia do Pagamento *</label>
              <input required type="date" value={form.data_base_pagamento || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const dia = val ? parseInt(val.split("-")[2], 10) : 1;
                  setForm((f) => ({ ...f, data_base_pagamento: val, dia_pagamento: dia }));
                }}
                className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>Cargo *</label>
              <select required value={form.cargo} onChange={(e) => handleChange("cargo", e.target.value)}
                className={inputClass + " appearance-none"} style={inputStyle}>
                {cargos.length === 0 && <option value="">Sem cargos criados</option>}
                {cargos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl px-4 py-3 text-xs font-medium" style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 rounded-2xl text-sm font-medium transition-all hover:bg-white/5 cursor-pointer"
              style={{ color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 cursor-pointer disabled:cursor-not-allowed"
              style={{ background: saving ? "#2f8f69" : "#4edea3", color: "#003824" }}
            >
              <Plus size={14} strokeWidth={2.5} />
              {saving ? "Salvando..." : (initialData ? "Salvar" : "Cadastrar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
