"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { getEmpresaIdFromToken } from "@/shared/api";
import {
  planoContasService,
  type ContaContabil,
  type TipoConta,
} from "./planoContasService";
import { toast } from "sonner";
import { ConfirmModal } from "@/ui/modals/ConfirmModal";

const TIPOS: { value: TipoConta; label: string; color: string; bg: string }[] =
  [
    {
      value: "ATIVO",
      label: "Ativo",
      color: "#4edea3",
      bg: "rgba(78,222,163,0.12)",
    },
    {
      value: "PASSIVO",
      label: "Passivo",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
    },
    {
      value: "PL",
      label: "Patrimonio liquido",
      color: "#0ea5e9",
      bg: "rgba(14,165,233,0.12)",
    },
    {
      value: "RECEITA",
      label: "Receita",
      color: "#a855f7",
      bg: "rgba(168,85,247,0.12)",
    },
    {
      value: "DESPESA",
      label: "Despesa",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.12)",
    },
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function carregarContas() {
    try {
      setLoading(true);
      setError("");
      const empresaId = getEmpresaIdFromToken();
      const data = await planoContasService.listarContas(
        empresaId ?? undefined,
      );
      setContas(
        data.sort((a, b) =>
          a.codigo.localeCompare(b.codigo, "pt-BR", { numeric: true }),
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nao foi possivel carregar o plano de contas.",
      );
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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage]);

  // Reseta paginação se filtro mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [search, tipoFiltro]);

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
      setError(
        err instanceof Error ? err.message : "Nao foi possivel salvar a conta.",
      );
    } finally {
      setSaving(false);
    }
  }

  const [confirmDeleteContaId, setConfirmDeleteContaId] = useState<
    string | null
  >(null);
  const [conflictConta, setConflictConta] = useState<ContaContabil | null>(
    null,
  );
  const [resolvingAction, setResolvingAction] = useState<
    "excluir_vinculos" | "substituir"
  >("excluir_vinculos");
  const [substitutoId, setSubstitutoId] = useState<string>("");

  function handleRemover(id: string) {
    setConfirmDeleteContaId(id);
  }

  async function executeRemover() {
    if (!confirmDeleteContaId) return;
    try {
      setError("");
      await planoContasService.removerConta(confirmDeleteContaId);
      toast.success("Conta contábil removida com sucesso.");
      setConfirmDeleteContaId(null);
      await carregarContas();
    } catch (err: any) {
      const msg =
        err instanceof Error
          ? err.message
          : "Nao foi possivel remover a conta.";
      if (msg.includes("EM_USO")) {
        const contaObj = contas.find((c) => c.id === confirmDeleteContaId);
        if (contaObj) {
          setConfirmDeleteContaId(null);
          setConflictConta(contaObj);
          setResolvingAction("excluir_vinculos");

          // Pre-selecionar o primeiro substituto válido (mesmo tipo, id diferente)
          const validSubs = contas.filter(
            (c) => c.tipo === contaObj.tipo && c.id !== contaObj.id,
          );
          if (validSubs.length > 0) setSubstitutoId(validSubs[0].id);
          else setSubstitutoId("");

          return;
        }
      }
      toast.error(msg);
      setConfirmDeleteContaId(null);
    }
  }

  async function executeResolveConflict() {
    if (!conflictConta) return;
    if (resolvingAction === "substituir" && !substitutoId) {
      toast.error("Selecione uma conta substituta.");
      return;
    }

    try {
      setError("");
      setSaving(true);
      await planoContasService.removerConta(
        conflictConta.id,
        resolvingAction,
        substitutoId || undefined,
      );
      toast.success("Operação concluída com sucesso.");
      setConflictConta(null);
      await carregarContas();
    } catch (err: any) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao resolver conflito.",
      );
    } finally {
      setSaving(false);
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
                {contas.length} conta{contas.length !== 1 ? "s" : ""} cadastrada
                {contas.length !== 1 ? "s" : ""}
              </p>
            </div>
          </header>

          <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {totalPorTipo.map((tipo) => (
              <button
                key={tipo.value}
                type="button"
                onClick={() =>
                  setTipoFiltro(
                    tipoFiltro === tipo.value ? "TODOS" : tipo.value,
                  )
                }
                className="rounded-2xl px-4 py-3 text-left transition-all hover:opacity-90"
                style={{
                  background: tipoFiltro === tipo.value ? tipo.bg : "#1e1e1e",
                  border: `1px solid ${tipoFiltro === tipo.value ? tipo.color : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: tipo.color }}
                >
                  {tipo.label}
                </p>
                <p
                  className="text-xl font-bold mt-1"
                  style={{ color: "#e5e2e1" }}
                >
                  {tipo.total}
                </p>
              </button>
            ))}
          </section>

          {error && (
            <div
              className="rounded-2xl px-4 py-3 text-sm font-medium"
              style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className="lg:col-span-4 lg:sticky lg:top-6">
              <div
                className="rounded-3xl overflow-hidden"
                style={{ background: "#1e1e1e" }}
              >
                <div
                  className="px-5 py-4"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "#1a1a1a",
                  }}
                >
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: "#6b7280" }}
                  >
                    Nova conta
                  </span>
                </div>
                <form onSubmit={handleSalvar} className="p-5 space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "#6b7280" }}
                    >
                      Codigo
                    </label>
                    <input
                      value={form.codigo}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, codigo: e.target.value }))
                      }
                      placeholder="Ex: 1.1.02"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "#6b7280" }}
                    >
                      Nome
                    </label>
                    <input
                      value={form.nome}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, nome: e.target.value }))
                      }
                      placeholder="Ex: Banco conta corrente"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={inputStyle}
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "#6b7280" }}
                    >
                      Tipo
                    </label>
                    <select
                      value={form.tipo}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          tipo: e.target.value as TipoConta,
                        }))
                      }
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={inputStyle}
                    >
                      {TIPOS.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 mt-2 disabled:cursor-not-allowed"
                    style={{
                      background: saving ? "#2f8f69" : "#4edea3",
                      color: "#003824",
                    }}
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
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#6b7280" }}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por codigo, nome ou tipo..."
                    className="w-full rounded-2xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
                    style={{
                      background: "#1e1e1e",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#e5e2e1",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setTipoFiltro("TODOS")}
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all hover:bg-white/5 cursor-pointer"
                  style={{
                    color: "#6b7280",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  Todos
                </button>

                <select
                  value={tipoFiltro}
                  onChange={(e) =>
                    setTipoFiltro(e.target.value as TipoConta | "TODOS")
                  }
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold outline-none cursor-pointer"
                  style={{
                    background: "#1e1e1e",
                    color: "#e5e2e1",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <option value="TODOS">Todos os tipos</option>
                  {TIPOS.map((tipo)=>
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                  )}
                </select>
              </div>

              <div
                className="rounded-3xl overflow-hidden"
                style={{ background: "#1e1e1e" }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
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
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-8 text-center text-sm"
                            style={{ color: "#6b7280" }}
                          >
                            Carregando plano de contas...
                          </td>
                        </tr>
                      ) : paginatedData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-8 text-center text-sm"
                            style={{ color: "#6b7280" }}
                          >
                            Nenhuma conta encontrada
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((conta) => {
                          const meta = tipoMeta(conta.tipo);
                          return (
                            <tr
                              key={conta.id}
                              className="border-b"
                              style={{ borderColor: "rgba(255,255,255,0.04)" }}
                            >
                              <td
                                className="px-4 py-3 font-mono text-xs"
                                style={{ color: "#e5e2e1" }}
                              >
                                {conta.codigo}
                              </td>
                              <td className="px-4 py-3">
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#e5e2e1" }}
                                >
                                  {conta.nome}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className="text-xs font-medium px-2.5 py-1 rounded-xl"
                                  style={{
                                    background: meta.bg,
                                    color: meta.color,
                                  }}
                                >
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

                {/* Paginacao */}
                {totalPages > 1 && (
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      background: "#1a1a1a",
                    }}
                  >
                    <p className="text-xs" style={{ color: "#6b7280" }}>
                      Mostrando{" "}
                      <span className="font-medium text-white">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      a{" "}
                      <span className="font-medium text-white">
                        {Math.min(currentPage * itemsPerPage, filtered.length)}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium text-white">
                        {filtered.length}
                      </span>{" "}
                      resultados
                    </p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
                        style={{ color: "#e5e2e1" }}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {/* Numeros das paginas simplificados */}
                      <div
                        className="flex items-center px-2 gap-1 text-xs font-medium"
                        style={{ color: "#9ca3af" }}
                      >
                        <span className="text-white bg-white/10 px-2 py-1 rounded-md">
                          {currentPage}
                        </span>
                        <span>de</span>
                        <span>{totalPages}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
                        style={{ color: "#e5e2e1" }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
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

      {/* Modal de Conflito (EM_USO) */}
      {conflictConta && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="rounded-3xl overflow-hidden shadow-2xl relative shrink-0"
            style={{ background: "#1e1e1e", width: "100%", maxWidth: "450px" }}
          >
            <div className="px-6 pt-6 pb-4">
              <h3 className="text-lg font-bold text-white mb-2">
                Conta Contábil em Uso
              </h3>
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                A conta{" "}
                <strong>
                  {conflictConta.codigo} - {conflictConta.nome}
                </strong>{" "}
                está vinculada a lançamentos existentes. Não é possível
                excluí-la diretamente.
              </p>

              <div className="mt-5 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="radio"
                      name="resolvingAction"
                      value="excluir_vinculos"
                      checked={resolvingAction === "excluir_vinculos"}
                      onChange={() => setResolvingAction("excluir_vinculos")}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded-full border-2 border-gray-500 peer-checked:border-red-500 peer-checked:bg-red-500 transition-all"></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Excluir Lançamentos
                    </p>
                    <p className="text-xs text-red-400 mt-1">
                      Isso irá apagar todos os lançamentos que utilizam esta
                      conta. <strong>Atenção:</strong> esta ação não tem volta e
                      afeta os saldos.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="radio"
                      name="resolvingAction"
                      value="substituir"
                      checked={resolvingAction === "substituir"}
                      onChange={() => setResolvingAction("substituir")}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded-full border-2 border-gray-500 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all"></div>
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-semibold text-white">
                      Substituir Conta
                    </p>
                    <p className="text-xs text-gray-400 mt-1 mb-2">
                      Manter os lançamentos, mas transferi-los para outra conta
                      do mesmo tipo ({conflictConta.tipo}).
                    </p>

                    {resolvingAction === "substituir" && (
                      <select
                        value={substitutoId}
                        onChange={(e) => setSubstitutoId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                        style={inputStyle}
                      >
                        <option value="" disabled>
                          Selecione a conta substituta...
                        </option>
                        {contas
                          .filter(
                            (c) =>
                              c.tipo === conflictConta.tipo &&
                              c.id !== conflictConta.id,
                          )
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.codigo} - {c.nome}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div
              className="px-6 py-4 flex gap-3"
              style={{
                background: "#1a1a1a",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <button
                onClick={() => setConflictConta(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:bg-white/5 cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={executeResolveConflict}
                disabled={
                  saving || (resolvingAction === "substituir" && !substitutoId)
                }
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                  ${resolvingAction === "excluir_vinculos" ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {saving ? "Processando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
