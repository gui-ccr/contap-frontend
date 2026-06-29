import { apiClient } from "@/shared/api";

export interface DashboardResumoResponse {
  status: string;
  data: {
    totalLancamentos: number;
    valorTotalReceberPendente: number;
    valorTotalRecebido: number;
    totalReceitas: number;
    totalDespesas: number;
    resultadoLiquido: number;
  };
}

export const dashboardService = {
  async obterResumo(dataInicio: string, dataFim: string): Promise<DashboardResumoResponse["data"]> {
    const response = await apiClient.get<DashboardResumoResponse>("/dashboard/resumo", {
      dataInicio,
      dataFim,
    });
    return response.data;
  },
};
