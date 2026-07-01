import { apiClient } from "@/shared/api";

export interface BalancoItem {
  label: string;
  valor: number;
}

export interface BalancoData {
  ativoCirculante: BalancoItem[];
  ativoNaoCirculante: BalancoItem[];
  passivoCirculante: BalancoItem[];
  passivoNaoCirculante: BalancoItem[];
  patrimonioLiquido: BalancoItem[];
  totalAtivo: number;
  totalPassivo: number;
}

export const balancoService = {
  async obterBalanco(dataBase?: string): Promise<BalancoData> {
    const today = new Date().toISOString().split('T')[0];
    const query = `?dataBase=${dataBase || today}`;
    try {
      const res = await apiClient.get<any>(`/relatorios/balanco-patrimonial${query}`);
      
      const mapItem = (item: any) => ({ label: item.nome, valor: item.saldo });
      
      const ativos = res.ativos || [];
      const passivos = res.passivos || [];
      const pl = res.patrimonioLiquido || [];

      return {
        ativoCirculante: ativos.filter((a: any) => a.codigo.startsWith('1.1')).map(mapItem),
        ativoNaoCirculante: ativos.filter((a: any) => !a.codigo.startsWith('1.1')).map(mapItem),
        passivoCirculante: passivos.filter((p: any) => p.codigo.startsWith('2.1')).map(mapItem),
        passivoNaoCirculante: passivos.filter((p: any) => !p.codigo.startsWith('2.1')).map(mapItem),
        patrimonioLiquido: pl.map(mapItem),
        totalAtivo: res.totalAtivo || 0,
        totalPassivo: (res.totalPassivo || 0) + (res.totalPL || 0),
      };
    } catch (err) {
      console.error("Erro ao buscar balanço patrimonial:", err);
      throw err;
    }
  },
};
