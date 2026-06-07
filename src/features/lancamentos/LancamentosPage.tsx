"use client";

import { useState } from "react";
import { LancamentosFilters } from "./components/LancamentosFilters";
import { LancamentosTable } from "./components/LancamentosTable";

// ─── Mock data ────────────────────────────────────────────────────────────────

const CONTAS = [
  { value: "all",        label: "Todas as Contas" },
  { value: "1.1.01.01", label: "1.1.01.01 — Banco Itaú C/C" },
  { value: "3.1.01.01", label: "3.1.01.01 — Receitas de Serviços" },
  { value: "4.1.01.02", label: "4.1.01.02 — Despesas Administrativas" },
  { value: "2.1.01.01", label: "2.1.01.01 — Fornecedores Nacionais" },
];

const LANCAMENTOS = [
  { id: 1, data: "10/10/2023", descricao: "Pagamento Fornecedor XYZ",        debito: "2.1.01.01 — Fornecedores Nacionais",        credito: "1.1.01.01 — Banco Itaú C/C",               valor: "1.500,00"  },
  { id: 2, data: "12/10/2023", descricao: "Recebimento NF 1024",              debito: "1.1.01.01 — Banco Itaú C/C",               credito: "1.1.02.01 — Clientes Nacionais",            valor: "4.250,00"  },
  { id: 3, data: "15/10/2023", descricao: "Aquisição de Licenças Software",   debito: "4.1.01.02 — Despesas Administrativas",     credito: "1.1.01.01 — Banco Itaú C/C",               valor: "890,00"    },
  { id: 4, data: "18/10/2023", descricao: "Aporte de Capital Sócios",         debito: "1.1.01.01 — Banco Itaú C/C",               credito: "2.3.01.01 — Capital Social Integralizado",  valor: "50.000,00" },
  { id: 5, data: "20/10/2023", descricao: "Tarifa Bancária Manutenção",       debito: "4.1.02.01 — Despesas Financeiras",         credito: "1.1.01.01 — Banco Itaú C/C",               valor: "125,50"    },
  { id: 6, data: "22/10/2023", descricao: "Receita de Consultoria",           debito: "1.1.01.01 — Banco Itaú C/C",               credito: "3.1.01.01 — Receitas de Serviços",         valor: "8.400,00"  },
  { id: 7, data: "25/10/2023", descricao: "Pagamento de Salários",            debito: "4.1.01.01 — Despesas com Pessoal",         credito: "1.1.01.01 — Banco Itaú C/C",               valor: "12.300,00" },
  { id: 8, data: "28/10/2023", descricao: "Compra de Material de Escritório", debito: "4.1.01.02 — Despesas Administrativas",     credito: "1.1.01.01 — Banco Itaú C/C",               valor: "340,00"    },
];

const PAGE_SIZE = 5;
const TOTAL_MOCK = 142;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LancamentosPage() {
  const [startDate, setStartDate] = useState("2023-10-01");
  const [endDate, setEndDate]     = useState("2023-10-31");
  const [conta, setConta]         = useState("all");
  const [page, setPage]           = useState(1);

  const totalPages = Math.ceil(TOTAL_MOCK / PAGE_SIZE);
  const pageRows   = LANCAMENTOS.slice(0, PAGE_SIZE);

  function clearFilters() {
    setStartDate("2023-10-01");
    setEndDate("2023-10-31");
    setConta("all");
    setPage(1);
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-5">

          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: "#e5e2e1" }}>
              Listagem de Lançamentos
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Análise detalhada de movimentações por conta.
            </p>
          </div>

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

          <LancamentosTable
            rows={pageRows}
            page={page}
            totalPages={totalPages}
            total={TOTAL_MOCK}
            pageSize={PAGE_SIZE}
            onPage={setPage}
          />

        </div>
      </main>
    </div>
  );
}
