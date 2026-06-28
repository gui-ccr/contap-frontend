import { apiClient } from "@/shared/api";

export interface LancamentoBackend {
  id: string;
  empresaId: string;
  dataLancamento: string;
  descricao: string;
  partidas: {
    contaId: string;
    tipo: "D" | "C";
    valor: number;
  }[];
}

export interface LancamentoSimplificadoPayload {
  empresa_id: string;
  descricao: string;
  valor: number;
  tipoTransacao: "DEBITO" | "CREDITO";
  data_lancamento: string;
}

export const lancamentosService = {
  async listarLancamentos(): Promise<LancamentoBackend[]> {
    return await apiClient.get<LancamentoBackend[]>("/lancamentos/lancamentos");
  },

  async criarLancamentoSimplificado(payload: LancamentoSimplificadoPayload): Promise<void> {
    await apiClient.post("/lancamentos/lancamento/simplificado", payload);
  },
};
