import { apiClient } from "@/shared/api";
import type { CriarUsuarioPayload, UsuarioBackend } from "./types/types";

export const usuariosService = {
  async listarUsuarios(): Promise<UsuarioBackend[]> {
    return await apiClient.get<UsuarioBackend[]>("/auth/usuarios");
  },

  async criarUsuario(payload: CriarUsuarioPayload): Promise<{ id: string }> {
    return await apiClient.post<{ id: string }>("/auth/registrar-usuario", payload);
  },

  async atualizarUsuario(id: string, payload: Partial<CriarUsuarioPayload>): Promise<UsuarioBackend> {
    return await apiClient.put<UsuarioBackend>(`/auth/usuarios/${id}`, payload);
  },

  async removerUsuario(id: string, excluirContas?: boolean): Promise<void> {
    const query = excluirContas ? "?excluirContas=true" : "";
    await apiClient.delete(`/auth/usuarios/${id}${query}`);
  },

  async uploadFotoPerfil(file: File, usuarioId: string): Promise<string> {
    const { getSupabaseClient } = await import("@/shared/supabaseClient");
    const { getEmpresaIdFromToken } = await import("@/shared/api");
    const supabase = getSupabaseClient();
    const empresa_id = getEmpresaIdFromToken();
    if (!empresa_id) throw new Error("Empresa não encontrada na sessão");
    
    const ext = file.name.split(".").pop();
    const path = `${empresa_id}/fotos_perfil/${usuarioId}-${Date.now()}.${ext}`;
    
    const { error } = await supabase.storage
      .from("empresas")
      .upload(path, file, { upsert: true });

    if (error) throw new Error(`Erro ao fazer upload da foto: ${error.message}`);

    const { data } = supabase.storage.from("empresas").getPublicUrl(path);
    return data.publicUrl;
  },
};
