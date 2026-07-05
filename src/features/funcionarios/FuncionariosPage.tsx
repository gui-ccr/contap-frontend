"use client";

import { useEffect, useMemo, useState } from "react";
import { NovoFuncionarioModal, type NovoFuncionarioData } from "./components/NovoFuncionarioModal";
import { GerenciarCargosModal } from "./components/GerenciarCargosModal";
import { FecharFolhaModal } from "./components/FecharFolhaModal";
import { FolhaPagamentoTab } from "./components/FolhaPagamentoTab";
import { FuncionarioCard } from "./components/FuncionarioCard";
import { FuncionarioRow } from "./components/FuncionarioRow";
import { FuncionariosHeader } from "./components/FuncionariosHeader";
import { FuncionariosToolbar } from "./components/FuncionariosToolbar";
import { FuncionariosPagination } from "./components/FuncionariosPagination";
import { funcionariosService } from "./funcionariosService";
import { ConfirmDeleteModal } from "@/ui/ConfirmDeleteModal";
import { getEmpresaIdFromToken } from "@/shared/api";
import type { Funcionario, FuncionarioBackend } from "./types/types";

const CORES = ["#4edea3", "#6366f1", "#f59e0b", "#ec4899", "#14b8a6", "#f97316", "#a855f7", "#0ea5e9"];

