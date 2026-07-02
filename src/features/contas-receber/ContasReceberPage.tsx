"use client";

import { ContasFinanceirasPage } from "@/features/contas/ContasFinanceirasPage";
import type { ContasConfig } from "@/features/contas/types";
import { contasReceberService } from "./contasReceberService";

const config: ContasConfig = {
  eyebrow: "Gestão Financeira",
  titulo: "Contas a Receber",
  novoLabel: "Nova conta a receber",
  campoTituloLabel: "Origem / Cliente",
  campoDataLabel: "Data de previsão",
  campoTipoLabel: "Tipo da receita",
  tabelaTitulo: "Títulos a receber",
  statusLiquidado: "Recebido",
  statusAtrasado: "Atrasado",
  planoTipos: ["RECEITA", "ATIVO"],
  tipoBaixa: "conta_receber",
  fluxo: "entrada",

  async listar() {
    const data = await contasReceberService.listarContasReceber();
    return data.map((c) => ({
      id: c.id,
      titulo: c.origem,
      valor: c.valor,
      tipo: c.tipo,
      dataAlvo: c.data_previsao,
      liquidado: c.recebido,
      dataLiquidacao: c.data_recebimento,
    }));
  },
  criar(p) {
    return contasReceberService.criarContaReceber({
      origem: p.titulo,
      valor: p.valor,
      tipo: p.tipo,
      data_previsao: p.dataAlvo,
    });
  },
  atualizar(id, p) {
    return contasReceberService.atualizarContaReceber(id, {
      origem: p.titulo,
      valor: p.valor,
      tipo: p.tipo,
      data_previsao: p.dataAlvo,
    });
  },
};

export default function ContasReceberPage() {
  return <ContasFinanceirasPage config={config} />;
}
