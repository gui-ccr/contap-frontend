"use client";

import { useState, useEffect } from "react";
import { contasPagarService, ContaPagarBackend } from "./contasPagarService";
import { toast } from "sonner";
import { Modal } from "@/ui/Modal";
import {
  CreditCard,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingDown,
  Calendar,
  X,
} from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("pt-BR");
}

function getDiffDays(dateStr: string): number {
  const venc = new Date(dateStr + "T12:00:00Z");
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.ceil((venc.getTime() - hoje.getTime()) / 86400000);
}

function StatusBadge({ pago, dataVencimento }: { pago: boolean; dataVencimento: string }) {
  if (pago) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400">
        <CheckCircle size={11} /> Pago
      </span>
    );
  }
  const diff = getDiffDays(dataVencimento);
  if (diff < 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400">
        <AlertTriangle size={11} /> Vencido ({Math.abs(diff)}d)
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
      <Calendar size={11} /> {formatDate(dataVencimento)}
    </span>
  );
}

export default function ContasPagarPage() {
  const [contas, setContas] = useState<ContaPagarBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"todos" | "pendente" | "pago">("todos");

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    data_vencimento: "",
  });

  const carregarContas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contasPagarService.listarContasPagar();
      setContas(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar contas a pagar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarContas(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contasPagarService.criarContaPagar({
        descricao: form.descricao,
        valor: Number(form.valor),
        data_vencimento: form.data_vencimento,
      });
      toast.success("Conta criada com sucesso!");
      setShowForm(false);
      setForm({ descricao: "", valor: "", data_vencimento: "" });
      carregarContas();
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar conta.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBaixarConta = async (id: string) => {
    try {
      await contasPagarService.baixarConta(id);
      toast.success("Conta baixada e lançamento contábil gerado!");
      carregarContas();
    } catch (err: any) {
      toast.error(err.message || "Erro ao dar baixa.");
    }
  };

  const filtradas = contas.filter(c => {
    if (filter === "pendente") return !c.pago;
    if (filter === "pago") return c.pago;
    return true;
  });

  const totalPendente = contas.filter(c => !c.pago).reduce((s, c) => s + c.valor, 0);
  const totalPago = contas.filter(c => c.pago).reduce((s, c) => s + c.valor, 0);
  const totalVencido = contas.filter(c => !c.pago && getDiffDays(c.data_vencimento) < 0).reduce((s, c) => s + c.valor, 0);

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all border focus:border-[#4edea3]/50";
  const inputStyle = { background: "#242424", borderColor: "rgba(255,255,255,0.08)", color: "#e5e2e1" };

  return (
    <div className="flex-1 flex flex-col min-h-screen text-white">
    <main className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500">Gestão Financeira</p>
            <h1 className="text-2xl font-bold tracking-tight mt-0.5">Contas a Pagar</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "#4edea3", color: "#003824" }}
          >
            <Plus size={16} /> Nova Conta
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Pendente", value: totalPendente, color: "#f59e0b", bg: "rgba(245,158,11,0.08)", icon: <Clock size={18} /> },
            { label: "Total Vencido", value: totalVencido, color: "#ef4444", bg: "rgba(239,68,68,0.08)", icon: <AlertTriangle size={18} /> },
            { label: "Total Pago (mês)", value: totalPago, color: "#4edea3", bg: "rgba(78,222,163,0.08)", icon: <CheckCircle size={18} /> },
          ].map(card => (
            <div key={card.label} className="rounded-2xl p-5 flex items-center justify-between" style={{ background: card.bg }}>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: card.color }}>{card.label}</p>
                <p className="text-xl font-bold" style={{ color: card.color }}>{formatCurrency(card.value)}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${card.color}20`, color: card.color }}>
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
          {(["todos", "pendente", "pago"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="cursor-pointer px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={filter === f
                ? { background: "#4edea3", color: "#003824" }
                : { color: "#6b7280" }}
            >
              {f === "todos" ? "Todos" : f === "pendente" ? "Pendentes" : "Pagos"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#1e1e1e" }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}>
            <div className="flex items-center gap-2">
              <TrendingDown size={15} className="text-red-400" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Títulos a Pagar
              </span>
            </div>
            <span className="text-[11px] text-gray-600">{filtradas.length} registro(s)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {["Descrição", "Vencimento", "Valor", "Status", ""].map(h => (
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
                        <CreditCard size={32} className="text-gray-700" />
                        <p className="text-sm">Nenhuma conta encontrada</p>
                        <button
                          onClick={() => setShowForm(true)}
                          className="text-xs text-[#4edea3] hover:underline"
                        >
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
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                            {c.descricao.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-200">{c.descricao}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(c.data_vencimento)}</td>
                      <td className="px-5 py-4 font-semibold text-white">{formatCurrency(c.valor)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge pago={c.pago} dataVencimento={c.data_vencimento} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!c.pago && (
                          <button
                            onClick={() => handleBaixarConta(c.id)}
                            className="cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80 active:scale-95"
                            style={{ background: "#4edea3", color: "#003824" }}
                          >
                            Dar Baixa
                          </button>
                        )}
                        {c.pago && c.data_pagamento && (
                          <span className="text-[11px] text-gray-600">
                            Pago em {formatDate(c.data_pagamento)}
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

      <Modal open={showForm} onClose={() => setShowForm(false)} maxWidth="576px">
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}>
              <div className="flex items-center gap-2">
                <CreditCard size={15} className="text-[#4edea3]" />
                <span className="text-sm font-semibold text-white">Nova Conta a Pagar</span>
              </div>
              <button onClick={() => setShowForm(false)} className="cursor-pointer text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Descrição / Fornecedor</label>
                <input
                  type="text"
                  name="descricao"
                  value={form.descricao}
                  onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                  placeholder="Ex: Aluguel, Fornecedor XYZ..."
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
                  name="valor"
                  value={form.valor}
                  onChange={e => setForm(p => ({ ...p, valor: e.target.value }))}
                  placeholder="0,00"
                  className={inputCls}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Data de Vencimento</label>
                <input
                  type="date"
                  name="data_vencimento"
                  value={form.data_vencimento}
                  onChange={e => setForm(p => ({ ...p, data_vencimento: e.target.value }))}
                  className={inputCls}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="cursor-pointer flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
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
