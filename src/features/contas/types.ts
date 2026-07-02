/**
 * Módulo genérico de contas financeiras.
 *
 * Contas a Pagar e Contas a Receber têm o mesmo comportamento e só mudam
 * nomes de campos e rótulos; as duas páginas são wrappers de configuração
 * sobre ContasFinanceirasPage.
 */

export interface ContaFinanceira {
  id: string;
  /** descricao (pagar) ou origem (receber) */
  titulo: string;
  valor: number;
  /** id da conta contábil no plano de contas */
  tipo: string;
  /** data_vencimento (pagar) ou data_previsao (receber), YYYY-MM-DD */
  dataAlvo: string;
  /** pago (pagar) ou recebido (receber) */
  liquidado: boolean;
  dataLiquidacao: string | null;
}

export interface ContaFinanceiraPayload {
  titulo: string;
  valor: number;
  tipo: string;
  dataAlvo: string;
}

export interface ContasConfig {
  /** ex.: "Gestão Financeira" */
  eyebrow: string;
  /** ex.: "Contas a Pagar" */
  titulo: string;
  /** rótulo do botão de criação */
  novoLabel: string;
  /** rótulo do campo título no formulário, ex.: "Descrição / Fornecedor" */
  campoTituloLabel: string;
  /** rótulo do campo de data, ex.: "Data de vencimento" */
  campoDataLabel: string;
  /** rótulo do select de tipo, ex.: "Tipo da despesa" */
  campoTipoLabel: string;
  /** título da tabela, ex.: "Títulos a pagar" */
  tabelaTitulo: string;
  /** palavra para o estado liquidado: "Pago" | "Recebido" */
  statusLiquidado: string;
  /** palavra para atraso: "Vencido" | "Atrasado" */
  statusAtrasado: string;
  /** tipos do plano de contas aceitos no select */
  planoTipos: string[];
  /** parâmetro tipoBaixa usado na página de notas fiscais */
  tipoBaixa: "conta_pagar" | "conta_receber";
  /** sentido do fluxo — muda ícone e acento da tabela */
  fluxo: "saida" | "entrada";

  listar(): Promise<ContaFinanceira[]>;
  criar(payload: ContaFinanceiraPayload): Promise<unknown>;
  atualizar(id: string, payload: ContaFinanceiraPayload): Promise<unknown>;
}
