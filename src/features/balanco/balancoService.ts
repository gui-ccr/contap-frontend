import { apiClient } from "@/shared/api";

export interface BalancoItem {
  label: string;
  valor: number;
}

export interface BalancoData {
  ativoCirculante: BalancoItem[];
  ativoNaoCirculante: BalancoItem[];
  passivoCirculante: BalancoItem[];
  passivoNaoCirculante: BalancoItem[];
  patrimonioLiquido: BalancoItem[];
  totalAtivo: number;
  totalPassivo: number;
}

export const balancoService = {
  async obterBalanco(): Promise<BalancoData> {
    try {
      return await apiClient.get<BalancoData>("/relatorios/balanco");
    } catch (err) {
      return await apiClient.get<BalancoData>("/relatorios/balanco-patrimonial");
    }
  },
};
