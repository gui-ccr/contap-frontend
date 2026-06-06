"use client";

import { useState } from "react";
import NovoLancamentoForm from "./components/NovoLancamentoForm";
import { LancamentosFilters } from "./components/LancamentosFilters";
import { LancamentosTable } from "./components/LancamentosTable";

// ─── Mock data do Grupo ───────────────────────────────────────────────────────

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

  const totalPages = Math.ceil(TOTAL_MOCK / PAGE_SIZE);
  const pageRows   = LANCAMENTOS.slice(0, PAGE_SIZE);

  function clearFilters() {
    setStartDate("2023-10-01");
    setEndDate("2023-10-31");
    setConta("all");
    setPage(1);
  }
 
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-600 selection:bg-slate-200">
      
      {/* 1. CABEÇALHO DA PÁGINA */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Fluxo de Caixa
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            Gerencie e monitore todos os lançamentos financeiros da Contap com precisão.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-emerald-50/80 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-center border border-emerald-200/60 shadow-sm shadow-emerald-100/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Ambiente Interno
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 2. BLOCO DE CARTÕES DE RESUMO (KPIS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Receitas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Receitas</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">R$ 62.650,00</h3>
              <p className="text-xs text-emerald-600 mt-1.5 font-semibold flex items-center gap-1">
                <span>↑ 12%</span>
                <span className="text-slate-400 font-normal">este mês</span>
              </p>
            </div>
          </div>

          {/* Card Despesas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Despesas</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 015.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">R$ 15.055,50</h3>
              <p className="text-xs text-rose-600 mt-1.5 font-semibold flex items-center gap-1">
                <span>↓ 4%</span>
                <span className="text-slate-400 font-normal">em relação a ontem</span>
              </p>
            </div>
          </div>

          {/* Card Saldo Executivo */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between text-white border-none group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-slate-700/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex justify-between items-center z-10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Saldo Disponível</span>
              <div className="p-2 bg-slate-800/80 text-amber-400 rounded-xl group-hover:scale-110 transition-transform duration-200 border border-slate-700/50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .596-.237 1.168-.659 1.591a2.25 2.25 0 01-1.591.659H6a2.25 2.25 0 01-2.25-2.25V14.15m16.5 0c0-1.242-1.008-2.25-2.25-2.25H3.75c-1.242 0-2.25 1.008-2.25 2.25m16.5 0l-3.59-3.59a2.25 2.25 0 00-3.182 0l-3.48 3.48m-1.67-3.48a2.25 2.25 0 00-3.182 0l-3.59 3.59m4.125-15.75h10.5a2.25 2.25 0 012.25 2.25v4.125H3.75V5.25a2.25 2.25 0 012.25-2.25z" />
                </svg>
              </div>
            </div>
            <div className="mt-5 z-10">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">R$ 47.594,50</h3>
              <p className="text-xs text-slate-300 mt-1.5 font-medium tracking-wide">Balanço líquido em tempo real</p>
            </div>
          </div>
        </div>

        {/* 3. ARQUITETURA DO GRID EM DUAS COLUNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LADO ESQUERDO: Formulário */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 transition-all duration-200">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-1 overflow-hidden">
              <div className="p-5 pb-3 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Novo Registro</h3>
                <p className="text-xs text-slate-400 mt-0.5">Insira os dados do lançamento abaixo</p>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-b-2xl">
                <NovoLancamentoForm />
              </div>
            </div>
          </div>

          {/* LADO DIREITO: Filtros e Tabela */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Bloco de Filtros */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                    </svg>
                  </span>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Filtros de Pesquisa</h3>
                </div>
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
            </div>

            {/* Bloco da Tabela */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="px-6 py-4.5 bg-slate-50/70 border-b border-slate-200/80 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-slate-200/60 text-slate-700 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </span>
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Histórico de Movimentações</h3>
                </div>
                <span className="text-xs bg-slate-900 text-white px-2.5 py-1 rounded-md font-bold tracking-tight shadow-sm">
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