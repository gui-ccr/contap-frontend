"use client";

import { ContasFinanceirasPage } from "@/features/contas/ContasFinanceirasPage";
import type { ContasConfig } from "@/features/contas/types";
import { contasPagarService } from "./contasPagarService";

const config: ContasConfig = {
  eyebrow: "Gestão Financeira",
  titulo: "Contas a Pagar",
  novoLabel: "Nova conta a pagar",
  campoTituloLabel: "Descrição / Fornecedor",
  campoDataLabel: "Data de vencimento",
  campoTipoLabel: "Tipo da despesa",
  tabelaTitulo: "Títulos a pagar",
  statusLiquidado: "Pago",
  statusAtrasado: "Vencido",
  planoTipos: ["DESPESA", "PASSIVO"],
  tipoBaixa: "conta_pagar",
  fluxo: "saida",

  async listar() {
    const data = await contasPagarService.listarContasPagar();
    return data.map((c) => ({
      id: c.id,
      titulo: c.descricao,
      valor: c.valor,
      tipo: c.tipo,
      dataAlvo: c.data_vencimento,
      liquidado: c.pago,
      dataLiquidacao: c.data_pagamento,
    }));
  },
  criar(p) {
    return contasPagarService.criarContaPagar({
      descricao: p.titulo,
      valor: p.valor,
      tipo: p.tipo,
      data_vencimento: p.dataAlvo,
    });
  },
  atualizar(id, p) {
    return contasPagarService.atualizarContaPagar(id, {
      descricao: p.titulo,
      valor: p.valor,
      tipo: p.tipo,
      data_vencimento: p.dataAlvo,
    });
  },
};

export default function ContasPagarPage() {
  return <ContasFinanceirasPage config={config} />;
}
