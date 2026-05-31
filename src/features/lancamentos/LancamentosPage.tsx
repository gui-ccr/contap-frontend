"use client";

import { useState } from "react";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const CONTAS = [
  { value: "all",        label: "Todas as Contas" },
  { value: "1.1.01.01", label: "1.1.01.01 — Banco Itaú C/C" },
  { value: "3.1.01.01", label: "3.1.01.01 — Receitas de Serviços" },
  { value: "4.1.01.02", label: "4.1.01.02 ��� Despesas Administrativas" },
  { value: "2.1.01.01", label: "2.1.01.01 — Fornecedores Nacionais" },
];

const LANCAMENTOS = [
  { id: 1, data: "10/10/2023", descricao: "Pagamento Fornecedor XYZ",        debito: "2.1.01.01 — Fornecedores Nacionais",        credito: "1.1.01.01 — Banco Itaú C/C",              valor: "1.500,00"  },
  { id: 2, data: "12/10/2023", descricao: "Recebimento NF 1024",              debito: "1.1.01.01 — Banco Itaú C/C",               credito: "1.1.02.01 — Clientes Nacionais",           valor: "4.250,00"  },
  { id: 3, data: "15/10/2023", descricao: "Aquisição de Licenças Software",   debito: "4.1.01.02 — Despesas Administrativas",     credito: "1.1.01.01 — Banco Itaú C/C",              valor: "890,00"    },
  { id: 4, data: "18/10/2023", descricao: "Aporte de Capital Sócios",         debito: "1.1.01.01 — Banco Itaú C/C",               credito: "2.3.01.01 — Capital Social Integralizado", valor: "50.000,00" },
  { id: 5, data: "20/10/2023", descricao: "Tarifa Bancária Manutenção",       debito: "4.1.02.01 — Despesas Financeiras",         credito: "1.1.01.01 — Banco Itaú C/C",              valor: "125,50"    },
  { id: 6, data: "22/10/2023", descricao: "Receita de Consultoria",           debito: "1.1.01.01 — Banco Itaú C/C",               credito: "3.1.01.01 — Receitas de Serviços",        valor: "8.400,00"  },
  { id: 7, data: "25/10/2023", descricao: "Pagamento de Salários",            debito: "4.1.01.01 — Despesas com Pessoal",         credito: "1.1.01.01 — Banco Itaú C/C",              valor: "12.300,00" },
  { id: 8, data: "28/10/2023", descricao: "Compra de Material de Escritório", debito: "4.1.01.02 — Despesas Administrativas",     credito: "1.1.01.01 — Banco Itaú C/C",              valor: "340,00"    },
];

const PAGE_SIZE = 5;
const TOTAL_MOCK = 142;

// ─── Component ────────────────────────────────────────────────────────────────

export default function LancamentosPage() {
  const [startDate, setStartDate] = useState("2023-10-01");
  const [endDate, setEndDate]     = useState("2023-10-31");
  const [conta, setConta]         = useState("all");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);

  function clearFilters() {
    setStartDate("2023-10-01");
    setEndDate("2023-10-31");
    setConta("all");
    setSearch("");
    setPage(1);
  }

  const totalPages = Math.ceil(TOTAL_MOCK / PAGE_SIZE);
  const visiblePages = Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col min-h-screen">

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Page title */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: "#e5e2e1" }}>
              Listagem de Lançamentos
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Análise detalhada de movimentações por conta.
            </p>
          </div>

          {/* Filters card */}
          <div className="rounded-3xl p-4 md:p-6" style={{ background: "#1e1e1e" }}>
            <div className="flex items-center gap-2 mb-4">
              <Filter size={15} style={{ color: "#4edea3" }} />
              <span className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>Filtros</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                  style={{ background: "#242424", border: "1px solid rgba(255,255,255,0.06)", color: "#e5e2e1" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                  Data Final
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                  style={{ background: "#242424", border: "1px solid rgba(255,255,255,0.06)", color: "#e5e2e1" }}
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                  Conta
                </label>
                <select
                  value={conta}
                  onChange={(e) => setConta(e.target.value)}
                  className="rounded-xl px-3 py-2 text-sm outline-none appearance-none"
                  style={{ background: "#242424", border: "1px solid rgba(255,255,255,0.06)", color: "#e5e2e1" }}
                >
                  {CONTAS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-medium transition-all hover:bg-white/5"
                style={{ color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <X size={13} />
                Limpar
              </button>
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "#4edea3", color: "#003824" }}
              >
                <Filter size={13} />
                Aplicar
              </button>
            </div>
          </div>

          {/* Table card */}
          <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "#6b7280", background: "#1a1a1a" }}>
                      Data
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "#6b7280", background: "#1a1a1a" }}>
                      Descrição
                    </th>
                    <th className="hidden md:table-cell px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "#6b7280", background: "#1a1a1a" }}>
                      Conta Débito
                    </th>
                    <th className="hidden md:table-cell px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "#6b7280", background: "#1a1a1a" }}>
                      Conta Crédito
                    </th>
                    <th className="px-4 py-3.5 text-right text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "#6b7280", background: "#1a1a1a" }}>
                      Valor (R$)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LANCAMENTOS.slice(0, PAGE_SIZE).map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors cursor-default border-b"
                      style={{ borderColor: "rgba(255,255,255,0.04)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-medium" style={{ color: "#e5e2e1" }}>
                        {row.data}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium max-w-[160px] md:max-w-none" style={{ color: "#e5e2e1" }}>
                        <span className="line-clamp-2 md:line-clamp-none">{row.descricao}</span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-xs" style={{ color: "#6b7280" }}>
                        {row.debito}
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-xs" style={{ color: "#6b7280" }}>
                        {row.credito}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-semibold whitespace-nowrap" style={{ color: "#e5e2e1" }}>
                        {row.valor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-xs hidden sm:block" style={{ color: "#6b7280" }}>
                <span style={{ color: "#e5e2e1" }}>{(page - 1) * PAGE_SIZE + 1}</span>
                {" – "}
                <span style={{ color: "#e5e2e1" }}>{Math.min(page * PAGE_SIZE, TOTAL_MOCK)}</span>
                {" de "}
                <span style={{ color: "#e5e2e1" }}>{TOTAL_MOCK}</span>
              </p>
              <p className="text-xs sm:hidden" style={{ color: "#6b7280" }}>
                Pág. <span style={{ color: "#e5e2e1" }}>{page}</span> / {totalPages}
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30"
                  style={{ background: "#242424", color: "#6b7280" }}
                >
                  <ChevronLeft size={14} />
                </button>

                {visiblePages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold transition-all"
                    style={page === p ? { background: "#4edea3", color: "#003824" } : { background: "#242424", color: "#6b7280" }}
                  >
                    {p}
                  </button>
                ))}

                {totalPages > 3 && (
                  <>
                    <span className="text-xs px-0.5" style={{ color: "#6b7280" }}>…</span>
                    <button
                      onClick={() => setPage(totalPages)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold transition-all"
                      style={{ background: "#242424", color: "#6b7280" }}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30"
                  style={{ background: "#242424", color: "#6b7280" }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
