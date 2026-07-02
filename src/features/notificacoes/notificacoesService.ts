import { apiClient } from "@/shared/api";

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  data_criacao: string;
}

export interface ListarNotificacoesResponse {
  notificacoes: Notificacao[];
  naoLidas: number;
}

class NotificacoesService {
  async listar(empresaId: string): Promise<ListarNotificacoesResponse> {
    const data = await apiClient.get<ListarNotificacoesResponse>(`/notificacoes/${empresaId}`);
    return data;
  }

  async marcarComoLida(id: string): Promise<Notificacao> {
    const data = await apiClient.patch<Notificacao>(`/notificacoes/${id}/lida`);
    return data;
  }
}

export const notificacoesService = new NotificacoesService();
