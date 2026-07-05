"use client";

import { useState, useEffect, useMemo } from "react";
import { dreService, gerarPeriodosDre, FinancialEntry } from "./dreService";

interface FinancialRowProps {
  label: string;
  value: number;
  type?: "positive" | "negative" | "neutral";
  indent?: boolean;
}

function FinancialRow({ label, value, type = "neutral", indent = false }: FinancialRowProps) {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  let labelColorClass = "text-on-surface-variant"; 
  if (type === "positive") labelColorClass = "text-primary"; 
  if (type === "negative") labelColorClass = "text-secondary"; 

  return (
    <div className={`flex justify-between items-center hover:bg-white/[0.04] p-xs rounded-lg transition-all cursor-pointer select-none ${indent ? "pl-8" : ""}`}>
      <span className={`text-body-md flex items-center gap-2 cursor-pointer ${labelColorClass}`}>
        {type === "negative" && <i className="fi fi-rr-minus text-[16px] cursor-pointer"></i>}
        {type === "positive" && <i className="fi fi-rr-plus text-[16px] cursor-pointer"></i>}
        {label}
      </span>
      <span className="font-mono text-mono-data font-medium text-on-surface cursor-pointer">
        {type === "negative" ? `- ${formattedValue}` : formattedValue}
      </span>
    </div>
  );
}

export function DrePage() {
  const periodos = useMemo(() => gerarPeriodosDre(), []);
  const [periodoLabel, setPeriodoLabel] = useState(periodos[0].label);
  const periodo = periodos.find((p) => p.label === periodoLabel) ?? periodos[0];
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await dreService.obterDre(periodo);
        setReportData(data);
      } catch (err: any) {
        setError(err.message || "Falha na conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodoLabel]);

  const margemLiquida = reportData && reportData.totalReceitas > 0
    ? ((reportData.resultadoLiquido / reportData.totalReceitas) * 100).toFixed(0)
    : "0";

  return (
    <div className="w-full text-on-surface flex relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[20%] w-[400px] h-[400px] bg-tertiary-container/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 p-margin-mobile md:p-margin-desktop overflow-y-auto max-w-5xl w-full mx-auto flex flex-col gap-gutter relative z-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-md">
          <div>
            <h2 className="text-headline-lg font-semibold tracking-tight text-on-surface">Demonstração do Resultado</h2>
            <p className="text-body-md text-on-surface-variant mt-0.5">Análise de Performance Financeira</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none cursor-pointer">
              <select
                value={periodoLabel}
                onChange={(e) => setPeriodoLabel(e.target.value)}
                style={{ cursor: "pointer" }}
                className="w-full bg-surface-container-high/60 border border-white/5 rounded-xl py-2.5 pl-4 pr-10 text-label-md text-on-surface focus:outline-none focus:border-primary transition-all backdrop-blur-md cursor-pointer appearance-none relative z-10"
              >
                {periodos.map((p) => (
                  <option key={p.label} className="bg-[#222526]">{p.label}</option>
                ))}
              </select>
              <i className="fi fi-rr-expand-more absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] z-0 pointer-events-none"></i>
            </div>

            <button 
              style={{ cursor: "pointer" }}
              className="bg-white/[0.03] hover:bg-white/[0.07] active:scale-98 border border-white/5 text-on-surface py-2.5 px-4 rounded-xl text-label-md font-medium transition-all flex items-center gap-2 cursor-pointer select-none"
            >
              <i className="fi fi-rr-download text-[18px] cursor-pointer"></i>
              Exportar
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-body-md text-on-surface-variant animate-pulse">Carregando relatório ContaUp...</p>
          </div>
        )}

        {error && (
          <div className="bg-secondary/10 border border-secondary/20 p-md rounded-2xl text-center my-10">
            <p className="text-secondary font-medium">{error}</p>
            <p className="text-sm text-on-surface-variant mt-1">Verifique se efetuou o Login para gerar o token de acesso.</p>
          </div>
        )}

        {!loading && !error && reportData && (
          <div className="flex flex-col gap-md">
            
            <div className="bg-surface-container/40 glass-panel border border-white/5 rim-light rounded-2xl p-md flex flex-col gap-base shadow-xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-sm mb-xs">
                <h3 className="text-headline-md text-primary font-semibold flex items-center gap-2">
                  <i className="fi fi-rr-add-circle text-primary" style={{ fontVariationSettings: '"FILL" 1' }}></i>
                  Receita Operacional Bruta
                </h3>
                <span className="font-mono text-headline-md font-bold text-on-surface">
                  {formatCurrency(reportData.totalReceitas)}
                </span>
              </div>
              
              <div className="flex flex-col gap-xs">
                {reportData.receitas.length === 0 ? (
                  <p className="text-sm text-on-surface-variant pl-4 italic">Nenhuma receita lançada no período.</p>
                ) : (
                  reportData.receitas.map((item: FinancialEntry) => (
                    <FinancialRow key={item.codigo} label={item.nome} value={item.saldo} indent />
                  ))
                )}
              </div>

              <div className="mt-sm bg-surface-container-lowest/60 border border-white/5 p-sm rounded-xl flex justify-between items-center backdrop-blur-md">
                <span className="text-label-md text-primary font-bold tracking-wider uppercase text-xs">
                  = Receita Operacional Líquida
                </span>
                <span className="font-mono text-body-lg font-bold text-on-surface">
                  {formatCurrency(reportData.totalReceitas)}
                </span>
              </div>
            </div>

            <div className="bg-surface-container/40 glass-panel border border-white/5 rim-light rounded-2xl p-md flex flex-col gap-sm shadow-xl">
              <div>
                <h4 className="text-label-md text-secondary font-bold tracking-wider uppercase text-xs mb-sm flex items-center gap-2">
                  <i className="fi fi-rr-remove-circle text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}></i>
                  Custos e Despesas Operacionais
                </h4>
                
                <div className="flex flex-col gap-xs">
                  {reportData.custos.length === 0 && reportData.despesas.length === 0 ? (
                    <p className="text-sm text-on-surface-variant italic">Nenhum custo ou despesa lançado no período.</p>
                  ) : (
                    <>
                      {reportData.custos.map((item: FinancialEntry) => (
                        <FinancialRow key={item.codigo} label={item.nome} value={item.saldo} type="negative" />
                      ))}
                      {reportData.despesas.map((item: FinancialEntry) => (
                        <FinancialRow key={item.codigo} label={item.nome} value={item.saldo} type="negative" />
                      ))}
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-md pt-sm border-t border-white/5 flex justify-between items-center">
                <span className="text-label-sm text-secondary font-medium">Total de Deduções e Despesas</span>
                <span className="font-mono text-body-md font-bold text-on-surface">
                  - {formatCurrency(reportData.totalDespesas + reportData.totalCustos)}
                </span>
              </div>
            </div>

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
                
                <span className={`font-sans font-bold text-[44px] md:text-[56px] leading-none tracking-tight ${reportData.resultadoLiquido >= 0 ? 'text-[#00E676]' : 'text-secondary'}`}>
                  {formatCurrency(reportData.resultadoLiquido)}
                </span>
                
                <div 
                  style={{ cursor: "pointer" }}
                  className="mt-4 inline-flex items-center gap-2 bg-[#00E676]/10 text-[#00E676] px-5 py-2 rounded-xl text-sm font-semibold border border-[#00E676]/20 shadow-sm cursor-pointer select-none hover:bg-[#00E676]/20 transition-all"
                >
                  <i className="fi fi-rr-arrow-trend-up text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}></i>
                  Margem Líquida: {margemLiquida}%
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}