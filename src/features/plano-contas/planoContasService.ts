import { apiClient } from "@/shared/api";

export type TipoConta = "ATIVO" | "PASSIVO" | "PL" | "RECEITA" | "DESPESA";

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

interface ApiEnvelope<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

function unwrap<T>(response: T | ApiEnvelope<T>): T {
  if (
    response &&
    typeof response === "object" &&
    "status" in response &&
    "data" in response
  ) {
    return (response as ApiEnvelope<T>).data;
  }

  return response as T;
}

export const planoContasService = {
  async listarContas(empresaId?: string): Promise<ContaContabil[]> {
    const response = await apiClient.get<ContaContabil[] | ApiEnvelope<ContaContabil[]>>(
      "/plano-contas",
      empresaId ? { empresa_id: empresaId } : undefined
    );
    return unwrap(response);
  },

  async criarConta(payload: ContaContabilPayload): Promise<ContaContabil> {
    const response = await apiClient.post<ContaContabil | ApiEnvelope<ContaContabil>>("/plano-contas", payload);
    return unwrap(response);
  },

  async atualizarConta(id: string, payload: Partial<ContaContabilPayload>): Promise<ContaContabil> {
    const response = await apiClient.patch<ContaContabil | ApiEnvelope<ContaContabil>>(`/plano-contas/${id}`, payload);
    return unwrap(response);
  },

  async removerConta(id: string): Promise<void> {
    await apiClient.delete(`/plano-contas/${id}`);
  },
};
