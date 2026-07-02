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
    const res = await apiClient.get<any>(`/relatorios/balanco-patrimonial${query}`);

    const mapItem = (item: any) => ({
      label: item.nome ?? item.codigo ?? "Conta sem nome",
      valor: Number(item.saldo) || 0,
    });
    const codigo = (item: any): string => String(item.codigo ?? "");

    const ativos = res.ativos || [];
    const passivos = res.passivos || [];
    const pl = res.patrimonioLiquido || [];

    return {
      ativoCirculante: ativos.filter((a: any) => codigo(a).startsWith("1.1")).map(mapItem),
      ativoNaoCirculante: ativos.filter((a: any) => !codigo(a).startsWith("1.1")).map(mapItem),
      passivoCirculante: passivos.filter((p: any) => codigo(p).startsWith("2.1")).map(mapItem),
      passivoNaoCirculante: passivos.filter((p: any) => !codigo(p).startsWith("2.1")).map(mapItem),
      patrimonioLiquido: pl.map(mapItem),
      totalAtivo: res.totalAtivo || 0,
      totalPassivo: (res.totalPassivo || 0) + (res.totalPL || 0),
    };
  },
};
