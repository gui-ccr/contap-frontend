'use client';

import React from 'react';
// Importação dos componentes (o seu novo e os dois dos seus amigos com chaves)
import NovoLancamentoForm from './components/NovoLancamentoForm';
import { LancamentosFilters } from './components/LancamentosFilters';
import { LancamentosTable } from './components/LancamentosTable';

export default function LancamentosPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-600">
      
      {/* 1. CABEÇALHO DA PÁGINA (DESIGN DO ZERO) */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fluxo de Caixa
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie e monitore todos os lançamentos financeiros da Contap.
          </p>
        </div>
        
        {/* Badge de Status do Sistema */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-center border border-emerald-200/50">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Ambiente Interno
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 2. BLOCO DE CARTÕES DE RESUMO (KPIS DO ZERO) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Cartão de Receitas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Receitas</span>
              <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600 text-lg leading-none">📈</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-900">R$ 14.250,00</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">↑ 12% este mês</p>
            </div>
          </div>

          {/* Cartão de Despesas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Despesas</span>
              <span className="p-2 bg-rose-50 rounded-xl text-rose-600 text-lg leading-none">📉</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-900">R$ 5.840,00</h3>
              <p className="text-xs text-rose-600 mt-1 font-medium">↓ 4% em relação a ontem</p>
            </div>
          </div>

          {/* Cartão de Saldo Geral Executivo */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between text-white border-none">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Saldo Disponível</span>
              <span className="p-2 bg-slate-800/80 rounded-xl text-amber-400 text-lg leading-none">💼</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-white">R$ 8.410,00</h3>
              <p className="text-xs text-slate-300 mt-1">Balanço líquido atualizado</p>
            </div>
          </div>

        </div>

        {/* 3. ARQUITETURA DO GRID EM DUAS COLUNAS (DO ZERO) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LADO ESQUERDO: O seu formulário (Ocupa 5/12 do espaço e fica fixo ao rolar a página) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <NovoLancamentoForm />
          </div>

          {/* LADO DIREITO: Filtros e Tabela do Grupo (Ocupa 7/12 do espaço) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Bloco de Filtros Sanitizado */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filtros de Pesquisa</h3>
              </div>
              <LancamentosFilters />
            </div>

            {/* Bloco da Tabela Sanitizado e Responsivo */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/60 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Histórico de Movimentações</h3>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                  Filtrados
                </span>
              </div>
              
              <div className="p-4 sm:p-6 overflow-x-auto">
                <LancamentosTable />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}