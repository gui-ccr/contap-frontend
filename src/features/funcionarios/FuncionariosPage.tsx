"use client";

import { useEffect, useMemo, useState } from "react";
import { NovoFuncionarioModal, type NovoFuncionarioData } from "./components/NovoFuncionarioModal";
import { FuncionarioCard } from "./components/FuncionarioCard";
import { FuncionarioRow } from "./components/FuncionarioRow";
import { FuncionariosHeader } from "./components/FuncionariosHeader";
import { FuncionariosToolbar } from "./components/FuncionariosToolbar";
import { FuncionariosPagination } from "./components/FuncionariosPagination";
import { funcionariosService } from "./funcionariosService";
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

function normalizeFuncionario(f: FuncionarioBackend, index: number): Funcionario {
  return {
    id: f.id,
    nome: f.nome,
    email: f.email,
    cpf: f.cpf ?? "",
    dataNascimento: f.data_nascimento ?? "",
    cargo: f.cargo,
    foto: f.foto_url,
    iniciais: initials(f.nome),
    cor: CORES[index % CORES.length],
    ativo: true,
  };
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function carregarFuncionarios() {
    try {
      setLoading(true);
      setError("");
      const data = await funcionariosService.listarFuncionarios();
      setFuncionarios(data.map(normalizeFuncionario));
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
      f.email.toLowerCase().includes(term) ||
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

    await funcionariosService.criarFuncionario({
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      empresa_id: empresaId,
      cargo: data.cargo,
      cpf: data.cpf ? data.cpf.replace(/\D/g, "") : undefined,
      data_nascimento: data.dataNascimento || undefined,
      foto_url: data.foto || undefined,
    });
    await carregarFuncionarios();
  }

  async function handleRemove(id: string) {
    if (!confirm("Remover este funcionario?")) return;
    try {
      await funcionariosService.removerFuncionario(id);
      await carregarFuncionarios();
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
          />

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
              <span className="material-symbols-outlined text-5xl" style={{ color: "#6b7280" }}>group_off</span>
              <p className="text-sm font-medium" style={{ color: "#6b7280" }}>Nenhum funcionario encontrado</p>
            </div>
          )}

          {!loading && viewMode === "grid" && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map((f) => <FuncionarioCard key={f.id} f={f} onRemove={handleRemove} />)}
            </div>
          )}

          {!loading && viewMode === "list" && filtered.length > 0 && (
            <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Funcionario", "Cargo", "CPF", "Nascimento", "Status", ""].map((h) => (
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
                    {paginated.map((f) => <FuncionarioRow key={f.id} f={f} onRemove={handleRemove} />)}
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
        </div>
      </main>

      {modalOpen && (
        <NovoFuncionarioModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
