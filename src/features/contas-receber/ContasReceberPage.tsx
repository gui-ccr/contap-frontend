"use client";

import { useState, useEffect } from "react";
import { contasReceberService, ContaReceberBackend } from "./contasReceberService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
  Filter
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

const TIPOS_RECEBER = ["Venda de Produtos", "Prestação de Serviços", "Rendimentos", "Empréstimos", "Outros"];

export default function ContasReceberPage() {
  const [contas, setContas] = useState<ContaReceberBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [filter, setFilter] = useState<"todos" | "pendente" | "recebido">("todos");
  
  const getFirstDayOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  };
  const getLastDayOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
  };

  const [dataInicio, setDataInicio] = useState(getFirstDayOfMonth);
  const [dataFim, setDataFim] = useState(getLastDayOfMonth);
  const [tipoFiltro, setTipoFiltro] = useState("");

  const [form, setForm] = useState({ origem: "", valor: "", tipo: "Outros", data_previsao: "" });

  function formatCurrencyInput(value: string | number) {
    if (value === "" || value === null || value === undefined) return "";
    const numeric = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numeric)) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(numeric);
  }

  function parseCurrency(value: string) {
    return (Number(value.replace(/\D/g, "")) / 100).toString();
  }

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

  const abrirModalNovo = () => {
    setEditingId(null);
    setForm({ origem: "", valor: "", tipo: "Outros", data_previsao: "" });
    setShowForm(true);
  };

  const handleEdit = (c: ContaReceberBackend) => {
    setEditingId(c.id);
    setForm({
      origem: c.origem,
      valor: c.valor.toString(),
      tipo: c.tipo,
      data_previsao: c.data_previsao
    });
    setShowForm(true);
  };

  const fecharModal = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ origem: "", valor: "", tipo: "Outros", data_previsao: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await contasReceberService.atualizarContaReceber(editingId, {
          origem: form.origem,
          valor: Number(form.valor),
          tipo: form.tipo,
          data_previsao: form.data_previsao,
        });
        toast.success("Conta atualizada com sucesso!");
      } else {
        await contasReceberService.criarContaReceber({
          origem: form.origem,
          valor: Number(form.valor),
          tipo: form.tipo,
          data_previsao: form.data_previsao,
        });
        toast.success("Conta cadastrada com sucesso!");
      }
      fecharModal();
      carregarContas();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar conta.");
    } finally {
      setSubmitting(false);
    }
  };

  const router = useRouter();

  const handleBaixar = (c: ContaReceberBackend) => {
    const desc = encodeURIComponent(c.origem);
    router.push(`/notas-fiscais?darBaixaId=${c.id}&tipoBaixa=conta_receber&descBaixa=${desc}`);
  };

  const filtradas = contas.filter(c => {
    if (filter === "pendente" && c.recebido) return false;
    if (filter === "recebido" && !c.recebido) return false;
    
    if (tipoFiltro && c.tipo !== tipoFiltro) return false;
    
    if (dataInicio && c.data_previsao < dataInicio) return false;
    if (dataFim && c.data_previsao > dataFim) return false;
    
    return true;
  });

  const totalPendente = filtradas.filter(c => !c.recebido).reduce((s, c) => s + c.valor, 0);
  const totalRecebido = filtradas.filter(c => c.recebido).reduce((s, c) => s + c.valor, 0);
  const totalAtrasado = filtradas.filter(c => !c.recebido && getDiffDays(c.data_previsao) < 0).reduce((s, c) => s + c.valor, 0);

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all border focus:border-[#4edea3]/50";
  const inputStyle = { background: "#242424", borderColor: "rgba(255,255,255,0.08)", color: "#e5e2e1" };

  return (
    <div className="flex-1 flex flex-col min-h-screen text-white">
      <main className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Gestão Financeira</p>
              <h1 className="text-2xl font-bold tracking-tight mt-0.5">Contas a Receber</h1>
            </div>
            <button
              onClick={abrirModalNovo}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              style={{ background: "#4edea3", color: "#003824" }}
            >
              <Plus size={16} /> Nova Conta
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Pendente (Filtro)", value: totalPendente, color: "#4edea3", bg: "rgba(78,222,163,0.08)", icon: <Banknote size={18} /> },
              { label: "Total Atrasado (Filtro)", value: totalAtrasado, color: "#ef4444", bg: "rgba(239,68,68,0.08)", icon: <AlertTriangle size={18} /> },
              { label: "Total Recebido (Filtro)", value: totalRecebido, color: "#6366f1", bg: "rgba(99,102,241,0.08)", icon: <CheckCircle size={18} /> },
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

          {/* Filters Panel */}
          <div className="bg-[#1a1a1a] p-4 rounded-2xl flex flex-col sm:flex-row flex-wrap gap-4 items-end border border-white/5">
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#242424" }}>
              {(["todos", "pendente", "recebido"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={filter === f ? { background: "#4edea3", color: "#003824" } : { color: "#6b7280" }}
                >
                  {f === "todos" ? "Todos" : f === "pendente" ? "Pendentes" : "Recebidos"}
                </button>
              ))}
            </div>

            <div className="flex-1 flex flex-wrap gap-4">
              <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Data Inicial</label>
                <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className={inputCls} style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Data Final</label>
                <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className={inputCls} style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Tipo de Recebimento</label>
                <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="">Todos</option>
                  {TIPOS_RECEBER.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            
            {(dataInicio || dataFim || tipoFiltro) && (
              <button
                onClick={() => { setDataInicio(""); setDataFim(""); setTipoFiltro(""); }}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer h-[42px] flex items-center gap-2"
              >
                <X size={14} /> Limpar
              </button>
            )}
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
                    {["Cliente / Origem", "Tipo", "Previsão", "Valor", "Status", ""].map(h => (
                      <th key={h} className="px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <div className="w-6 h-6 border-2 border-[#4edea3] border-t-transparent rounded-full animate-spin" />
                          Carregando contas...
                        </div>
                      </td>
                    </tr>
                  ) : filtradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <Filter size={32} className="text-gray-700" />
                          <p className="text-sm">Nenhuma conta encontrada com estes filtros</p>
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
                        <td className="px-5 py-4 text-gray-400 text-[13px]">{c.tipo}</td>
                        <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(c.data_previsao)}</td>
                        <td className="px-5 py-4 font-semibold text-white">{formatCurrency(c.valor)}</td>
                        <td className="px-5 py-4">
                          <StatusBadge recebido={c.recebido} dataPrevisao={c.data_previsao} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!c.recebido && (
                              <>
                                <button
                                  onClick={() => handleEdit(c)}
                                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80 active:scale-95 cursor-pointer"
                                  style={{ background: "rgba(255,255,255,0.08)", color: "#e5e2e1" }}
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleBaixar(c)}
                                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80 active:scale-95 cursor-pointer"
                                  style={{ background: "#4edea3", color: "#003824" }}
                                >
                                  Dar Baixa
                                </button>
                              </>
                            )}
                            {c.recebido && c.data_recebimento && (
                              <span className="text-[11px] text-gray-600">
                                Recebido em {formatDate(c.data_recebimento)}
                              </span>
                            )}
                          </div>
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
      <Modal open={showForm} onClose={fecharModal} maxWidth="576px">
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}>
              <div className="flex items-center gap-2">
                <Banknote size={15} className="text-[#4edea3]" />
                <span className="text-sm font-semibold text-white">{editingId ? "Editar Conta a Receber" : "Nova Conta a Receber"}</span>
              </div>
              <button onClick={fecharModal} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Valor (R$)</label>
                  <input
                    type="text"
                    value={formatCurrencyInput(form.valor) || ""}
                    onChange={e => setForm(p => ({ ...p, valor: parseCurrency(e.target.value) }))}
                    placeholder="R$ 0,00"
                    className={inputCls}
                    style={inputStyle}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Tipo de Receita</label>
                  <select
                    value={form.tipo}
                    onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}
                    className={inputCls}
                    style={inputStyle}
                    required
                  >
                    {TIPOS_RECEBER.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
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
                  onClick={fecharModal}
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
