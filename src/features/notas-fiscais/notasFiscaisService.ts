import { apiClient, getEmpresaIdFromToken } from "@/shared/api";
import { supabase } from "@/shared/supabaseClient";

export interface NotaFiscal {
  id: string;
  empresa_id: string;
  tipo_referencia: "conta_pagar" | "conta_receber";
  referencia_id: string;
  numero_nota: string | null;
  arquivo_url: string;
  arquivo_nome: string;
  emitida_em: string | null;
  criado_em: string;
}

export interface AnexarNotaPayload {
  tipo_referencia: "conta_pagar" | "conta_receber";
  referencia_id: string;
  numero_nota?: string;
  arquivo_url: string;
  arquivo_nome: string;
  emitida_em?: string;
}

export const notasFiscaisService = {
  async uploadArquivo(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("notas-fiscais")
      .upload(path, file, { upsert: false });

    if (error) throw new Error(`Erro ao fazer upload: ${error.message}`);

    const { data } = supabase.storage.from("notas-fiscais").getPublicUrl(path);
    return data.publicUrl;
  },

  async anexar(payload: AnexarNotaPayload): Promise<NotaFiscal> {
    const empresa_id = getEmpresaIdFromToken();
    if (!empresa_id) throw new Error("Empresa não encontrada na sessão");
    return apiClient.post<NotaFiscal>("/notas-fiscais", { ...payload, empresa_id });
  },

  async listar(): Promise<NotaFiscal[]> {
    const empresa_id = getEmpresaIdFromToken();
    if (!empresa_id) throw new Error("Empresa não encontrada na sessão");
    return apiClient.get<NotaFiscal[]>("/notas-fiscais", { empresa_id });
  },

  async listarPorReferencia(referencia_id: string): Promise<NotaFiscal[]> {
    return apiClient.get<NotaFiscal[]>(`/notas-fiscais/referencia/${referencia_id}`);
  },

  async deletar(id: string): Promise<void> {
    await apiClient.delete(`/notas-fiscais/${id}`);
  },
};
