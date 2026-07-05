import { apiClient, getEmpresaIdFromToken } from "@/shared/api";

export interface ContaReceberBackend {
  id: string;
  empresa_id: string;
  origem: string;
  valor: number;
  tipo: string;
  data_previsao: string;
  recebido: boolean;
  data_recebimento: string | null;
  valor_pago?: number | null;
}

export interface CriarContaReceberPayload {
  origem: string;
  valor: number;
  tipo: string;
  data_previsao: string;
}

export interface AtualizarContaReceberPayload {
  origem?: string;
  valor?: number;
  tipo?: string;
  data_previsao?: string;
}

export const contasReceberService = {
  async listarContasReceber(): Promise<ContaReceberBackend[]> {
    return await apiClient.get<ContaReceberBackend[]>("/contas-receber/conta-receber");
  },

  async criarContaReceber(payload: CriarContaReceberPayload): Promise<ContaReceberBackend> {
    return await apiClient.post<ContaReceberBackend>("/contas-receber/conta-receber", payload);
  },

  async atualizarContaReceber(id: string, payload: AtualizarContaReceberPayload): Promise<ContaReceberBackend> {
    return await apiClient.put<ContaReceberBackend>(`/contas-receber/conta-receber/${id}`, payload);
  },

  async baixarConta(id: string, valor_pago?: number): Promise<void> {
    await apiClient.patch(`/contas-receber/conta-receber/${id}`, { valor_pago });
  },
};
