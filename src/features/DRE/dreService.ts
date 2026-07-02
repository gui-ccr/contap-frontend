import { apiClient } from "@/shared/api";

export interface FinancialEntry {
  codigo: string;
  nome: string;
  saldo: number;
}

export interface DreData {
  empresaId: string;
  dataInicio: string;
  dataFim: string;
  receitas: FinancialEntry[];
  despesas: FinancialEntry[];
  totalReceitas: number;
  totalDespesas: number;
  resultadoLiquido: number;
}

export interface DrePeriodo {
  label: string;
  dataInicio: string;
  dataFim: string;
}

const NOMES_TRIMESTRES = ["Jan - Mar", "Abr - Jun", "Jul - Set", "Out - Dez"];

function trimestre(ano: number, indice: number): DrePeriodo {
  const mesInicio = indice * 3; // 0, 3, 6, 9
  const inicio = new Date(Date.UTC(ano, mesInicio, 1));
  const fim = new Date(Date.UTC(ano, mesInicio + 3, 0)); // dia 0 do mês seguinte = último dia
  return {
    label: `Q${indice + 1} ${ano} (${NOMES_TRIMESTRES[indice]})`,
    dataInicio: inicio.toISOString().split("T")[0],
    dataFim: fim.toISOString().split("T")[0],
  };
}

/**
 * Períodos disponíveis para o seletor: os trimestres do ano corrente até o
 * atual, o ano corrente inteiro e o ano anterior inteiro.
 */
export function gerarPeriodosDre(hoje: Date = new Date()): DrePeriodo[] {
  const ano = hoje.getFullYear();
  const trimestreAtual = Math.floor(hoje.getMonth() / 3);

  const periodos: DrePeriodo[] = [];
  for (let i = trimestreAtual; i >= 0; i--) {
    periodos.push(trimestre(ano, i));
  }
  periodos.push({
    label: `Ano ${ano}`,
    dataInicio: `${ano}-01-01`,
    dataFim: `${ano}-12-31`,
  });
  periodos.push({
    label: `Ano ${ano - 1}`,
    dataInicio: `${ano - 1}-01-01`,
    dataFim: `${ano - 1}-12-31`,
  });
  return periodos;
}

export const dreService = {
  async obterDre(periodo: DrePeriodo): Promise<DreData> {
    return await apiClient.get<DreData>("/relatorios/dre", {
      dataInicio: periodo.dataInicio,
      dataFim: periodo.dataFim,
    });
  },
};
