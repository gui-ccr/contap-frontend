import { apiClient } from "@/shared/api";

export interface ContaPagarBackend {
  id: string;
  empresa_id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  pago: boolean;
  data_pagamento: string | null;
}

export const contasPagarService = {
  async listar(): Promise<ContaPagarBackend[]> {
    return await apiClient.get<ContaPagarBackend[]>("/contas-pagar");
  },

  async criar(payload: { descricao: string; valor: number; data_vencimento: string }): Promise<ContaPagarBackend> {
    return await apiClient.post<ContaPagarBackend>("/contas-pagar", payload);
  },

  async pagar(id: string): Promise<ContaPagarBackend> {
    return await apiClient.patch<ContaPagarBackend>(`/contas-pagar/${id}/pagar`);
  },
};
