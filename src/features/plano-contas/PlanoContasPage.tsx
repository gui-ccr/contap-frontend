"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { getEmpresaIdFromToken } from "@/shared/api";
import { planoContasService, type ContaContabil, type TipoConta } from "./planoContasService";
import { toast } from "sonner";
import { ConfirmModal } from "@/ui/modals/ConfirmModal";

const TIPOS: { value: TipoConta; label: string; color: string; bg: string }[] = [
  { value: "ATIVO", label: "Ativo", color: "#4edea3", bg: "rgba(78,222,163,0.12)" },
  { value: "PASSIVO", label: "Passivo", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { value: "PL", label: "Patrimonio liquido", color: "#0ea5e9", bg: "rgba(14,165,233,0.12)" },
  { value: "RECEITA", label: "Receita", color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
  { value: "DESPESA", label: "Despesa", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
];

const FORM_EMPTY = {
  codigo: "",
  nome: "",
  tipo: "ATIVO" as TipoConta,
};

function tipoMeta(tipo: TipoConta) {
  return TIPOS.find((item) => item.value === tipo) ?? TIPOS[0];
}

export default function PlanoContasPage() {
  const [contas, setContas] = useState<ContaContabil[]>([]);
  const [form, setForm] = useState(FORM_EMPTY);
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<TipoConta | "TODOS">("TODOS");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function carregarContas() {
    try {
      setLoading(true);
      setError("");
      const empresaId = getEmpresaIdFromToken();
      const data = await planoContasService.listarContas(empresaId ?? undefined);
      setContas(data.sort((a, b) => a.codigo.localeCompare(b.codigo, "pt-BR", { numeric: true })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar o plano de contas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void carregarContas();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return contas.filter((conta) => {
      const matchesSearch =
        conta.codigo.toLowerCase().includes(term) ||
        conta.nome.toLowerCase().includes(term) ||
        conta.tipo.toLowerCase().includes(term);
      const matchesTipo = tipoFiltro === "TODOS" || conta.tipo === tipoFiltro;
      return matchesSearch && matchesTipo;
    });
  }, [contas, search, tipoFiltro]);

  const totalPorTipo = useMemo(() => {
    return TIPOS.map((tipo) => ({
      ...tipo,
      total: contas.filter((conta) => conta.tipo === tipo.value).length,
    }));
  }, [contas]);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    const empresaId = getEmpresaIdFromToken();
    if (!empresaId) {
      setError("Empresa nao encontrada no token. Faca login novamente.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await planoContasService.criarConta({
        empresa_id: empresaId,
        codigo: form.codigo.trim(),
        nome: form.nome.trim(),
        tipo: form.tipo,
      });
      setForm(FORM_EMPTY);
      await carregarContas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar a conta.");
    } finally {
      setSaving(false);
    }
  }

  const [confirmDeleteContaId, setConfirmDeleteContaId] = useState<string | null>(null);

  function handleRemover(id: string) {
    setConfirmDeleteContaId(id);
  }

  async function executeRemover() {
    if (!confirmDeleteContaId) return;
    try {
      setError("");
      await planoContasService.removerConta(confirmDeleteContaId);
      toast.success("Conta contábil removida com sucesso.");
      await carregarContas();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nao foi possivel remover a conta.");
    } finally {
      setConfirmDeleteContaId(null);
    }
  }

  const inputStyle = {
    background: "#242424",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#e5e2e1",
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium" style={{ color: "#6b7280" }}>
                Contabilidade
              </p>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                Plano de Contas
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                {contas.length} conta{contas.length !== 1 ? "s" : ""} cadastrada{contas.length !== 1 ? "s" : ""}
              </p>
            </div>
          </header>

          <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {totalPorTipo.map((tipo) => (
              <button
                key={tipo.value}
                type="button"
                onClick={() => setTipoFiltro(tipoFiltro === tipo.value ? "TODOS" : tipo.value)}
                className="rounded-2xl px-4 py-3 text-left transition-all hover:opacity-90"
                style={{
                  background: tipoFiltro === tipo.value ? tipo.bg : "#1e1e1e",
                  border: `1px solid ${tipoFiltro === tipo.value ? tipo.color : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: tipo.color }}>
                  {tipo.label}
                </p>
                <p className="text-xl font-bold mt-1" style={{ color: "#e5e2e1" }}>{tipo.total}</p>
              </button>
            ))}
          </section>

          {error && (
            <div className="rounded-2xl px-4 py-3 text-sm font-medium" style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className="lg:col-span-4 lg:sticky lg:top-6">
              <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}>
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                    Nova conta
                  </span>
                </div>
                <form onSubmit={handleSalvar} className="p-5 space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>Codigo</label>
                    <input
                      value={form.codigo}
                      onChange={(e) => setForm((prev) => ({ ...prev, codigo: e.target.value }))}
                      placeholder="Ex: 1.1.02"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>Nome</label>
                    <input
                      value={form.nome}
                      onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Banco conta corrente"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={inputStyle}
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>Tipo</label>
                    <select
                      value={form.tipo}
                      onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value as TipoConta }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={inputStyle}
                    >
                      {TIPOS.map((tipo) => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 mt-2 disabled:cursor-not-allowed"
                    style={{ background: saving ? "#2f8f69" : "#4edea3", color: "#003824" }}
                  >
                    <Plus size={15} />
                    {saving ? "Salvando..." : "Salvar conta"}
                  </button>
                </form>
              </div>
            </aside>

            <section className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por codigo, nome ou tipo..."
                    className="w-full rounded-2xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
                    style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.06)", color: "#e5e2e1" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setTipoFiltro("TODOS")}
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all hover:bg-white/5"
                  style={{ color: "#6b7280", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  Todos
                </button>
              </div>

              <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Codigo", "Conta", "Tipo", ""].map((h) => (
                          <th
                            key={h}
                            className={`px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest${h === "" ? " text-right" : ""}`}
                            style={{ color: "#6b7280", background: "#1a1a1a" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-sm" style={{ color: "#6b7280" }}>Carregando plano de contas...</td></tr>
                      ) : filtered.length === 0 ? (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-sm" style={{ color: "#6b7280" }}>Nenhuma conta encontrada</td></tr>
                      ) : (
                        filtered.map((conta) => {
                          const meta = tipoMeta(conta.tipo);
                          return (
                            <tr key={conta.id} className="border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                              <td className="px-4 py-3 font-mono text-xs" style={{ color: "#e5e2e1" }}>{conta.codigo}</td>
                              <td className="px-4 py-3">
                                <p className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>{conta.nome}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-xs font-medium px-2.5 py-1 rounded-xl" style={{ background: meta.bg, color: meta.color }}>
                                  {meta.label}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemover(conta.id)}
                                  className="w-8 h-8 rounded-xl inline-flex items-center justify-center transition-colors hover:bg-red-500/10"
                                  style={{ color: "#6b7280" }}
                                  title="Remover"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={!!confirmDeleteContaId}
        title="Remover conta contábil?"
        description="Esta ação removerá a conta contábil do sistema e não poderá ser desfeita."
        onConfirm={executeRemover}
        onCancel={() => setConfirmDeleteContaId(null)}
        confirmText="Sim, remover"
      />
    </div>
  );
}
