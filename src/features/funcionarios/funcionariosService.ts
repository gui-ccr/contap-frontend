import { apiClient } from "@/shared/api";
import type { CriarFuncionarioPayload, FuncionarioBackend } from "./types/types";

export const funcionariosService = {
  async listarFuncionarios(): Promise<FuncionarioBackend[]> {
    return await apiClient.get<FuncionarioBackend[]>("/funcionarios");
  },

  async criarFuncionario(payload: CriarFuncionarioPayload): Promise<void> {
    await apiClient.post("/auth/registrar-funcionario", payload);
  },

  async atualizarFuncionario(id: string, payload: Partial<Omit<CriarFuncionarioPayload, "empresa_id" | "senha" | "email">>): Promise<FuncionarioBackend> {
    return await apiClient.patch<FuncionarioBackend>(`/funcionarios/${id}`, payload);
  },

  async removerFuncionario(id: string): Promise<void> {
    await apiClient.delete(`/funcionarios/${id}`);
  },
};
