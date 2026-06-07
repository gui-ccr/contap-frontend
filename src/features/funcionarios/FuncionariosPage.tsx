"use client";

import { useState, useEffect } from "react";
import { NovoFuncionarioModal } from "./components/NovoFuncionarioModal";
import { FuncionarioCard } from "./components/FuncionarioCard";
import { FuncionarioRow } from "./components/FuncionarioRow";
import { FuncionariosHeader } from "./components/FuncionariosHeader";
import { FuncionariosToolbar } from "./components/FuncionariosToolbar";
import { FuncionariosPagination } from "./components/FuncionariosPagination";
import type { Funcionario } from "./types/types";

// ─── Mock data ────────────────────────────────────────────────────────────────

const FUNCIONARIOS_MOCK: Funcionario[] = [
  { id: 1, nome: "Ana Beatriz Santos",    email: "ana.santos@contaup.com.br",     cpf: "123.456.789-00", dataNascimento: "1992-03-15", cargo: "Gerente Financeiro",  iniciais: "AS", cor: "#4edea3", ativo: true  },
  { id: 2, nome: "Carlos Eduardo Lima",   email: "carlos.lima@contaup.com.br",    cpf: "234.567.890-11", dataNascimento: "1988-07-22", cargo: "Contador",            iniciais: "CL", cor: "#6366f1", ativo: true  },
  { id: 3, nome: "Fernanda Costa",        email: "fernanda.costa@contaup.com.br", cpf: "345.678.901-22", dataNascimento: "1995-11-08", cargo: "Analista Financeiro", iniciais: "FC", cor: "#f59e0b", ativo: true  },
  { id: 4, nome: "Rafael Oliveira",       email: "rafael.oliveira@contaup.com.br",cpf: "456.789.012-33", dataNascimento: "1990-01-30", cargo: "Auditor Interno",     iniciais: "RO", cor: "#ec4899", ativo: true  },
  { id: 5, nome: "Juliana Pereira",       email: "juliana.pereira@contaup.com.br",cpf: "567.890.123-44", dataNascimento: "1997-06-14", cargo: "Assistente Contábil", iniciais: "JP", cor: "#14b8a6", ativo: false },
  { id: 6, nome: "Thiago Rodrigues",      email: "thiago.rodrigues@contaup.com.br",cpf: "678.901.234-55",dataNascimento: "1985-09-03", cargo: "Controller",         iniciais: "TR", cor: "#f97316", ativo: true  },
  { id: 7, nome: "Mariana Almeida",       email: "mariana.almeida@contaup.com.br",cpf: "789.012.345-66", dataNascimento: "1999-04-25", cargo: "Estagiário",          iniciais: "MA", cor: "#a855f7", ativo: true  },
  { id: 8, nome: "Lucas Ferreira",        email: "lucas.ferreira@contaup.com.br", cpf: "890.123.456-77", dataNascimento: "1993-12-19", cargo: "Analista Fiscal",     iniciais: "LF", cor: "#0ea5e9", ativo: false },
];

const CORES = ["#4edea3", "#6366f1", "#f59e0b", "#ec4899", "#14b8a6", "#f97316", "#a855f7", "#0ea5e9"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(FUNCIONARIOS_MOCK);
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");
  const [search, setSearch]             = useState("");
  const [modalOpen, setModalOpen]       = useState(false);
  const [page, setPage]                 = useState(1);
  const [pageSize, setPageSize]         = useState(8);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => setPageSize(e.matches ? 8 : 4);
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
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => { setPage(1); }, [search, pageSize]);

  function handleSave(data: Omit<Funcionario, "id" | "iniciais" | "cor" | "ativo">) {
    const iniciais = data.nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
    const cor = CORES[funcionarios.length % CORES.length];
    setFuncionarios((prev) => [...prev, { id: Date.now(), ...data, iniciais, cor, ativo: true }]);
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
            onSearch={setSearch}
            onViewMode={setViewMode}
          />

          {filtered.length === 0 && (
            <div className="rounded-3xl p-12 flex flex-col items-center justify-center gap-3" style={{ background: "#1e1e1e" }}>
              <span className="material-symbols-outlined text-5xl" style={{ color: "#6b7280" }}>group_off</span>
              <p className="text-sm font-medium" style={{ color: "#6b7280" }}>Nenhum funcionário encontrado</p>
            </div>
          )}

          {viewMode === "grid" && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map((f) => <FuncionarioCard key={f.id} f={f} />)}
            </div>
          )}

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
                    {paginated.map((f) => <FuncionarioRow key={f.id} f={f} />)}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filtered.length > 0 && (
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
