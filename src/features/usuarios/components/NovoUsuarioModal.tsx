"use client";

import { useState, useEffect } from "react";
import { Plus, X, Camera, Trash2 } from "lucide-react";
import { cargosService, type CargoBackend } from "@/features/cargos/cargosService";
import { funcionariosService } from "@/features/funcionarios/funcionariosService";
import type { FuncionarioBackend } from "@/features/funcionarios/types/types";

export interface NovoUsuarioData {
  modo: "novo" | "existente" | "editar";
  nome: string;
  email: string;
  cargo: string;
  cpf_cnpj?: string;
  salario?: number;
  data_base_pagamento?: string;
  funcionario_id?: string;
  ativo?: boolean;
  foto_url?: string;
  fotoFile?: File | null;
  removerFoto?: boolean;
}

interface NovoUsuarioModalProps {
  onClose: () => void;
  onSave: (data: NovoUsuarioData) => Promise<void>;
  initialData?: NovoUsuarioData;
}

const FORM_EMPTY: NovoUsuarioData = {
  modo: "existente",
  nome: "",
  email: "",
  cargo: "",
  cpf_cnpj: "",
  salario: 0,
  data_base_pagamento: "",
  funcionario_id: "",
};

export function NovoUsuarioModal({ onClose, onSave, initialData }: NovoUsuarioModalProps) {
  const [form, setForm] = useState<NovoUsuarioData>(initialData || FORM_EMPTY);
  const [cargos, setCargos] = useState<CargoBackend[]>([]);
  const [funcionarios, setFuncionarios] = useState<FuncionarioBackend[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      cargosService.listarCargos(),
      funcionariosService.listarFuncionarios()
    ]).then(([resCargos, resFuncionarios]) => {
      setCargos(resCargos);
      setFuncionarios(resFuncionarios.filter(f => !!f.email));
      
      if (!initialData) {
        const upd = { ...form };
        if (resCargos.length > 0) upd.cargo = resCargos[0].id;
        if (resFuncionarios.filter(f => !!f.email).length > 0) upd.funcionario_id = resFuncionarios.filter(f => !!f.email)[0].id;
        setForm(upd);
      }
    }).catch(() => {
      console.warn("Nao foi possivel carregar os dados iniciais");
    });
  }, [initialData]);

  function handleChange(key: keyof NovoUsuarioData, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setForm(f => ({ ...f, fotoFile: file, foto_url: objectUrl, removerFoto: false }));
    }
  }

  function handleRemoveFoto() {
    setForm(f => ({ ...f, fotoFile: null, foto_url: undefined, removerFoto: true }));
  }

  function formatCurrencyInput(value: string | number) {
    const numeric = typeof value === "string" ? Number(value.replace(/\D/g, "")) / 100 : value;
    if (isNaN(numeric)) return "";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numeric);
  }

  function parseCurrency(value: string) {
    return Number(value.replace(/\D/g, "")) / 100;
  }
  
  function formatCpfCnpj(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return digits
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let finalData = { ...form };

    if (form.modo === "novo") {
      if (!form.email || !form.email.includes("@") || !form.email.includes(".")) {
        setError("Por favor, insira um e-mail válido.");
        return;
      }
      if (!form.cpf_cnpj) {
        setError("CPF ou CNPJ é obrigatório.");
        return;
      }
    } else if (form.modo === "existente") {
      if (!form.funcionario_id) {
        setError("Selecione um funcionário.");
        return;
      }
      const func = funcionarios.find(f => f.id === form.funcionario_id);
      if (func) {
        finalData.nome = func.nome;
        finalData.email = func.email;
        finalData.cargo = func.cargo;
        finalData.cpf_cnpj = func.cpf_cnpj;
        finalData.foto_url = func.foto_url;
      }
    }
    
    try {
      setSaving(true);
      setError("");
      await onSave(finalData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel cadastrar o usuario.");
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
            <h2 className="text-base font-bold" style={{ color: "#e5e2e1" }}>{initialData ? "Editar acesso ao sistema" : "Conceder acesso ao sistema"}</h2>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{initialData ? "Atualize os dados de acesso" : "Escolha se deseja cadastrar um novo ou selecionar um funcionário existente"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5 cursor-pointer"
            style={{ color: "#6b7280" }}
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Abas */}
        {form.modo !== "editar" && (
          <div className="px-6 pt-5 pb-2 border-b border-white/5 flex gap-4">
            <button
              onClick={() => setForm(f => ({ ...f, modo: "existente", error: "" }))}
              className={`pb-3 text-sm font-semibold transition-colors ${form.modo === "existente" ? "border-b-2 border-[#4edea3] text-[#4edea3]" : "text-gray-500 hover:text-gray-300"}`}
            >
              Funcionário Existente
            </button>
            <button
              onClick={() => setForm(f => ({ ...f, modo: "novo", error: "" }))}
              className={`pb-3 text-sm font-semibold transition-colors ${form.modo === "novo" ? "border-b-2 border-[#4edea3] text-[#4edea3]" : "text-gray-500 hover:text-gray-300"}`}
            >
              Cadastrar Novo
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {form.modo === "existente" ? (
            <div className="space-y-4">
              <div>
                <label className={labelClass} style={{ color: "#6b7280" }}>Selecione o Funcionário *</label>
                <select required value={form.funcionario_id} onChange={(e) => handleChange("funcionario_id", e.target.value)}
                  className={inputClass + " appearance-none"} style={inputStyle}>
                  {funcionarios.length === 0 && <option value="">Nenhum funcionário com e-mail cadastrado</option>}
                  {funcionarios.map((c) => <option key={c.id} value={c.id}>{c.nome} ({c.email})</option>)}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Somente funcionários que já possuem e-mail cadastrado aparecem na lista.
                </p>
              </div>
              <div className="p-4 rounded-xl text-sm text-gray-300" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                ℹ️ O funcionário receberá acesso usando o e-mail dele e a senha será definida inicialmente como o próprio CPF/CNPJ. O cargo no sistema será o mesmo que o funcionário já possui.
              </div>
            </div>
          ) : form.modo === "editar" ? (
            <>
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="relative group">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center bg-cover bg-center bg-no-repeat transition-all"
                    style={{
                      background: form.foto_url 
                        ? `url(${form.foto_url}) center/cover no-repeat` 
                        : "linear-gradient(135deg, #4edea3, #10b981)",
                      border: "2px solid #242424"
                    }}
                  >
                    {!form.foto_url && (
                      <span className="text-xl font-bold text-[#003824]">
                        {form.nome ? form.nome.charAt(0).toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                    <Camera size={16} className="mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Alterar</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                  {form.foto_url && (
                    <button
                      type="button"
                      onClick={handleRemoveFoto}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg border-2 border-[#1a1a1a]"
                      title="Remover foto"
                    >
                      <Trash2 size={12} className="text-white" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className={labelClass} style={{ color: "#6b7280" }}>Nome completo *</label>
                  <input required value={form.nome} onChange={(e) => handleChange("nome", e.target.value)}
                    placeholder="Ex: Joao da Silva" className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} style={{ color: "#6b7280" }}>Cargo *</label>
                  <select required value={form.cargo} onChange={(e) => handleChange("cargo", e.target.value)}
                    className={inputClass + " appearance-none"} style={inputStyle}>
                    {cargos.length === 0 && <option value="">Sem cargos criados</option>}
                    {cargos.map((c) => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer mt-6">
                    <input type="checkbox" checked={form.ativo} onChange={(e) => handleChange("ativo", e.target.checked ? 1 : 0)} 
                      className="w-4 h-4 rounded text-[#4edea3] focus:ring-[#4edea3]" style={{ background: "#242424", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <span className="text-sm" style={{ color: "#e5e2e1" }}>Usuário Ativo</span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="relative group">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center bg-cover bg-center bg-no-repeat transition-all"
                    style={{
                      background: form.foto_url 
                        ? `url(${form.foto_url}) center/cover no-repeat` 
                        : "linear-gradient(135deg, #4edea3, #10b981)",
                      border: "2px solid #242424"
                    }}
                  >
                    {!form.foto_url && (
                      <span className="text-xl font-bold text-[#003824]">
                        {form.nome ? form.nome.charAt(0).toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                    <Camera size={16} className="mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Alterar</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                  {form.foto_url && (
                    <button
                      type="button"
                      onClick={handleRemoveFoto}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg border-2 border-[#1a1a1a]"
                      title="Remover foto"
                    >
                      <Trash2 size={12} className="text-white" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} style={{ color: "#6b7280" }}>CPF ou CNPJ *</label>
                  <input required type="text" value={formatCpfCnpj(form.cpf_cnpj || "")}
                    onChange={(e) => handleChange("cpf_cnpj", formatCpfCnpj(e.target.value))}
                    placeholder="Apenas números" className={inputClass} style={inputStyle} />
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} style={{ color: "#6b7280" }}>Salário (R$) *</label>
                  <input required type="text" value={formatCurrencyInput(form.salario || 0) || ""}
                    onChange={(e) => handleChange("salario", parseCurrency(e.target.value))}
                    placeholder="R$ 0,00" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className={labelClass} style={{ color: "#6b7280" }}>Dia do Pagamento *</label>
                  <input required type="date" value={form.data_base_pagamento || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange("data_base_pagamento", val);
                    }}
                    className={inputClass} style={inputStyle} />
                </div>
              </div>
              
              <div className="p-3 rounded-xl text-xs text-gray-400" style={{ background: "rgba(255,255,255,0.03)" }}>
                ℹ️ O CPF/CNPJ informado será a senha padrão inicial do usuário.
              </div>
            </>
          )}

          {error && (
            <div className="rounded-2xl px-4 py-3 text-xs font-medium mt-2" style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
              {saving ? "Salvando..." : (initialData ? "Salvar" : "Conceder acesso")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
