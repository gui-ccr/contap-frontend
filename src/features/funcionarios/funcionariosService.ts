import { apiClient } from "@/shared/api";
import type { CriarFuncionarioPayload, FuncionarioBackend } from "./types/types";

export const funcionariosService = {
  async listarFuncionarios(): Promise<FuncionarioBackend[]> {
    return await apiClient.get<FuncionarioBackend[]>("/funcionarios");
  },

  async criarFuncionario(payload: CriarFuncionarioPayload): Promise<FuncionarioBackend> {
    return await apiClient.post<FuncionarioBackend>("/funcionarios", payload);
  },

  async atualizarFuncionario(id: string, payload: Partial<CriarFuncionarioPayload>): Promise<FuncionarioBackend> {
    return await apiClient.put<FuncionarioBackend>(`/funcionarios/${id}`, payload);
  },

  async removerFuncionario(id: string, excluirContas?: boolean): Promise<void> {
    const query = excluirContas ? "?excluirContas=true" : "";
    await apiClient.delete(`/funcionarios/${id}${query}`);
  },

  async uploadFotoFuncionario(file: File, funcionarioId: string): Promise<string> {
    const { getSupabaseClient } = await import("@/shared/supabaseClient");
    const { getEmpresaIdFromToken } = await import("@/shared/api");
    const supabase = getSupabaseClient();
    const empresa_id = getEmpresaIdFromToken();
    if (!empresa_id) throw new Error("Empresa nǜo encontrada na sessǜo");
    
    const ext = file.name.split(".").pop();
    const path = `${empresa_id}/fotos_perfil/${funcionarioId}-${Date.now()}.${ext}`;
    
    const { error } = await supabase.storage
      .from("empresas")
      .upload(path, file, { upsert: true });

    if (error) throw new Error(`Erro ao fazer upload da foto: ${error.message}`);

    const { data } = supabase.storage.from("empresas").getPublicUrl(path);
    return data.publicUrl;
  },
};
