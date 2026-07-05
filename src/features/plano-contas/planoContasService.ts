import { apiClient } from "@/shared/api";

export type TipoConta = "ATIVO" | "PASSIVO" | "PL" | "RECEITA" | "DESPESA" | "CUSTO";

export interface ContaContabil {
  id: string;
  empresa_id: string;
  codigo: string;
  nome: string;
  tipo: TipoConta;
}

export interface ContaContabilPayload {
  empresa_id: string;
  codigo: string;
  nome: string;
  tipo: TipoConta;
}

export const planoContasService = {
  async listarContas(empresaId?: string): Promise<ContaContabil[]> {
    return await apiClient.get<ContaContabil[]>(
      "/plano-contas",
      empresaId ? { empresa_id: empresaId } : undefined
    );
  },

  async criarConta(payload: ContaContabilPayload): Promise<ContaContabil> {
    return await apiClient.post<ContaContabil>("/plano-contas", payload);
  },

  async atualizarConta(id: string, payload: Partial<ContaContabilPayload>): Promise<ContaContabil> {
    return await apiClient.patch<ContaContabil>(`/plano-contas/${id}`, payload);
  },

  async removerConta(id: string): Promise<void> {
    await apiClient.delete(`/plano-contas/${id}`);
  },
};
