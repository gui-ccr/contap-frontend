import { apiClient, getEmpresaIdFromToken } from "@/shared/api";

export interface ContaReceberBackend {
  id: string;
  empresa_id: string;
  origem: string;
  valor: number;
  data_previsao: string;
  recebido: boolean;
  data_recebimento: string | null;
}

export interface CriarContaReceberPayload {
  empresa_id: string;
  origem: string;
  valor: number;
  data_previsao: string;
}

export const contasReceberService = {
  async listarContasReceber(): Promise<ContaReceberBackend[]> {
    const empresaId = getEmpresaIdFromToken();
    if (!empresaId) throw new Error("Empresa não encontrada na sessão");
    return await apiClient.get<ContaReceberBackend[]>("/contas-receber/conta-receber", { empresa_id: empresaId });
  },

  async criarContaReceber(payload: Omit<CriarContaReceberPayload, "empresa_id">): Promise<ContaReceberBackend> {
    const empresaId = getEmpresaIdFromToken();
    if (!empresaId) throw new Error("Empresa não encontrada na sessão");
    return await apiClient.post<ContaReceberBackend>("/contas-receber/conta-receber", { ...payload, empresa_id: empresaId });
  },

  async baixarConta(id: string): Promise<void> {
    await apiClient.patch(`/contas-receber/conta-receber/${id}`);
  },
};
