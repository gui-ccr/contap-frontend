import { apiClient } from "@/shared/api";
import type { CriarUsuarioPayload, UsuarioBackend } from "./types/types";

export const usuariosService = {
  async listarUsuarios(): Promise<UsuarioBackend[]> {
    return await apiClient.get<UsuarioBackend[]>("/auth/usuarios");
  },

  async criarUsuario(payload: CriarUsuarioPayload): Promise<void> {
    await apiClient.post("/auth/registrar-usuario", payload);
  },

  async atualizarUsuario(id: string, payload: Partial<CriarUsuarioPayload>): Promise<UsuarioBackend> {
    return await apiClient.put<UsuarioBackend>(`/auth/usuarios/${id}`, payload);
  },

  async removerUsuario(id: string, excluirContas?: boolean): Promise<void> {
    const query = excluirContas ? "?excluirContas=true" : "";
    await apiClient.delete(`/auth/usuarios/${id}${query}`);
  },
};
