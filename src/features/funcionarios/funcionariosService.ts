import { apiClient } from "@/shared/api";
import type { CriarFuncionarioPayload, FuncionarioBackend } from "./types/types";

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

export const funcionariosService = {
  async listarFuncionarios(): Promise<FuncionarioBackend[]> {
    const response = await apiClient.get<FuncionarioBackend[] | ApiEnvelope<FuncionarioBackend[]>>("/funcionarios");
    return unwrap(response);
  },

  async criarFuncionario(payload: CriarFuncionarioPayload): Promise<void> {
    await apiClient.post("/auth/registrar-funcionario", payload);
  },

  async atualizarFuncionario(id: string, payload: Partial<Omit<CriarFuncionarioPayload, "empresa_id" | "senha" | "email">>): Promise<FuncionarioBackend> {
    const response = await apiClient.patch<FuncionarioBackend | ApiEnvelope<FuncionarioBackend>>(`/funcionarios/${id}`, payload);
    return unwrap(response);
  },

  async removerFuncionario(id: string): Promise<void> {
    await apiClient.delete(`/funcionarios/${id}`);
  },
};
