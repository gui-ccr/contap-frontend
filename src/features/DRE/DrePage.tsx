"use client";

import { useState } from "react";

interface FinancialItemProps {
  label: string;
  value: number;
  type?: "positive" | "negative" | "neutral";
  indent?: boolean;
}

// Componente de Linha com cursor forçado diretamente no container e elementos de texto
function FinancialRow({ label, value, type = "neutral", indent = false }: FinancialItemProps) {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  let labelColorClass = "text-on-surface-variant"; 
  if (type === "positive") labelColorClass = "text-primary"; 
  if (type === "negative") labelColorClass = "text-secondary"; 

  return (
    // cursor-pointer aplicado com !important virtual do tailwind e select-none para não bugar ao clicar várias vezes
    <div className={`flex justify-between items-center hover:bg-white/[0.04] p-xs rounded-lg transition-all cursor-pointer select-none ${indent ? "pl-8" : ""}`}>
      <span className={`text-body-md flex items-center gap-2 cursor-pointer ${labelColorClass}`}>
        {type === "negative" && <span className="material-symbols-outlined text-[16px] cursor-pointer">remove</span>}
        {type === "positive" && <span className="material-symbols-outlined text-[16px] cursor-pointer">add</span>}
        {label}
      </span>
      <span className="font-mono text-mono-data font-medium text-on-surface cursor-pointer">
        {type === "negative" ? `- ${formattedValue}` : formattedValue}
      </span>
    </div>
  );
}

