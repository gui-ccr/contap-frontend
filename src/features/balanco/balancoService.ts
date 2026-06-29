import { apiClient } from "@/shared/api";

export interface BalancoItem {
  label: string;
  valor: number;
}

export interface BalancoDataResponse {
  status: string;
  data: {
    ativoCirculante: BalancoItem[];
    ativoNaoCirculante: BalancoItem[];
    passivoCirculante: BalancoItem[];
    passivoNaoCirculante: BalancoItem[];
    patrimonioLiquido: BalancoItem[];
    totalAtivo: number;
    totalPassivo: number;
  };
}

export const balancoService = {
  async obterBalanco(): Promise<BalancoDataResponse["data"]> {
    // Tenta primeiro /relatorios/balanco
    try {
      const response = await apiClient.get<BalancoDataResponse>("/relatorios/balanco");
      return response.data;
    } catch (err) {
      // Se falhar, tenta o fallback /relatorios/balanco-patrimonial
      const response = await apiClient.get<BalancoDataResponse>("/relatorios/balanco-patrimonial");
      return response.data;
    }
  },
};
