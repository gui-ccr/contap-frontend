import { apiClient } from "@/shared/api";

export interface IResumoDashboard {
  saldoConsolidado: number;
  receitasMes: number;
  despesasMes: number;
  lucroLiquido: number;
}

export interface IDesempenhoMensal {
  mes: number;
  ano: number;
  receitas: number;
  despesas: number;
}

export interface IReceitaCategoria {
  categoria: string;
  valor: number;
  percentual: number;
}

export interface IMovimentacaoRecente {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: "RECEITA" | "DESPESA";
}

export interface IPendenciaOperacional {
  id: string;
  descricao: string;
  valor: number;
  vencimento: string;
  cliente: string;
}

export interface DashboardData {
  resumo: IResumoDashboard;
  desempenhoAnual: IDesempenhoMensal[];
  receitaPorCategoria: IReceitaCategoria[];
  movimentacoesRecentes: IMovimentacaoRecente[];
  pendenciasOperacionais: IPendenciaOperacional[];
}

export const dashboardService = {
  async obterResumo(mes?: number, ano?: number): Promise<DashboardData> {
    const params: Record<string, string> = {};
    if (mes) params["mes"] = String(mes);
    if (ano) params["ano"] = String(ano);
    return await apiClient.get<DashboardData>("/dashboard/resumo", params);
  },
};
