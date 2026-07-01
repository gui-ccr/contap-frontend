import { apiClient } from "@/shared/api";

export interface CargoBackend {
  id: string;
  empresa_id: string;
  nome: string;
  descricao?: string;
}

export interface CriarCargoPayload {
  nome: string;
  descricao?: string;
}

export const cargosService = {
  async listarCargos(): Promise<CargoBackend[]> {
    return await apiClient.get<CargoBackend[]>("/cargos");
  },

  async criarCargo(payload: CriarCargoPayload): Promise<CargoBackend> {
    return await apiClient.post<CargoBackend>("/cargos", payload);
  },

  async removerCargo(id: string): Promise<void> {
    await apiClient.delete(`/cargos/${id}`);
  },
};
