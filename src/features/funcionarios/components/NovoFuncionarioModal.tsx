"use client";

import { useState } from "react";
import { Plus, X, Upload, Eye, EyeOff } from "lucide-react";

const CARGOS = [
  "Contador", "Analista Financeiro", "Assistente Contábil",
  "Gerente Financeiro", "Auditor Interno", "Analista Fiscal",
  "Controller", "Estagiário",
];

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

interface SaveData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  dataNascimento: string;
  cargo: string;
  foto: string;
}

interface NovoFuncionarioModalProps {
  onClose: () => void;
  onSave: (data: SaveData) => void;
}

const FORM_EMPTY = { nome: "", email: "", senha: "", cpf: "", dataNascimento: "", cargo: "", foto: "" };

export function NovoFuncionarioModal({ onClose, onSave }: NovoFuncionarioModalProps) {
  const [form, setForm] = useState(FORM_EMPTY);
  const [showSenha, setShowSenha] = useState(false);
  const [fotoPreview, setFotoPreview] = useState("");

  function handleChange(key: keyof typeof FORM_EMPTY, value: string) {
    setForm((f) => ({ ...f, [key]: key === "cpf" ? formatCPF(value) : value }));
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, foto: fotoPreview });
    onClose();
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
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{ background: "#1a1a1a" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
          style={{ background: "#1a1a1a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ color: "#e5e2e1" }}>Novo Funcionário</h2>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Preencha os dados para cadastrar</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: "#6b7280" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Foto */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: fotoPreview ? "transparent" : "#4edea320", color: "#4edea3" }}
            >
              {fotoPreview
                ? <img src={fotoPreview} alt="Foto" className="w-full h-full object-cover" />
                : <span className="material-symbols-outlined text-3xl">person</span>}
            </div>
            <label
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium cursor-pointer transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280" }}
            >
              <Upload size={13} />
              Escolher foto
              <input type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
            </label>
          </div>

          {/* Nome */}
          <div>
            <label className={labelClass} style={{ color: "#6b7280" }}>Nome completo *</label>
            <input required value={form.nome} onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Ex: João da Silva" className={inputClass} style={inputStyle} />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass} style={{ color: "#6b7280" }}>E-mail *</label>
            <input required type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)}
              placeholder="joao.silva@empresa.com" className={inputClass} style={inputStyle} />
          </div>

          {/* Senha */}
          <div>
            <label className={labelClass} style={{ color: "#6b7280" }}>Senha padrão *</label>
            <div className="relative">
              <input
                required
                type={showSenha ? "text" : "password"}
                value={form.senha}
                onChange={(e) => handleChange("senha", e.target.value)}
                placeholder="Senha inicial do funcionário"
                className={inputClass + " pr-10"}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowSenha((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
                style={{ color: "#6b7280" }}
              >
                {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-[10px] mt-1" style={{ color: "#6b7280" }}>
              Senha inicial — o funcionário poderá alterá-la no primeiro acesso.
            </p>
          </div>

          {/* CPF + Data nascimento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>CPF *</label>
              <input required value={form.cpf} onChange={(e) => handleChange("cpf", e.target.value)}
                placeholder="000.000.000-00" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>Data de nascimento *</label>
              <input required type="date" value={form.dataNascimento}
                onChange={(e) => handleChange("dataNascimento", e.target.value)}
                className={inputClass} style={inputStyle} />
            </div>
          </div>

          {/* Cargo */}
          <div>
            <label className={labelClass} style={{ color: "#6b7280" }}>Cargo *</label>
            <select required value={form.cargo} onChange={(e) => handleChange("cargo", e.target.value)}
              className={inputClass + " appearance-none"} style={inputStyle}>
              <option value="">Selecione um cargo</option>
              {CARGOS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 rounded-2xl text-sm font-medium transition-all hover:bg-white/5"
              style={{ color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#4edea3", color: "#003824" }}
            >
              <Plus size={14} strokeWidth={2.5} />
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
