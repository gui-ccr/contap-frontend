"use client";

import { useState } from "react";
import NovoLancamentoForm from "./components/NovoLancamentoForm";
import { LancamentosFilters } from "./components/LancamentosFilters";
import { LancamentosTable } from "./components/LancamentosTable";

// ─── Mock data do Grupo ───────────────────────────────────────────────────────

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

// ─── Page Remodelada do Zero ──────────────────────────────────────────────────

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
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-600">
      
      {/* 1. CABEÇALHO DA PÁGINA */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fluxo de Caixa
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Análise detalhada de movimentações por conta e registro financeiro.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-center border border-emerald-200/50">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Ambiente Interno
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 2. BLOCO DE CARTÕES DE RESUMO (KPIS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Receitas</span>
              <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600 text-lg leading-none">📈</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-900">R$ 62.650,00</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Dados simulados ativos</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Despesas</span>
              <span className="p-2 bg-rose-50 rounded-xl text-rose-600 text-lg leading-none">📉</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-900">R$ 15.055,50</h3>
              <p className="text-xs text-rose-600 mt-1 font-medium">Balanço das contas</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between text-white border-none">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Saldo Geral</span>
              <span className="p-2 bg-slate-800/80 rounded-xl text-amber-400 text-lg leading-none">💼</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-white">R$ 47.594,50</h3>
              <p className="text-xs text-slate-300 mt-1">Balanço líquido atualizado</p>
            </div>
          </div>
        </div>

        {/* 3. ARQUITETURA DO GRID EM DUAS COLUNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LADO ESQUERDO: Formulário */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <NovoLancamentoForm />
          </div>

          {/* LADO DIREITO: Filtros e Tabela */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Bloco de Filtros Modernizado */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filtros de Pesquisa</h3>
              </div>
              
              {/* SOLUÇÃO DE BLINDAGEM: Enviamos tanto 'contas' quanto 'CONTAS' para garantir que o componente ache o array para fazer o .map() */}
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
            </div>

            {/* Bloco da Tabela Modernizado */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/60 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Histórico de Movimentações</h3>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                  {TOTAL_MOCK} Lançamentos
                </span>
              </div>
              
              <div className="p-4 sm:p-6 overflow-x-auto">
                <LancamentosTable
                  rows={pageRows || []}
                  page={page}
                  totalPages={totalPages}
                  total={TOTAL_MOCK}
                  pageSize={PAGE_SIZE}
                  onPage={setPage}
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}