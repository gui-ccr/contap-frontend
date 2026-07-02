"use client";

import { useEffect, useMemo, useState } from "react";
import { NovoUsuarioModal, type NovoUsuarioData } from "./components/NovoUsuarioModal";
import { UsuarioCard } from "./components/UsuarioCard";
import { UsuarioRow } from "./components/UsuarioRow";
import { UsuariosHeader } from "./components/UsuariosHeader";
import { UsuariosToolbar } from "./components/UsuariosToolbar";
import { UsuariosPagination } from "./components/UsuariosPagination";
import { usuariosService } from "./usuariosService";
import { funcionariosService } from "@/features/funcionarios/funcionariosService";
import { getEmpresaIdFromToken } from "@/shared/api";
import type { Usuario, UsuarioBackend } from "./types/types";
import { ConfirmDeleteModal } from "@/ui/ConfirmDeleteModal";

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

function normalizeUsuario(f: UsuarioBackend): Usuario {
  return {
    id: f.id,
    nome: f.nome,
    email: f.email,
    cargo: f.cargo,
    iniciais: initials(f.nome),
    cor: getCargoColor(f.cargo),
    ativo: f.ativo ?? true,
    foto_url: f.foto_url,
  };
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState<{ id: string; nome: string } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function carregarUsuarios() {
    try {
      setLoading(true);
      setError("");
      
      const { cargosService } = await import("@/features/cargos/cargosService");
      
      const [usuariosData, cargosData] = await Promise.all([
        usuariosService.listarUsuarios(),
        cargosService.listarCargos().catch(() => []) // Fallback
      ]);
      
      const cargosMap = new Map(cargosData.map(c => [c.id, c.nome]));
      
      setUsuarios(usuariosData.map((f) => {
        const mapped = normalizeUsuario(f);
        return {
          ...mapped,
          cargo: cargosMap.get(f.cargo) || f.cargo
        };
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar os usuarios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void carregarUsuarios();
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
    return usuarios.filter((f) =>
      f.nome.toLowerCase().includes(term) ||
      f.email.toLowerCase().includes(term) ||
      f.cargo.toLowerCase().includes(term)
    );
  }, [usuarios, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  async function handleSave(data: NovoUsuarioData) {
    const empresaId = getEmpresaIdFromToken();
    if (!empresaId) {
      throw new Error("Empresa nao encontrada no token. Faca login novamente.");
    }
    let finalUrl: string | null | undefined = undefined;
    let createdUsuarioId = editingUsuario?.id;

    if (!editingUsuario) {
      const cpfNum = data.cpf_cnpj ? data.cpf_cnpj.replace(/\D/g, "") : "123456";

      if (data.modo === "novo") {
        const diaPagamento = data.data_base_pagamento ? parseInt(data.data_base_pagamento.split("-")[2], 10) : 1;
        await funcionariosService.criarFuncionario({
          nome: data.nome,
          email: data.email,
          cargo: data.cargo,
          cpf_cnpj: cpfNum,
          salario: data.salario || 0,
          dia_pagamento: diaPagamento,
        });
      }

      const created = await usuariosService.criarUsuario({
        nome: data.nome,
        email: data.email,
        senha: cpfNum,
        empresa_id: empresaId,
        cargo: data.cargo as "GERENTE" | "CAIXA",
      });
      createdUsuarioId = created.id;
    }

    if (data.removerFoto) {
      finalUrl = null;
    } else if (data.fotoFile && createdUsuarioId) {
      finalUrl = await usuariosService.uploadFotoPerfil(data.fotoFile, createdUsuarioId);
    } else if (data.foto_url) {
      finalUrl = data.foto_url;
    }

    if (editingUsuario) {
      await usuariosService.atualizarUsuario(editingUsuario.id, {
        nome: data.nome,
        cargo: data.cargo as "GERENTE" | "CAIXA",
        ativo: !!data.ativo,
        ...(finalUrl !== undefined && { foto_url: finalUrl }),
      });
    } else if (finalUrl !== undefined && createdUsuarioId) {
      await usuariosService.atualizarUsuario(createdUsuarioId, { foto_url: finalUrl });
    }
    
    setEditingUsuario(null);
    await carregarUsuarios();
  }

  function handleRemove(id: string) {
    const u = usuarios.find(x => x.id === id);
    if (u) setDeleteConfirmInfo({ id, nome: u.nome });
  }

  async function handleConfirmDelete(excluirContas: boolean) {
    if (!deleteConfirmInfo) return;
    try {
      await usuariosService.removerUsuario(deleteConfirmInfo.id, excluirContas);
      await carregarUsuarios();
      setDeleteConfirmInfo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel remover o usuario.");
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-5">
          <UsuariosHeader
            ativos={usuarios.filter((f) => f.ativo).length}
            total={usuarios.length}
            onNovo={() => setModalOpen(true)}
          />

          <UsuariosToolbar
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
              Carregando usuarios...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="rounded-3xl p-12 flex flex-col items-center justify-center gap-3" style={{ background: "#1e1e1e" }}>
              <i className="fi fi-rr-user-slash text-5xl" style={{ color: "#6b7280" }}></i>
              <p className="text-sm font-medium" style={{ color: "#6b7280" }}>Nenhum usuario encontrado</p>
            </div>
          )}

          {!loading && viewMode === "grid" && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map((f) => (
                <UsuarioCard
                  key={f.id}
                  f={f}
                  onRemove={handleRemove}
                  onEdit={(f) => {
                    setEditingUsuario(f);
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
                      {["Usuario", "Cargo", "Email", "Status", ""].map((h) => (
                        <th
                          key={h}
                          className={`px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest${h === "" ? " text-right" : ""}${["Email"].includes(h) ? " hidden md:table-cell" : ""}`}
                          style={{ color: "#6b7280", background: "#1a1a1a" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((f) => (
                      <UsuarioRow
                        key={f.id}
                        f={f}
                        onRemove={handleRemove}
                        onEdit={(f) => {
                          setEditingUsuario(f);
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
            <UsuariosPagination
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
        <NovoUsuarioModal
          onClose={() => {
            setModalOpen(false);
            setEditingUsuario(null);
          }}
          onSave={handleSave}
          initialData={
            editingUsuario
              ? {
                  modo: "editar",
                  nome: editingUsuario.nome,
                  email: editingUsuario.email,
                  cargo: editingUsuario.cargo,
                  ativo: editingUsuario.ativo,
                  foto_url: editingUsuario.foto_url,
                }
              : undefined
          }
        />
      )}

      {deleteConfirmInfo && (
        <ConfirmDeleteModal
          open={!!deleteConfirmInfo}
          onClose={() => setDeleteConfirmInfo(null)}
          onConfirm={handleConfirmDelete}
          title="Remover Usuário"
          itemName={deleteConfirmInfo.nome}
        />
      )}
    </div>
  );
}
