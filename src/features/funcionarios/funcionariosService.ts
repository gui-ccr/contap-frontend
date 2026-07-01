import { apiClient } from "@/shared/api";
import type { CriarFuncionarioPayload, FuncionarioBackend } from "./types/types";

export const funcionariosService = {
  async listarFuncionarios(): Promise<FuncionarioBackend[]> {
    return await apiClient.get<FuncionarioBackend[]>("/funcionarios");
  },

  async criarFuncionario(payload: CriarFuncionarioPayload): Promise<void> {
    await apiClient.post("/funcionarios", payload);
  },

  async atualizarFuncionario(id: string, payload: Partial<CriarFuncionarioPayload>): Promise<FuncionarioBackend> {
    return await apiClient.patch<FuncionarioBackend>(`/funcionarios/${id}`, payload);
  },

  async removerFuncionario(id: string, excluirContas?: boolean): Promise<void> {
    const query = excluirContas ? "?excluirContas=true" : "";
    await apiClient.delete(`/funcionarios/${id}${query}`);
  },
};
