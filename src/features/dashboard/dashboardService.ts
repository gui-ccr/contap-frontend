import { apiClient } from "@/shared/api";

export interface DashboardResumo {
  totalLancamentos: number;
  valorTotalReceberPendente: number;
  valorTotalRecebido: number;
  totalReceitas: number;
  totalDespesas: number;
  resultadoLiquido: number;
}

export const dashboardService = {
  async obterResumo(dataInicio: string, dataFim: string): Promise<DashboardResumo> {
    return await apiClient.get<DashboardResumo>("/dashboard/resumo", {
      dataInicio,
      dataFim,
    });
  },
};
