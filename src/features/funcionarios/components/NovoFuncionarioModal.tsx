"use client";

import { useState } from "react";
import { Eye, EyeOff, Plus, X } from "lucide-react";

const CARGOS = [
  { label: "Gerente", value: "GERENTE" },
  { label: "Caixa", value: "CAIXA" },
] as const;

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export interface NovoFuncionarioData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  dataNascimento: string;
  cargo: "GERENTE" | "CAIXA";
  foto: string;
}

interface NovoFuncionarioModalProps {
  onClose: () => void;
  onSave: (data: NovoFuncionarioData) => Promise<void>;
}

const FORM_EMPTY: NovoFuncionarioData = {
  nome: "",
  email: "",
  senha: "",
  cpf: "",
  dataNascimento: "",
  cargo: "CAIXA",
  foto: "",
};

export function NovoFuncionarioModal({ onClose, onSave }: NovoFuncionarioModalProps) {
  const [form, setForm] = useState<NovoFuncionarioData>(FORM_EMPTY);
  const [showSenha, setShowSenha] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(key: keyof NovoFuncionarioData, value: string) {
    setForm((f) => ({ ...f, [key]: key === "cpf" ? formatCPF(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
            <h2 className="text-base font-bold" style={{ color: "#e5e2e1" }}>Novo funcionario</h2>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Preencha os dados para cadastrar</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5 cursor-pointer"
            style={{ color: "#6b7280" }}
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: form.foto ? "transparent" : "#4edea320", color: "#4edea3" }}
            >
              {form.foto
                ? <img src={form.foto} alt="Foto" className="w-full h-full object-cover" />
                : <span className="material-symbols-outlined text-3xl">person</span>}
            </div>
            <input
              type="url"
              value={form.foto}
              onChange={(e) => handleChange("foto", e.target.value)}
              placeholder="URL da foto (opcional)"
              className="w-full max-w-md rounded-xl px-3 py-2 text-xs outline-none transition-all focus:ring-1"
              style={inputStyle}
            />
          </div>

          <div>
            <label className={labelClass} style={{ color: "#6b7280" }}>Nome completo *</label>
            <input required value={form.nome} onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Ex: Joao da Silva" className={inputClass} style={inputStyle} />
          </div>

          <div>
            <label className={labelClass} style={{ color: "#6b7280" }}>E-mail *</label>
            <input required type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)}
              placeholder="joao.silva@empresa.com" className={inputClass} style={inputStyle} />
          </div>

          <div>
            <label className={labelClass} style={{ color: "#6b7280" }}>Senha padrao *</label>
            <div className="relative">
              <input
                required
                minLength={6}
                type={showSenha ? "text" : "password"}
                value={form.senha}
                onChange={(e) => handleChange("senha", e.target.value)}
                placeholder="Senha inicial do funcionario"
                className={inputClass + " pr-10"}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowSenha((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70 cursor-pointer"
                style={{ color: "#6b7280" }}
                aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>CPF</label>
              <input value={form.cpf} onChange={(e) => handleChange("cpf", e.target.value)}
                placeholder="000.000.000-00" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>Data de nascimento</label>
              <input type="date" value={form.dataNascimento}
                onChange={(e) => handleChange("dataNascimento", e.target.value)}
                className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className={labelClass} style={{ color: "#6b7280" }}>Cargo *</label>
            <select required value={form.cargo} onChange={(e) => handleChange("cargo", e.target.value)}
              className={inputClass + " appearance-none"} style={inputStyle}>
              {CARGOS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
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
              {saving ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
