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

        const agora = new Date();
        const [apiData] = await Promise.all([
          dashboardService.obterResumo(agora.getMonth() + 1, agora.getFullYear()),
        ]);

        const resumo = apiData.resumo;

        // 1. Cards de KPI com campos corretos do backend
        const updatedCards = KPI_DATA_TEMPLATE.map((card: KpiItem) => {
          let realValue = "R$ 0,00";
          if (card.label.toLowerCase().includes("consolidado")) {
            realValue = formatCurrency(resumo.saldoConsolidado ?? 0);
          } else if (card.label.toLowerCase().includes("receita")) {
            realValue = formatCurrency(resumo.receitasMes ?? 0);
          } else if (card.label.toLowerCase().includes("despesa")) {
            realValue = formatCurrency(resumo.despesasMes ?? 0);
          } else if (card.label.toLowerCase().includes("líquido")) {
            realValue = formatCurrency(resumo.lucroLiquido ?? 0);
            card.positive = (resumo.lucroLiquido ?? 0) >= 0;
          }
          return { ...card, value: realValue };
        });
        setKpiCardsMapped(updatedCards);

        // 2. Indicadores rápidos
        const margem = (resumo.receitasMes ?? 0) > 0
          ? Math.round(((resumo.lucroLiquido ?? 0) / resumo.receitasMes) * 100)
          : 0;
        setIndicators([
          { id: 1, label: "Margem de Lucro",   value: `${margem}%`,  meta: "Meta: 60%",     icon: Target,      ok: margem >= 60 },
          { id: 2, label: "Liquidez Corrente", value: "—",           meta: "Ideal: > 1,5x", icon: Zap,         ok: true },
          { id: 3, label: "Inadimplência",     value: "0,0%",        meta: "Meta: < 3%",    icon: ShieldCheck, ok: true },
        ]);

        // 3. Movimentações recentes (já vêm prontas do backend)
        if (apiData.movimentacoesRecentes?.length > 0) {
          const mappedRecent = apiData.movimentacoesRecentes.slice(0, 5).map((m, index) => ({
            id: index,
            nome: m.descricao || "Movimentação",
            categoria: m.tipo,
            data: new Date(m.data).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
            valor: `${m.tipo === "RECEITA" ? "+" : "-"} ${formatCurrency(m.valor)}`,
            entrada: m.tipo === "RECEITA",
            avatar: (m.descricao || "MV").substring(0, 2).toUpperCase(),
          }));
          setRecentTransactions(mappedRecent);

          const mappedCashFlow = apiData.movimentacoesRecentes.slice(0, 6).map((m, index) => ({
            id: index,
            descricao: m.descricao || "Movimentação",
            tipo: (m.tipo === "RECEITA" ? "entrada" : "saida") as "entrada" | "saida",
            data: new Date(m.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
            valor: `${m.tipo === "RECEITA" ? "+" : "-"} ${formatCurrency(m.valor)}`,
            status: "Confirmado",
          }));
          setCashFlowRows(mappedCashFlow);
        }

        // 4. Gráfico mensal (vem do desempenhoAnual)
        if (apiData.desempenhoAnual?.length > 0) {
          const mesesAbreviados = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
          const monthlyMap = mesesAbreviados.map((label, i) => {
            const entry = apiData.desempenhoAnual.find(d => d.mes === i + 1);
            return { mes: label, receita: entry?.receitas ?? 0, despesa: entry?.despesas ?? 0 };
          });
          setMonthlyData(monthlyMap);
        }

        // 5. Categorias de receita
        if (apiData.receitaPorCategoria?.length > 0) {
          const colors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
          const mappedCategories = apiData.receitaPorCategoria.slice(0, 4).map((c, index) => ({
            label: c.categoria,
            value: formatCurrency(c.valor),
            pct: Math.round(c.percentual),
            color: colors[index % colors.length],
          }));
          setCategories(mappedCategories);
        }

        // 6. Pendências operacionais
        if (apiData.pendenciasOperacionais?.length > 0) {
          const mappedPending = apiData.pendenciasOperacionais.slice(0, 5).map(p => {
            const dataVenc = new Date(p.vencimento);
            const hoje = new Date(); hoje.setHours(0,0,0,0); dataVenc.setHours(0,0,0,0);
            const diffDays = Math.ceil((dataVenc.getTime() - hoje.getTime()) / 86400000);
            const detalhe = diffDays < 0 ? `Atrasado há ${Math.abs(diffDays)} dia(s)` : diffDays === 0 ? "Vence hoje" : `Vence em ${dataVenc.toLocaleDateString("pt-BR")}`;
            return {
              id: p.id,
              titulo: p.descricao || "Pendência",
              detalhe: `${detalhe} · ${formatCurrency(p.valor)}`,
              urgente: diffDays <= 2,
              icon: diffDays <= 2 ? AlertCircle : Clock,
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