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
  async obterResumo(dataInicio?: string, dataFim?: string): Promise<DashboardData> {
    const params: Record<string, string> = {};
    if (dataInicio) params["data_inicio"] = dataInicio;
    if (dataFim) params["data_fim"] = dataFim;
    return await apiClient.get<DashboardData>("/dashboard/resumo", params);
  },
};
