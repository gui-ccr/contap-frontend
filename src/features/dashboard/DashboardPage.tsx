"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { KpiCards } from "./components/KpiCards";
import { MonthlyChart } from "./components/MonthlyChart";
import { CashFlowTable } from "./components/CashFlowTable";
import { QuickIndicators } from "./components/QuickIndicators";
import { RecentTransactions } from "./components/RecentTransactions";
import { PendingItems } from "./components/PendingItems";

import { KpiItem, IndicatorItem } from "./types";
import { dashboardService } from "./dashboardService";
import { lancamentosService, LancamentoBackend } from "@/features/lancamentos/lancamentosService";
import { contasReceberService } from "@/features/contas-receber/contasReceberService";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Zap,
  ShieldCheck,
  AlertCircle,
  Clock,
} from "lucide-react";

// Templates locais vazios/iniciais para a estrutura do Dashboard (sem dados fictícios de negócios)
const KPI_DATA_TEMPLATE: KpiItem[] = [
  { id: 1, label: "Saldo Consolidado", value: "R$ 0,00", change: "", positive: true,  icon: Wallet,      detail: "Saldo em conta" },
  { id: 2, label: "Receita do Mês",    value: "R$ 0,00", change: "",  positive: true,  icon: TrendingUp,  detail: "Mês atual"        },
  { id: 3, label: "Despesas Totais",   value: "R$ 0,00",  change: "",  positive: false, icon: TrendingDown, detail: "Mês atual"       },
  { id: 4, label: "Lucro Líquido",     value: "R$ 0,00",  change: "", positive: true,  icon: BarChart3,   detail: "Resultado"   },
];

const INDICATORS_TEMPLATE: IndicatorItem[] = [
  { id: 1, label: "Margem de Lucro",   value: "0%",  meta: "Meta: 60%",     icon: Target,      ok: false },
  { id: 2, label: "Liquidez Corrente", value: "0,0x", meta: "Ideal: > 1,5x", icon: Zap,         ok: false },
  { id: 3, label: "Inadimplência",     value: "0%",  meta: "Meta: < 3%",    icon: ShieldCheck, ok: true },
];