export function DrePage() {
  const [periodo, setPeriodo] = useState("Q3 2023 (Jul - Set)");

  return (
    <div className="w-full text-on-surface flex relative overflow-hidden">
      {/* Luzes de Fundo de Efeito Visual */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[20%] w-[400px] h-[400px] bg-tertiary-container/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Canvas Principal da DRE (Sem o Header Duplicado) */}
      <div className="flex-1 p-margin-mobile md:p-margin-desktop overflow-y-auto max-w-5xl w-full mx-auto flex flex-col gap-gutter relative z-10">
        
        {/* Cabeçalho de Filtros Internos */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-md">
          <div>
            <h2 className="text-headline-lg font-semibold tracking-tight text-on-surface">Demonstração do Resultado</h2>
            <p className="text-body-md text-on-surface-variant mt-0.5">Análise de Performance Financeira</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Container do Select */}
            <div className="relative flex-1 sm:flex-none cursor-pointer">
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                // Forçado o cursor pointer nativo via style para mitigar qualquer negação de folha de estilo global
                style={{ cursor: "pointer" }}
                className="w-full bg-surface-container-high/60 border border-white/5 rounded-xl py-2.5 pl-4 pr-10 text-label-md text-on-surface focus:outline-none focus:border-primary transition-all backdrop-blur-md cursor-pointer appearance-none relative z-10"
              >
                <option className="bg-[#222526]">Q3 2023 (Jul - Set)</option>
                <option className="bg-[#222526]">Q2 2023 (Abr - Jun)</option>
                <option className="bg-[#222526]">Q1 2023 (Jan - Mar)</option>
                <option className="bg-[#222526]">Ano 2023</option>
              </select>
              {/* Seta do select com z-0 para o clique cair direto no select interativo abaixo dela */}
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] z-0 pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Botão de Exportar com feedback de clique (active:scale) */}
            <button 
              style={{ cursor: "pointer" }}
              className="bg-white/[0.03] hover:bg-white/[0.07] active:scale-98 border border-white/5 text-on-surface py-2.5 px-4 rounded-xl text-label-md font-medium transition-all flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-[18px] cursor-pointer">download</span>
              Exportar
            </button>
          </div>
        </div>

        {/* Grids da DRE */}
        <div className="flex flex-col gap-md">
          
          {/* Bloco 1: Receita Operacional Bruta */}
          <div className="bg-surface-container/40 glass-panel border border-white/5 rim-light rounded-2xl p-md flex flex-col gap-base shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-sm mb-xs">
              <h3 className="text-headline-md text-primary font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
                  add_circle
                </span>
                Receita Operacional Bruta
              </h3>
              <span className="font-mono text-headline-md font-bold text-on-surface">R$ 1.250.000,00</span>
            </div>
            
            <div className="flex flex-col gap-xs">
              <FinancialRow label="Vendas de Produtos" value={850000} indent />
              <FinancialRow label="Prestação de Serviços" value={400000} indent />
            </div>

            <div className="mt-xs pt-sm border-t border-white/5 border-dashed">
              <FinancialRow label="Deduções e Impostos" value={185000} type="negative" indent />
            </div>

            <div className="mt-sm bg-surface-container-lowest/60 border border-white/5 p-sm rounded-xl flex justify-between items-center backdrop-blur-md">
              <span className="text-label-md text-primary font-bold tracking-wider uppercase text-xs">
                = Receita Operacional Líquida
              </span>
              <span className="font-mono text-body-lg font-bold text-on-surface">R$ 1.065.000,00</span>
            </div>
          </div>

          {/* Bloco 2: Custos e Despesas Lado a Lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            
            {/* Custos */}
            <div className="bg-surface-container/40 glass-panel border border-white/5 rim-light rounded-2xl p-md flex flex-col justify-between gap-sm shadow-xl">
              <div>
                <h4 className="text-label-md text-secondary font-bold tracking-wider uppercase text-xs mb-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>
                    remove_circle
                  </span>
                  Custos (CMV/CSP)
                </h4>
                <div className="flex flex-col gap-xs">
                  <FinancialRow label="Custo de Mercadorias" value={320000} type="negative" />
                  <FinancialRow label="Custo de Serviços" value={80000} type="negative" />
                </div>
              </div>
              <div className="mt-md pt-sm border-t border-white/5 flex justify-between items-center">
                <span className="text-label-sm text-secondary font-medium">Total de Custos</span>
                <span className="font-mono text-body-md font-bold text-on-surface">- R$ 400.000,00</span>
              </div>
            </div>

            {/* Despesas */}
            <div className="bg-surface-container/40 glass-panel border border-white/5 rim-light rounded-2xl p-md flex flex-col justify-between gap-sm shadow-xl">
              <div>
                <h4 className="text-label-md text-secondary font-bold tracking-wider uppercase text-xs mb-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>
                    remove_circle
                  </span>
                  Despesas Operacionais
                </h4>
                <div className="flex flex-col gap-xs">
                  <FinancialRow label="Despesas Administrativas" value={150000} type="negative" />
                  <FinancialRow label="Despesas com Vendas" value={90000} type="negative" />
                </div>
              </div>
              <div className="mt-md pt-sm border-t border-white/5 flex justify-between items-center">
                <span className="text-label-sm text-secondary font-medium">Total de Despesas</span>
                <span className="font-mono text-body-md font-bold text-on-surface">- R$ 240.000,00</span>
              </div>
            </div>

          </div>

          {/* Bloco 3: Card do Resultado Líquido */}
          <div className="w-full relative rounded-3xl p-10 border border-white/5 shadow-2xl bg-[#222526] text-center flex flex-col items-center justify-center gap-6">
            <h2 className="text-[32px] md:text-[36px] text-white font-semibold tracking-tight">
              Resultado Líquido do Exercício
            </h2>
            
            <p className="text-[16px] md:text-[18px] text-white/70 max-w-2xl mx-auto text-center leading-relaxed tracking-wide font-normal">
              O lucro líquido apurado após a dedução total de impostos, custos de operação e despesas administrativas financeiras representa o resultado final do exercício.
            </p>

            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="text-xs text-[#00E676] font-bold tracking-widest uppercase">
                Lucro Apurado
              </span>
              
              <span className="font-sans font-bold text-[44px] md:text-[56px] leading-none tracking-tight text-[#00E676]">
                R$ 425.000,00
              </span>
              
              <div 
                style={{ cursor: "pointer" }}
                className="mt-4 inline-flex items-center gap-2 bg-[#00E676]/10 text-[#00E676] px-5 py-2 rounded-xl text-sm font-semibold border border-[#00E676]/20 shadow-sm cursor-pointer select-none hover:bg-[#00E676]/20 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                  trending_up
                </span>
                Margem Líquida: 40%
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}