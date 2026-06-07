"use client";

import { useState } from "react";

interface FinancialItemProps {
  label: string;
  value: number;
  type?: "positive" | "negative" | "neutral";
  indent?: boolean;
}

function FinancialRow({ label, value, type = "neutral", indent = false }: FinancialItemProps) {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  let labelColorClass = "text-on-surface-variant";
  if (type === "positive") labelColorClass = "text-primary";
  if (type === "negative") labelColorClass = "text-secondary";

  return (
    <div className={`flex justify-between items-center hover:bg-white/[0.04] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer select-none gap-2 ${indent ? "pl-7" : ""}`}>
      <span className={`text-[15px] flex items-center gap-1.5 min-w-0 ${labelColorClass}`}>
        {type === "negative" && <span className="material-symbols-outlined text-[15px] shrink-0">remove</span>}
        {type === "positive" && <span className="material-symbols-outlined text-[15px] shrink-0">add</span>}
        <span className="truncate">{label}</span>
      </span>
      <span className="font-mono text-[15px] font-medium text-on-surface tabular-nums shrink-0">
        {type === "negative" ? `- ${formattedValue}` : formattedValue}
      </span>
    </div>
  );
}

export function DrePage() {
  const [periodo, setPeriodo] = useState("Q3 2023 (Jul - Set)");

  return (
    <div className="w-full text-on-surface flex relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[20%] w-[400px] h-[400px] bg-tertiary-container/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 px-6 py-5 overflow-y-auto w-full flex flex-col gap-4 relative z-10">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-on-surface">Demonstração do Resultado</h2>
            <p className="text-[15px] text-on-surface-variant mt-0.5">Análise de Performance Financeira</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none cursor-pointer">
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                style={{ cursor: "pointer" }}
                className="w-full bg-surface-container-high/60 border border-white/5 rounded-xl py-2 pl-3 pr-8 text-[15px] text-on-surface focus:outline-none focus:border-primary transition-all backdrop-blur-md appearance-none"
              >
                <option className="bg-[#222526]">Q3 2023 (Jul - Set)</option>
                <option className="bg-[#222526]">Q2 2023 (Abr - Jun)</option>
                <option className="bg-[#222526]">Q1 2023 (Jan - Mar)</option>
                <option className="bg-[#222526]">Ano 2023</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[17px] pointer-events-none">
                expand_more
              </span>
            </div>

            <button
              style={{ cursor: "pointer" }}
              className="bg-white/[0.03] hover:bg-white/[0.07] active:scale-98 border border-white/5 text-on-surface py-2 px-3.5 rounded-xl text-[15px] font-medium transition-all flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              Exportar
            </button>
          </div>
        </div>

        {/* Blocos da DRE */}
        <div className="flex flex-col gap-3">

          {/* Bloco 1: Receita Operacional Bruta */}
          <div className="bg-surface-container/40 glass-panel border border-white/5 rim-light rounded-2xl p-5 flex flex-col gap-2.5 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-0.5">
              <h3 className="text-[15px] font-semibold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[17px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                  add_circle
                </span>
                Receita Operacional Bruta
              </h3>
              <span className="font-mono text-[15px] font-bold text-on-surface tabular-nums">R$ 1.250.000,00</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <FinancialRow label="Vendas de Produtos" value={850000} indent />
              <FinancialRow label="Prestação de Serviços" value={400000} indent />
            </div>

            <div className="pt-2 border-t border-dashed border-white/5">
              <FinancialRow label="Deduções e Impostos sobre Vendas" value={185000} type="negative" indent />
            </div>

            <div className="bg-surface-container-lowest/60 border border-white/5 px-4 py-2.5 rounded-xl flex justify-between items-center backdrop-blur-md">
              <span className="text-[13px] text-primary font-bold tracking-widest uppercase">
                = Receita Operacional Líquida
              </span>
              <span className="font-mono text-[15px] font-bold text-on-surface tabular-nums">R$ 1.065.000,00</span>
            </div>
          </div>

          {/* Bloco 2: Custos e Despesas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div className="bg-surface-container/40 glass-panel border border-white/5 rim-light rounded-2xl p-5 flex flex-col justify-between gap-2.5 shadow-xl">
              <div>
                <h4 className="text-[13px] text-secondary font-bold tracking-widest uppercase mb-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                    remove_circle
                  </span>
                  Custos (CMV / CSP)
                </h4>
                <div className="flex flex-col gap-0.5">
                  <FinancialRow label="Custo de Mercadorias Vendidas" value={320000} type="negative" />
                  <FinancialRow label="Custo de Serviços Prestados" value={80000} type="negative" />
                </div>
              </div>
              <div className="pt-2.5 border-t border-white/5 flex justify-between items-center">
                <span className="text-[14px] text-secondary font-semibold">Total de Custos</span>
                <span className="font-mono text-[15px] font-bold text-on-surface tabular-nums">- R$ 400.000,00</span>
              </div>
            </div>

            <div className="bg-surface-container/40 glass-panel border border-white/5 rim-light rounded-2xl p-5 flex flex-col justify-between gap-2.5 shadow-xl">
              <div>
                <h4 className="text-[13px] text-secondary font-bold tracking-widest uppercase mb-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                    remove_circle
                  </span>
                  Despesas Operacionais
                </h4>
                <div className="flex flex-col gap-0.5">
                  <FinancialRow label="Despesas Administrativas" value={150000} type="negative" />
                  <FinancialRow label="Despesas com Vendas" value={90000} type="negative" />
                </div>
              </div>
              <div className="pt-2.5 border-t border-white/5 flex justify-between items-center">
                <span className="text-[14px] text-secondary font-semibold">Total de Despesas</span>
                <span className="font-mono text-[15px] font-bold text-on-surface tabular-nums">- R$ 240.000,00</span>
              </div>
            </div>
          </div>

          {/* Bloco 3: Resultado Líquido */}
          <div className="w-full rounded-2xl border border-white/5 shadow-2xl bg-[#1e2120] overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch">

              {/* Esquerda: título e descrição */}
              <div className="flex-1 px-6 py-5 flex flex-col justify-center gap-2 border-b sm:border-b-0 sm:border-r border-white/5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#00E676] shrink-0">
                    trending_up
                  </span>
                  <span className="text-[13px] text-[#00E676] font-bold tracking-widest uppercase">
                    Resultado do Exercício
                  </span>
                </div>
                <h2 className="text-[17px] font-semibold text-white leading-snug">
                  Resultado Líquido do Exercício
                </h2>
                <p className="text-[14px] text-white/40 leading-relaxed">
                  Lucro após dedução integral de impostos, custos operacionais e despesas administrativas.
                </p>
              </div>

              {/* Direita: valor e margem */}
              <div className="px-6 sm:px-8 py-5 flex flex-col items-center justify-center gap-2 shrink-0">
                <span className="text-[18px] text-[#00E676] font-bold tracking-widest uppercase">
                  Lucro Apurado
                </span>
                <span className="font-sans font-bold text-[24px] leading-none tracking-tight tabular-nums text-[#00E676]">
                  R$ 425.000,00
                </span>
                <div className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[14px] font-semibold border cursor-pointer select-none transition-all hover:opacity-80 bg-[rgba(0,230,118,0.08)] text-[#00E676] border-[rgba(0,230,118,0.2)]">
                  <span className="material-symbols-outlined text-[15px]">
                    percent
                  </span>
                  Margem Líquida: 40%
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
