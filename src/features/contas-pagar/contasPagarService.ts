import { apiClient } from "@/shared/api";

export interface ContaPagarBackend {
  id: string;
  empresa_id: string;
  descricao: string;
  valor: number;
  tipo: string;
  data_vencimento: string;
  pago: boolean;
  data_pagamento: string | null;
}

export interface CriarContaPagarPayload {
  descricao: string;
  valor: number;
  tipo: string;
  data_vencimento: string;
}

export interface AtualizarContaPagarPayload {
  descricao?: string;
  valor?: number;
  tipo?: string;
  data_vencimento?: string;
}

export const contasPagarService = {
  async listarContasPagar(): Promise<ContaPagarBackend[]> {
    return await apiClient.get<ContaPagarBackend[]>("/contas-pagar");
  },

  async criarContaPagar(payload: CriarContaPagarPayload): Promise<ContaPagarBackend> {
    return await apiClient.post<ContaPagarBackend>("/contas-pagar", payload);
  },

  async atualizarContaPagar(id: string, payload: AtualizarContaPagarPayload): Promise<ContaPagarBackend> {
    return await apiClient.put<ContaPagarBackend>(`/contas-pagar/${id}`, payload);
  },

  async baixarConta(id: string): Promise<void> {
    await apiClient.patch(`/contas-pagar/${id}/pagar`);
  },
};