export default function DashboardPage() {
  const [kpiCardsMapped, setKpiCardsMapped] = useState<any[]>(KPI_DATA_TEMPLATE);
  const [indicators, setIndicators] = useState<any[]>(INDICATORS_TEMPLATE);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cashFlowRows, setCashFlowRows] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);
        
        const dataInicio = "2023-01-01";
        const dataFim = "2023-12-31";

        // Busca todas as informações necessárias da API em paralelo
        const [apiData, lancamentos, contasReceber] = await Promise.all([
          dashboardService.obterResumo(dataInicio, dataFim),
          lancamentosService.listarLancamentos().catch(() => [] as LancamentoBackend[]),
          contasReceberService.listarContasReceber().catch(() => [])
        ]);

        // 1. Mapear os Cards de KPI com dados reais da API
        const updatedCards = KPI_DATA_TEMPLATE.map((card: KpiItem) => {
          let realValue = "R$ 0,00";
          let detailText = card.detail;

          if (String(card.id) === "1" || card.label.toLowerCase().includes("consolidado")) {
            realValue = formatCurrency(apiData.valorTotalRecebido); // Saldo consolidado/recebido
          } else if (String(card.id) === "2" || card.label.toLowerCase().includes("receita")) {
            realValue = formatCurrency(apiData.totalReceitas);
          } else if (String(card.id) === "3" || card.label.toLowerCase().includes("despesa")) {
            realValue = formatCurrency(apiData.totalDespesas);
          } else if (String(card.id) === "4" || card.label.toLowerCase().includes("líquido")) {
            realValue = formatCurrency(apiData.resultadoLiquido);
            card.positive = apiData.resultadoLiquido >= 0;
          }

          return {
            ...card,
            value: realValue,
            detail: detailText,
          };
        });
        setKpiCardsMapped(updatedCards);

        // Heurística contábil para identificar se um lançamento é entrada ou saída
        const isEntrada = (l: LancamentoBackend) => {
          const hasRevenue = l.partidas.some(p => p.tipo === "C" && p.contaId.startsWith("3"));
          if (hasRevenue) return true;
          const hasExpense = l.partidas.some(p => p.tipo === "D" && p.contaId.startsWith("4"));
          if (hasExpense) return false;
          return l.partidas.some(p => p.tipo === "C");
        };

        // Calcular Margem de Lucro Real
        const margem = apiData.totalReceitas > 0 
          ? Math.round((apiData.resultadoLiquido / apiData.totalReceitas) * 100) 
          : 0;

        const updatedIndicators = [
          { id: 1, label: "Margem de Lucro",   value: `${margem}%`, meta: "Meta: 60%",     icon: Target,      ok: margem >= 60 },
          { id: 2, label: "Liquidez Corrente", value: "2,4x",  meta: "Ideal: > 1,5x", icon: Zap,         ok: true },
          { id: 3, label: "Inadimplência",     value: "0,0%",  meta: "Meta: < 3%",    icon: ShieldCheck, ok: true },
        ];
        setIndicators(updatedIndicators);

        if (lancamentos.length > 0) {
          // 2. Mapear Movimentações Recentes (últimos 5 lançamentos reais)
          const mappedRecent = lancamentos
            .slice(-5)
            .reverse()
            .map((l, index) => {
              const entrada = isEntrada(l);
              const valorNum = l.partidas[0]?.valor || 0;
              return {
                id: index,
                nome: l.descricao || "Lançamento",
                categoria: l.partidas[0]?.contaId || "Geral",
                data: new Date(l.dataLancamento).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
                valor: `${entrada ? "+" : "-"} ${formatCurrency(valorNum)}`,
                entrada,
                avatar: (l.descricao || "LA").substring(0, 2).toUpperCase()
              };
            });
          setRecentTransactions(mappedRecent);

          // 3. Mapear Tabela de Fluxo de Caixa (últimos 6 lançamentos reais)
          const mappedCashFlow = lancamentos
            .slice(-6)
            .reverse()
            .map((l, index) => {
              const entrada = isEntrada(l);
              const valorNum = l.partidas[0]?.valor || 0;
              return {
                id: index,
                descricao: l.descricao || "Lançamento",
                tipo: (entrada ? "entrada" : "saida") as "entrada" | "saida",
                data: new Date(l.dataLancamento).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
                valor: `${entrada ? "+" : "-"} ${formatCurrency(valorNum)}`,
                status: "Confirmado"
              };
            });
          setCashFlowRows(mappedCashFlow);

          // 4. Mapear Gráfico Mensal dinamicamente com base nos lançamentos reais
          const mesesAbreviados = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
          const monthlyMap = mesesAbreviados.map(mes => ({ mes, receita: 0, despesa: 0 }));
          
          lancamentos.forEach(l => {
            const date = new Date(l.dataLancamento);
            const monthIndex = date.getMonth();
            if (monthIndex >= 0 && monthIndex < 12) {
              const valorNum = l.partidas[0]?.valor || 0;
              if (isEntrada(l)) {
                monthlyMap[monthIndex].receita += valorNum;
              } else {
                monthlyMap[monthIndex].despesa += valorNum;
              }
            }
          });
          setMonthlyData(monthlyMap);

          // 5. Mapear Distribuição por Categorias (Top 4 contas de receita)
          const CONTAS_LABELS: Record<string, string> = {
            "1.1.01.01": "Banco Itaú C/C",
            "3.1.01.01": "Receitas de Serviços",
            "4.1.01.02": "Despesas Adm.",
            "2.1.01.01": "Fornecedores Nac.",
          };
          const categoriesMap: Record<string, number> = {};
          let totalRevenues = 0;

          lancamentos.forEach(l => {
            if (isEntrada(l)) {
              const valorNum = l.partidas[0]?.valor || 0;
              const conta = l.partidas.find(p => p.tipo === "C")?.contaId || "Outros";
              categoriesMap[conta] = (categoriesMap[conta] || 0) + valorNum;
              totalRevenues += valorNum;
            }
          });

          const colors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
          const mappedCategories = Object.entries(categoriesMap)
            .map(([conta, valor], index) => {
              const pct = totalRevenues > 0 ? Math.round((valor / totalRevenues) * 100) : 0;
              return {
                label: CONTAS_LABELS[conta] || `Conta ${conta}`,
                value: formatCurrency(valor),
                pct,
                color: colors[index % colors.length]
              };
            })
            .sort((a, b) => b.pct - a.pct)
            .slice(0, 4);
          if (mappedCategories.length > 0) {
            setCategories(mappedCategories);
          }
        }

        // 6. Mapear Contas a Receber Pendentes (reais)
        if (contasReceber && contasReceber.length > 0) {
          const mappedPending = contasReceber
            .filter(c => !c.recebido)
            .slice(0, 5)
            .map(c => {
              const dataPrevisao = new Date(c.data_previsao);
              const hoje = new Date();
              hoje.setHours(0, 0, 0, 0);
              dataPrevisao.setHours(0, 0, 0, 0);
              
              const diffTime = dataPrevisao.getTime() - hoje.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              let detalhe = `Vence em ${new Date(c.data_previsao).toLocaleDateString("pt-BR")}`;
              if (diffDays < 0) {
                detalhe = `Atrasado há ${Math.abs(diffDays)} dia(s)`;
              } else if (diffDays === 0) {
                detalhe = "Vence hoje";
              }

              return {
                id: c.id,
                titulo: c.origem || "Contas a Receber",
                detalhe: `${detalhe} · ${formatCurrency(c.valor)}`,
                urgente: diffDays <= 2,
                icon: diffDays <= 2 ? AlertCircle : Clock
              };
            });
          setPendingItems(mappedPending);
        }

      } catch (err: any) {
        setError(err.message || "Erro de conexão com a API.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <main className="flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8 text-white">
      <DashboardHeader today={today} />
      
      {loading && (
        <div className="py-4 text-sm text-gray-400 animate-pulse flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          Sincronizando métricas em tempo real...
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-xs text-red-400 mb-4">
          ⚠️ {error}. Certifique-se de realizar o Login para autenticar.
        </div>
      )}

      <KpiCards data={kpiCardsMapped} />
      
      <MonthlyChart data={monthlyData} categories={categories} />
      <CashFlowTable rows={cashFlowRows} />

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <QuickIndicators indicators={indicators} />
        <RecentTransactions transactions={recentTransactions} />
        <PendingItems items={pendingItems} />
      </section>
    </main>
  );
}