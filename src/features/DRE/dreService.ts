import { apiClient } from "@/shared/api";

export interface FinancialEntry {
  codigo: string;
  nome: string;
  saldo: number;
}

export interface DreData {
  empresaId: string;
  dataInicio: string;
  dataFim: string;
  receitas: FinancialEntry[];
  despesas: FinancialEntry[];
  totalReceitas: number;
  totalDespesas: number;
  resultadoLiquido: number;
}

export const dreService = {
  async obterDre(periodo: string): Promise<DreData> {
    let dataInicio = "2023-07-01";
    let dataFim = "2023-09-30";

    if (periodo.includes("Q2")) {
      dataInicio = "2023-04-01";
      dataFim = "2023-06-30";
    } else if (periodo.includes("Q1")) {
      dataInicio = "2023-01-01";
      dataFim = "2023-03-31";
    } else if (periodo.includes("Ano")) {
      dataInicio = "2023-01-01";
      dataFim = "2023-12-31";
    }

    return await apiClient.get<DreData>("/relatorios/dre", {
      dataInicio,
      dataFim,
    });
  },
};