function initials(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function getCargoColor(cargo: string) {
  const hash = cargo.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CORES[hash % CORES.length];
}

function normalizeFuncionario(f: FuncionarioBackend): Funcionario {
  return {
    id: f.id,
    nome: f.nome,
    email: f.email,
    cpf_cnpj: f.cpf_cnpj ?? "",
    salario: f.salario ?? 0,
    data_admissao: f.data_admissao ?? new Date().toISOString().split('T')[0],
    cargo: f.cargo,
    iniciais: initials(f.nome),
    cor: getCargoColor(f.cargo),
    ativo: true,
    foto_url: f.foto_url,
    config_folha: f.config_folha,
  };
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState<{ id: string; nome: string } | null>(null);
  const [cargosModalOpen, setCargosModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"gestao" | "folha">("gestao");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function carregarFuncionarios() {
    try {
      setLoading(true);
      setError("");
      
      const { cargosService } = await import("@/features/cargos/cargosService");
      
      const [funcionariosData, cargosData] = await Promise.all([
        funcionariosService.listarFuncionarios(),
        cargosService.listarCargos().catch(() => []) // Fallback in case of error
      ]);
      
      const cargosMap = new Map(cargosData.map(c => [c.id, c.nome]));
      setFuncionarios(funcionariosData.map((f) => {
        const mapped = normalizeFuncionario(f);
        return {
          ...mapped,
          cargo: cargosMap.get(f.cargo) || f.cargo
        };
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar os funcionarios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void carregarFuncionarios();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => setPageSize(e.matches ? 8 : 4);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return funcionarios.filter((f) =>
      f.nome.toLowerCase().includes(term) ||
      f.cpf_cnpj.toLowerCase().includes(term) ||
      f.cargo.toLowerCase().includes(term)
    );
  }, [funcionarios, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  async function handleSave(data: NovoFuncionarioData) {
    const empresaId = getEmpresaIdFromToken();
    if (!empresaId) {
      throw new Error("Empresa nao encontrada no token. Faca login novamente.");
    }

    let finalUrl: string | null | undefined = undefined;
    let createdFuncId = editingFuncionario?.id;

    if (!editingFuncionario) {
      const created = await funcionariosService.criarFuncionario({
        nome: data.nome,
        email: data.email,
        cargo: data.cargo,
        cpf_cnpj: data.cpf_cnpj.replace(/\D/g, ""),
        salario: data.salario,
        data_admissao: data.data_admissao,
        config_folha: data.config_folha,
      });
      createdFuncId = created.id;
    }

    if (data.removerFoto) {
      finalUrl = null;
    } else if (data.fotoFile && createdFuncId) {
      finalUrl = await funcionariosService.uploadFotoFuncionario(data.fotoFile, createdFuncId);
    }

    if (editingFuncionario) {
      await funcionariosService.atualizarFuncionario(editingFuncionario.id, {
        nome: data.nome,
        email: data.email,
        cargo: data.cargo,
        cpf_cnpj: data.cpf_cnpj.replace(/\D/g, ""),
        salario: data.salario,
        data_admissao: data.data_admissao,
        config_folha: data.config_folha,
        ...(finalUrl !== undefined && { foto_url: finalUrl }),
      });
    } else if (finalUrl !== undefined && createdFuncId) {
      await funcionariosService.atualizarFuncionario(createdFuncId, { foto_url: finalUrl });
    }
    setEditingFuncionario(null);
    await carregarFuncionarios();
  }

  function handleRemove(id: string) {
    const f = funcionarios.find(x => x.id === id);
    if (f) setDeleteConfirmInfo({ id, nome: f.nome });
  }

  async function handleConfirmDelete(excluirContas: boolean) {
    if (!deleteConfirmInfo) return;
    try {
      await funcionariosService.removerFuncionario(deleteConfirmInfo.id, excluirContas);
      await carregarFuncionarios();
      setDeleteConfirmInfo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel remover o funcionario.");
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-5">
          <FuncionariosHeader
            ativos={funcionarios.filter((f) => f.ativo).length}
            total={funcionarios.length}
            onNovo={() => setModalOpen(true)}
            onCargos={() => setCargosModalOpen(true)}
          />

          <div className="flex items-center gap-6 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab("gestao")}
              className={`text-sm font-semibold transition-colors pb-2 -mb-2 border-b-2 ${
                activeTab === "gestao" ? "text-white border-[#4edea3]" : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              Gestão de Funcionários
            </button>
            <button
              onClick={() => setActiveTab("folha")}
              className={`text-sm font-semibold transition-colors pb-2 -mb-2 border-b-2 ${
                activeTab === "folha" ? "text-white border-[#4edea3]" : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              Folha de Pagamento
            </button>
          </div>

          {activeTab === "folha" ? (
            <FolhaPagamentoTab />
          ) : (
            <>
              <FuncionariosToolbar
                search={search}
                viewMode={viewMode}
                onSearch={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                onViewMode={setViewMode}
              />

              {error && (
                <div className="rounded-2xl px-4 py-3 text-sm font-medium" style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}>
                  {error}
                </div>
              )}

              {loading && (
                <div className="rounded-3xl p-12 text-center text-sm" style={{ background: "#1e1e1e", color: "#6b7280" }}>
                  Carregando funcionarios...
                </div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="rounded-3xl p-12 flex flex-col items-center justify-center gap-3" style={{ background: "#1e1e1e" }}>
                  <i className="fi fi-rr-user-slash text-5xl" style={{ color: "#6b7280" }}></i>
                  <p className="text-sm font-medium" style={{ color: "#6b7280" }}>Nenhum funcionario encontrado</p>
                </div>
              )}

              {!loading && viewMode === "grid" && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginated.map((f) => (
                    <FuncionarioCard
                      key={f.id}
                      f={f}
                      onRemove={handleRemove}
                      onEdit={(f) => {
                        setEditingFuncionario(f);
                        setModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}

              {!loading && viewMode === "list" && filtered.length > 0 && (
                <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          {["Funcionario", "Cargo", "CPF/CNPJ", "Salário", "Admissão", ""].map((h) => (
                            <th
                              key={h}
                              className={`px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest${h === "" ? " text-right" : ""}${["CPF/CNPJ", "Salário", "Admissão"].includes(h) ? " hidden md:table-cell" : ""}`}
                              style={{ color: "#6b7280", background: "#1a1a1a" }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((f) => (
                          <FuncionarioRow
                            key={f.id}
                            f={f}
                            onRemove={handleRemove}
                            onEdit={(f) => {
                              setEditingFuncionario(f);
                              setModalOpen(true);
                            }}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!loading && filtered.length > 0 && (
                <FuncionariosPagination
                  page={safePage}
                  totalPages={totalPages}
                  total={filtered.length}
                  pageSize={pageSize}
                  onPage={setPage}
                />
              )}
            </>
          )}
        </div>
      </main>

      {modalOpen && (
        <NovoFuncionarioModal
          onClose={() => {
            setModalOpen(false);
            setEditingFuncionario(null);
          }}
          onSave={handleSave}
          initialData={
            editingFuncionario
              ? {
                  nome: editingFuncionario.nome,
                  email: editingFuncionario.email,
                  cpf_cnpj: editingFuncionario.cpf_cnpj,
                  salario: editingFuncionario.salario,
                  data_admissao: editingFuncionario.data_admissao,
                  cargo: editingFuncionario.cargo,
                  foto_url: editingFuncionario.foto_url,
                  config_folha: editingFuncionario.config_folha,
                }
              : undefined
          }
        />
      )}

      {cargosModalOpen && (
        <GerenciarCargosModal
          onClose={() => setCargosModalOpen(false)}
        />
      )}

      {deleteConfirmInfo && (
        <ConfirmDeleteModal
          open={!!deleteConfirmInfo}
          onClose={() => setDeleteConfirmInfo(null)}
          onConfirm={handleConfirmDelete}
          title="Remover Funcionário"
          itemName={deleteConfirmInfo.nome}
        />
      )}
    </div>
  );
}
