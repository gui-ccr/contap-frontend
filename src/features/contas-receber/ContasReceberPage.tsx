"use client";

import { useState, useEffect } from "react";
import { contasReceberService, ContaReceberBackend } from "./contasReceberService";
import { Modal } from "@/ui/Modal";
import {
  Banknote,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingUp,
  X,
} from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("pt-BR");
}

function getDiffDays(dateStr: string): number {
  const venc = new Date(dateStr + "T12:00:00Z");
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.ceil((venc.getTime() - hoje.getTime()) / 86400000);
}

function StatusBadge({ recebido, dataPrevisao }: { recebido: boolean; dataPrevisao: string }) {
  if (recebido) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400">
        <CheckCircle size={11} /> Recebido
      </span>
    );
  }
  const diff = getDiffDays(dataPrevisao);
  if (diff < 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400">
        <AlertTriangle size={11} /> Atrasado ({Math.abs(diff)}d)
      </span>
    );
  }
  if (diff <= 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400">
        <Clock size={11} /> Vence em {diff}d
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400">
      <Calendar size={11} /> {formatDate(dataPrevisao)}
    </span>
  );
}

export default function ContasReceberPage() {
  const [contas, setContas] = useState<ContaReceberBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filter, setFilter] = useState<"todos" | "pendente" | "recebido">("todos");

  const [form, setForm] = useState({ origem: "", valor: "", data_previsao: "" });

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const carregarContas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contasReceberService.listarContasReceber();
      setContas(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar contas a receber.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarContas(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contasReceberService.criarContaReceber({
        origem: form.origem,
        valor: Number(form.valor),
        data_previsao: form.data_previsao,
      });
      showToast("Conta a receber cadastrada com sucesso!", "success");
      setForm({ origem: "", valor: "", data_previsao: "" });
      setShowForm(false);
      carregarContas();
    } catch (err: any) {
      showToast(err.message || "Erro ao salvar conta.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBaixar = async (id: string) => {
    try {
      await contasReceberService.baixarConta(id);
      showToast("Conta recebida e lançamento contábil gerado!", "success");
      carregarContas();
    } catch (err: any) {
      showToast(err.message || "Erro ao dar baixa.", "error");
    }
  };

  const filtradas = contas.filter(c => {
    if (filter === "pendente") return !c.recebido;
    if (filter === "recebido") return c.recebido;
    return true;
  });

  const totalPendente = contas.filter(c => !c.recebido).reduce((s, c) => s + c.valor, 0);
  const totalRecebido = contas.filter(c => c.recebido).reduce((s, c) => s + c.valor, 0);
  const totalAtrasado = contas.filter(c => !c.recebido && getDiffDays(c.data_previsao) < 0).reduce((s, c) => s + c.valor, 0);

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all border focus:border-[#4edea3]/50";
  const inputStyle = { background: "#242424", borderColor: "rgba(255,255,255,0.08)", color: "#e5e2e1" };

  return (
    <div className="flex-1 flex flex-col min-h-screen text-white">
      <main className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Toast */}
          {toast && (
            <div
              className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium ${
                toast.type === "success"
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/15 border border-red-500/30 text-red-400"
              }`}
            >
              {toast.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              {toast.msg}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Gestão Financeira</p>
              <h1 className="text-2xl font-bold tracking-tight mt-0.5">Contas a Receber</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#4edea3", color: "#003824" }}
            >
              <Plus size={16} /> Nova Conta
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Pendente", value: totalPendente, color: "#4edea3", bg: "rgba(78,222,163,0.08)", icon: <Banknote size={18} /> },
              { label: "Total Atrasado", value: totalAtrasado, color: "#ef4444", bg: "rgba(239,68,68,0.08)", icon: <AlertTriangle size={18} /> },
              { label: "Total Recebido", value: totalRecebido, color: "#6366f1", bg: "rgba(99,102,241,0.08)", icon: <CheckCircle size={18} /> },
            ].map(card => (
              <div key={card.label} className="rounded-2xl p-5 flex items-center justify-between" style={{ background: card.bg }}>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: card.color }}>{card.label}</p>
                  <p className="text-xl font-bold" style={{ color: card.color }}>{formatCurrency(card.value)}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${card.color}20`, color: card.color }}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-xs text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#1a1a1a" }}>
            {(["todos", "pendente", "recebido"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                style={filter === f ? { background: "#4edea3", color: "#003824" } : { color: "#6b7280" }}
              >
                {f === "todos" ? "Todos" : f === "pendente" ? "Pendentes" : "Recebidos"}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#1e1e1e" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}>
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className="text-[#4edea3]" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Títulos a Receber</span>
              </div>
              <span className="text-[11px] text-gray-600">{filtradas.length} registro(s)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {["Cliente / Origem", "Previsão", "Valor", "Status", ""].map(h => (
                      <th key={h} className="px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <div className="w-6 h-6 border-2 border-[#4edea3] border-t-transparent rounded-full animate-spin" />
                          Carregando contas...
                        </div>
                      </td>
                    </tr>
                  ) : filtradas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <Banknote size={32} className="text-gray-700" />
                          <p className="text-sm">Nenhuma conta encontrada</p>
                          <button onClick={() => setShowForm(true)} className="text-xs text-[#4edea3] hover:underline">
                            + Cadastrar primeira conta
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtradas.map((c, i) => (
                      <tr
                        key={c.id}
                        className="transition-colors hover:bg-white/[0.02]"
                        style={{ borderBottom: i < filtradas.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                              style={{ background: "rgba(78,222,163,0.1)", color: "#4edea3" }}
                            >
                              {c.origem.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-200">{c.origem}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(c.data_previsao)}</td>
                        <td className="px-5 py-4 font-semibold text-white">{formatCurrency(c.valor)}</td>
                        <td className="px-5 py-4">
                          <StatusBadge recebido={c.recebido} dataPrevisao={c.data_previsao} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          {!c.recebido && (
                            <button
                              onClick={() => handleBaixar(c.id)}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80 active:scale-95"
                              style={{ background: "#4edea3", color: "#003824" }}
                            >
                              Dar Baixa
                            </button>
                          )}
                          {c.recebido && c.data_recebimento && (
                            <span className="text-[11px] text-gray-600">
                              Recebido em {formatDate(c.data_recebimento)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      {/* Modal Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)} maxWidth="576px">
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}>
              <div className="flex items-center gap-2">
                <Banknote size={15} className="text-[#4edea3]" />
                <span className="text-sm font-semibold text-white">Nova Conta a Receber</span>
              </div>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Cliente / Origem</label>
                <input
                  type="text"
                  value={form.origem}
                  onChange={e => setForm(p => ({ ...p, origem: e.target.value }))}
                  placeholder="Ex: Cliente João, Serviço XYZ..."
                  className={inputCls}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.valor}
                  onChange={e => setForm(p => ({ ...p, valor: e.target.value }))}
                  placeholder="0,00"
                  className={inputCls}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Data Prevista</label>
                <input
                  type="date"
                  value={form.data_previsao}
                  onChange={e => setForm(p => ({ ...p, data_previsao: e.target.value }))}
                  className={inputCls}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer"
                  style={{ background: "#4edea3", color: "#003824" }}
                >
                  {submitting ? "Salvando..." : "Salvar Conta"}
                </button>
              </div>
            </form>
      </Modal>
    </div>
  );
}
