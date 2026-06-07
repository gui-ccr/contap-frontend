"use client";

import { useState } from "react";
import NovoLancamentoForm from "./components/NovoLancamentoForm";
import { LancamentosFilters } from "./components/LancamentosFilters";
import { LancamentosTable } from "./components/LancamentosTable";

const CONTAS = [
  { value: "all",       label: "Todas as Contas" },
  { value: "1.1.01.01", label: "1.1.01.01 — Banco Itaú C/C" },
  { value: "3.1.01.01", label: "3.1.01.01 — Receitas de Serviços" },
  { value: "4.1.01.02", label: "4.1.01.02 — Despesas Administrativas" },
  { value: "2.1.01.01", label: "2.1.01.01 — Fornecedores Nacionais" },
];

const LANCAMENTOS = [
  { id: 1, data: "10/10/2023", descricao: "Pagamento Fornecedor XYZ",       debito: "2.1.01.01 — Fornecedores Nacionais",       credito: "1.1.01.01 — Banco Itaú C/C",               valor: "1.500,00"  },
  { id: 2, data: "12/10/2023", descricao: "Recebimento NF 1024",              debito: "1.1.01.01 — Banco Itaú C/C",               credito: "1.1.02.01 — Clientes Nacionais",            valor: "4.250,00"  },
  { id: 3, data: "15/10/2023", descricao: "Aquisição de Licenças Software",   debito: "4.1.01.02 — Despesas Administrativas",     credito: "1.1.01.01 — Banco Itaú C/C",               valor: "890,00"    },
  { id: 4, data: "18/10/2023", descricao: "Aporte de Capital Sócios",         debito: "1.1.01.01 — Banco Itaú C/C",               credito: "2.3.01.01 — Capital Social Integralizado",  valor: "50.000,00" },
  { id: 5, data: "20/10/2023", descricao: "Tarifa Bancária Manutenção",       debito: "4.1.02.01 — Despesas Financeiras",          credito: "1.1.01.01 — Banco Itaú C/C",               valor: "125,50"    },
  { id: 6, data: "22/10/2023", descricao: "Receita de Consultoria",           debito: "1.1.01.01 — Banco Itaú C/C",               credito: "3.1.01.01 — Receitas de Serviços",          valor: "8.400,00"  },
  { id: 7, data: "25/10/2023", descricao: "Pagamento de Salários",            debito: "4.1.01.01 — Despesas com Pessoal",          credito: "1.1.01.01 — Banco Itaú C/C",               valor: "12.300,00" },
  { id: 8, data: "28/10/2023", descricao: "Compra de Material de Escritório", debito: "4.1.01.02 — Despesas Administrativas",     credito: "1.1.01.01 — Banco Itaú C/C",               valor: "340,00"    },
];

const PAGE_SIZE = 5;
const TOTAL_MOCK = 142;

export default function LancamentosPage() {
  const [startDate, setStartDate] = useState("2023-10-01");
  const [endDate, setEndDate]     = useState("2023-10-31");
  const [conta, setConta]         = useState("all");
  const [page, setPage]           = useState(1);

  function parseBR(d: string) {
    const [day, month, year] = d.split("/");
    return new Date(`${year}-${month}-${day}`);
  }

  const filtered = LANCAMENTOS.filter((l) => {
    const date = parseBR(l.data);
    const from = startDate ? new Date(startDate) : null;
    const to   = endDate   ? new Date(endDate)   : null;
    if (from && date < from) return false;
    if (to   && date > to)   return false;
    if (conta !== "all") {
      const contaId = conta.split(" ")[0];
      if (!l.debito.startsWith(contaId) && !l.credito.startsWith(contaId)) return false;
    }
    return true;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const safePage      = Math.min(page, totalPages);
  const pageRows      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function clearFilters() {
    setStartDate("2023-10-01");
    setEndDate("2023-10-31");
    setConta("all");
    setPage(1);
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Cabeçalho */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium" style={{ color: "#6b7280" }}>Outubro 2023</p>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">Fluxo de Caixa</h1>
            </div>
          </header>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Receitas */}
            <div className="rounded-3xl p-5 flex flex-col justify-between gap-4" style={{ background: "#1e1e1e" }}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>Total Receitas</span>
                <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: "rgba(78,222,163,0.12)" }}>
                  <svg className="w-4 h-4" fill="none" stroke="#4edea3" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">R$ 62.650,00</p>
                <p className="text-xs mt-1 font-medium" style={{ color: "#4edea3" }}>↑ 12% este mês</p>
              </div>
            </div>

            {/* Despesas */}
            <div className="rounded-3xl p-5 flex flex-col justify-between gap-4" style={{ background: "#1e1e1e" }}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>Total Despesas</span>
                <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,100,100,0.1)" }}>
                  <svg className="w-4 h-4" fill="none" stroke="#ff6464" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 015.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">R$ 15.055,50</p>
                <p className="text-xs mt-1 font-medium" style={{ color: "#ff6464" }}>↓ 4% em relação a ontem</p>
              </div>
            </div>

            {/* Saldo */}
            <div className="rounded-3xl p-5 flex flex-col justify-between gap-4" style={{ background: "#4edea3" }}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#003824" }}>Saldo Disponível</span>
                <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,56,36,0.15)" }}>
                  <svg className="w-4 h-4" fill="none" stroke="#003824" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .596-.237 1.168-.659 1.591a2.25 2.25 0 01-1.591.659H6a2.25 2.25 0 01-2.25-2.25V14.15m16.5 0c0-1.242-1.008-2.25-2.25-2.25H3.75c-1.242 0-2.25 1.008-2.25 2.25m16.5 0l-3.59-3.59a2.25 2.25 0 00-3.182 0l-3.48 3.48m-1.67-3.48a2.25 2.25 0 00-3.182 0l-3.59 3.59" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight" style={{ color: "#003824" }}>R$ 47.594,50</p>
                <p className="text-xs mt-1 font-medium" style={{ color: "#00422b" }}>Balanço líquido</p>
              </div>
            </div>
          </div>

          {/* Grid: Formulário + Filtros/Tabela */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Formulário */}
            <div className="lg:col-span-5 lg:sticky lg:top-6">
              <NovoLancamentoForm />
            </div>

            {/* Filtros + Tabela */}
            <div className="lg:col-span-7 space-y-5">
              <LancamentosFilters
                startDate={startDate}
                endDate={endDate}
                conta={conta}
                contas={CONTAS}
                onStartDate={setStartDate}
                onEndDate={setEndDate}
                onConta={setConta}
                onClear={clearFilters}
                onApply={() => setPage(1)}
              />

              <div className="rounded-3xl overflow-hidden" style={{ background: "#1e1e1e" }}>
                <div
                  className="px-5 py-4 flex justify-between items-center"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#1a1a1a" }}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                    Histórico de Movimentações
                  </span>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-xl"
                    style={{ background: "#4edea3", color: "#003824" }}
                  >
                    {totalFiltered} lançamentos
                  </span>
                </div>
                <LancamentosTable
                  rows={pageRows}
                  page={safePage}
                  totalPages={totalPages}
                  total={totalFiltered}
                  pageSize={PAGE_SIZE}
                  onPage={setPage}
                />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}