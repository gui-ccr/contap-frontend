"use client";

import { useState, useEffect } from "react";
import { Plus, X, LayoutGrid, List, Search, Upload, Eye, EyeOff, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Funcionario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  cargo: string;
  foto?: string;
  iniciais: string;
  cor: string;
  ativo: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const CARGOS = [
  "Contador",
  "Analista Financeiro",
  "Assistente Contábil",
  "Gerente Financeiro",
  "Auditor Interno",
  "Analista Fiscal",
  "Controller",
  "Estagiário",
];

const FUNCIONARIOS_MOCK: Funcionario[] = [
  { id: 1, nome: "Ana Beatriz Santos",   email: "ana.santos@contaup.com.br",    cpf: "123.456.789-00", dataNascimento: "1992-03-15", cargo: "Gerente Financeiro",  iniciais: "AS", cor: "#4edea3", ativo: true  },
  { id: 2, nome: "Carlos Eduardo Lima",  email: "carlos.lima@contaup.com.br",   cpf: "234.567.890-11", dataNascimento: "1988-07-22", cargo: "Contador",            iniciais: "CL", cor: "#6366f1", ativo: true  },
  { id: 3, nome: "Fernanda Costa",       email: "fernanda.costa@contaup.com.br",cpf: "345.678.901-22", dataNascimento: "1995-11-08", cargo: "Analista Financeiro", iniciais: "FC", cor: "#f59e0b", ativo: true  },
  { id: 4, nome: "Rafael Oliveira",      email: "rafael.oliveira@contaup.com.br",cpf: "456.789.012-33",dataNascimento: "1990-01-30", cargo: "Auditor Interno",     iniciais: "RO", cor: "#ec4899", ativo: true  },
  { id: 5, nome: "Juliana Pereira",      email: "juliana.pereira@contaup.com.br",cpf: "567.890.123-44",dataNascimento: "1997-06-14", cargo: "Assistente Contábil", iniciais: "JP", cor: "#14b8a6", ativo: false },
  { id: 6, nome: "Thiago Rodrigues",     email: "thiago.rodrigues@contaup.com.br",cpf: "678.901.234-55",dataNascimento: "1985-09-03", cargo: "Controller",         iniciais: "TR", cor: "#f97316", ativo: true  },
  { id: 7, nome: "Mariana Almeida",      email: "mariana.almeida@contaup.com.br",cpf: "789.012.345-66",dataNascimento: "1999-04-25", cargo: "Estagiário",          iniciais: "MA", cor: "#a855f7", ativo: true  },
  { id: 8, nome: "Lucas Ferreira",       email: "lucas.ferreira@contaup.com.br", cpf: "890.123.456-77",dataNascimento: "1993-12-19", cargo: "Analista Fiscal",     iniciais: "LF", cor: "#0ea5e9", ativo: false },
];

const FORM_EMPTY = {
  nome: "",
  email: "",
  senha: "",
  cpf: "",
  dataNascimento: "",
  cargo: "",
  foto: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function calcIdade(iso: string) {
  if (!iso) return "";
  const hoje = new Date();
  const nasc = new Date(iso);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return `${idade} anos`;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function NovoFuncionarioModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (f: Omit<Funcionario, "id" | "iniciais" | "cor" | "ativo">) => void;
}) {
  const [form, setForm] = useState(FORM_EMPTY);
  const [showSenha, setShowSenha] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string>("");

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
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      />

      {/* Panel */}
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
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-bold"
              style={{ background: fotoPreview ? "transparent" : "#4edea320", color: "#4edea3" }}
            >
              {fotoPreview
                ? <img src={fotoPreview} alt="Foto" className="w-full h-full object-cover" />
                : <span className="material-symbols-outlined text-3xl">person</span>
              }
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
            <input
              required
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Ex: João da Silva"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass} style={{ color: "#6b7280" }}>E-mail *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="joao.silva@empresa.com"
              className={inputClass}
              style={inputStyle}
            />
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
              Esta será a senha inicial — o funcionário poderá alterá-la no primeiro acesso.
            </p>
          </div>

          {/* CPF + Data nascimento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>CPF *</label>
              <input
                required
                value={form.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: "#6b7280" }}>Data de nascimento *</label>
              <input
                required
                type="date"
                value={form.dataNascimento}
                onChange={(e) => handleChange("dataNascimento", e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Cargo */}
          <div>
            <label className={labelClass} style={{ color: "#6b7280" }}>Cargo *</label>
            <select
              required
              value={form.cargo}
              onChange={(e) => handleChange("cargo", e.target.value)}
              className={inputClass + " appearance-none"}
              style={inputStyle}
            >
              <option value="">Selecione um cargo</option>
              {CARGOS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              type="button"
              onClick={onClose}
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

// ─── Card view ────────────────────────────────────────────────────────────────

function FuncionarioCard({ f }: { f: Funcionario }) {
  return (
    <div
      className="rounded-3xl p-5 flex flex-col gap-4 group transition-all duration-200 hover:scale-[1.01]"
      style={{ background: "#1e1e1e" }}
    >
      {/* Avatar + status */}
      <div className="flex items-start justify-between">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold overflow-hidden"
          style={{ background: f.foto ? "transparent" : `${f.cor}20`, color: f.cor }}
        >
          {f.foto
            ? <img src={f.foto} alt={f.nome} className="w-full h-full object-cover" />
            : f.iniciais}
        </div>
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={f.ativo
            ? { background: "#4edea318", color: "#4edea3" }
            : { background: "rgba(255,255,255,0.05)", color: "#6b7280" }}
        >
          {f.ativo ? "Ativo" : "Inativo"}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>{f.nome}</p>
        <p className="text-xs mt-0.5 font-medium" style={{ color: f.cor }}>{f.cargo}</p>
        <p className="text-xs mt-2 truncate" style={{ color: "#6b7280" }}>{f.email}</p>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <p className="text-[10px]" style={{ color: "#6b7280" }}>Nascimento</p>
          <p className="text-xs font-medium mt-0.5" style={{ color: "#e5e2e1" }}>
            {formatDate(f.dataNascimento)}
            <span className="ml-1" style={{ color: "#6b7280" }}>· {calcIdade(f.dataNascimento)}</span>
          </p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: "#6b7280" }}
            title="Editar"
          >
            <Pencil size={13} />
          </button>
          <button
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:bg-red-500/10"
            style={{ color: "#6b7280" }}
            title="Remover"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── List row ─────────────────────────────────────────────────────────────────

function FuncionarioRow({ f }: { f: Funcionario }) {
  return (
    <tr
      className="transition-colors border-b"
      style={{ borderColor: "rgba(255,255,255,0.04)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Avatar + nome */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden"
            style={{ background: f.foto ? "transparent" : `${f.cor}20`, color: f.cor }}
          >
            {f.foto ? <img src={f.foto} alt={f.nome} className="w-full h-full object-cover" /> : f.iniciais}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>{f.nome}</p>
            <p className="text-xs" style={{ color: "#6b7280" }}>{f.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-xl" style={{ background: `${f.cor}15`, color: f.cor }}>
          {f.cargo}
        </span>
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs font-mono" style={{ color: "#6b7280" }}>
        {f.cpf}
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-xs" style={{ color: "#6b7280" }}>
        {formatDate(f.dataNascimento)}
      </td>
      <td className="px-4 py-3">
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={f.ativo
            ? { background: "#4edea318", color: "#4edea3" }
            : { background: "rgba(255,255,255,0.05)", color: "#6b7280" }}
        >
          {f.ativo ? "Ativo" : "Inativo"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <button
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: "#6b7280" }}
          >
            <Pencil size={13} />
          </button>
          <button
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:bg-red-500/10"
            style={{ color: "#6b7280" }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, total, pageSize, onPage }: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  // Show at most 5 page buttons, centered around current page
  const range: number[] = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    range.push(i);
  }

  return (
    <div
      className="flex items-center justify-between px-4 py-3.5 rounded-3xl"
      style={{ background: "#1e1e1e" }}
    >
      <p className="text-xs" style={{ color: "#6b7280" }}>
        <span style={{ color: "#e5e2e1" }}>{start}</span>
        {" – "}
        <span style={{ color: "#e5e2e1" }}>{end}</span>
        {" de "}
        <span style={{ color: "#e5e2e1" }}>{total}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30"
          style={{ background: "#242424", color: "#6b7280" }}
        >
          <ChevronLeft size={14} />
        </button>

        {range[0] > 1 && (
          <>
            <button
              onClick={() => onPage(1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold transition-all"
              style={{ background: "#242424", color: "#6b7280" }}
            >
              1
            </button>
            {range[0] > 2 && (
              <span className="text-xs px-0.5" style={{ color: "#6b7280" }}>…</span>
            )}
          </>
        )}

        {range.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold transition-all"
            style={page === p
              ? { background: "#4edea3", color: "#003824" }
              : { background: "#242424", color: "#6b7280" }}
          >
            {p}
          </button>
        ))}

        {range[range.length - 1] < totalPages && (
          <>
            {range[range.length - 1] < totalPages - 1 && (
              <span className="text-xs px-0.5" style={{ color: "#6b7280" }}>…</span>
            )}
            <button
              onClick={() => onPage(totalPages)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold transition-all"
              style={{ background: "#242424", color: "#6b7280" }}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30"
          style={{ background: "#242424", color: "#6b7280" }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(FUNCIONARIOS_MOCK);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Responsive page size: 4 on mobile (<768px), 8 on desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setPageSize(e.matches ? 8 : 4);
    };
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const filtered = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase()) ||
    f.cargo.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Reset to page 1 when search or pageSize changes
  useEffect(() => { setPage(1); }, [search, pageSize]);

  const ativos = funcionarios.filter((f) => f.ativo).length;

  const CORES = ["#4edea3", "#6366f1", "#f59e0b", "#ec4899", "#14b8a6", "#f97316", "#a855f7", "#0ea5e9"];

  function handleSave(data: Omit<Funcionario, "id" | "iniciais" | "cor" | "ativo">) {
    const iniciais = data.nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
    const cor = CORES[funcionarios.length % CORES.length];
    setFuncionarios((prev) => [
      ...prev,
      { id: Date.now(), ...data, iniciais, cor, ativo: true },
    ]);
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: "#e5e2e1" }}>
                Gestão de Funcionários
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                {ativos} ativo{ativos !== 1 ? "s" : ""} · {funcionarios.length} no total
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 shadow-lg self-start sm:self-auto"
              style={{ background: "#4edea3", color: "#003824" }}
            >
              <Plus size={15} strokeWidth={2.5} />
              Novo Funcionário
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#6b7280" }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, e-mail ou cargo..."
                className="w-full rounded-2xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
                style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.06)", color: "#e5e2e1" }}
              />
            </div>

            {/* View toggle */}
            <div
              className="flex items-center rounded-2xl p-1 shrink-0"
              style={{ background: "#1e1e1e" }}
            >
              <button
                onClick={() => setViewMode("grid")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={viewMode === "grid"
                  ? { background: "#4edea318", color: "#4edea3" }
                  : { color: "#6b7280" }}
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={viewMode === "list"
                  ? { background: "#4edea318", color: "#4edea3" }
                  : { color: "#6b7280" }}
              >
                <List size={14} />
                <span className="hidden sm:inline">Lista</span>
              </button>
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div
              className="rounded-3xl p-12 flex flex-col items-center justify-center gap-3"
              style={{ background: "#1e1e1e" }}
            >
              <span className="material-symbols-outlined text-5xl" style={{ color: "#6b7280" }}>
                group_off
              </span>
              <p className="text-sm font-medium" style={{ color: "#6b7280" }}>
                Nenhum funcionário encontrado
              </p>
            </div>
          )}

          {/* Grid view */}
          {viewMode === "grid" && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map((f) => (
                <FuncionarioCard key={f.id} f={f} />
              ))}
            </div>
          )}

          {/* List view */}
          {viewMode === "list" && filtered.length > 0 && (
            <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Funcionário", "Cargo", "CPF", "Nascimento", "Status", ""].map((h) => (
                        <th
                          key={h}
                          className={`px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest${h === "" ? " text-right" : ""}${["CPF", "Nascimento"].includes(h) ? " hidden md:table-cell" : ""}`}
                          style={{ color: "#6b7280", background: "#1a1a1a" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((f) => (
                      <FuncionarioRow key={f.id} f={f} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              total={filtered.length}
              pageSize={pageSize}
              onPage={setPage}
            />
          )}

        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <NovoFuncionarioModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
