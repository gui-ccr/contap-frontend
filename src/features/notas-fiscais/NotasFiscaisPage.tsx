"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { ConfirmModal } from "@/ui/ConfirmModal";
import { Field, Input, Button } from "@/ui/forms";
import { contasReceberService, ContaReceberBackend } from "@/features/contas-receber/contasReceberService";
import { notasFiscaisService, NotaFiscal } from "./notasFiscaisService";
import { apiClient, getEmpresaIdFromToken } from "@/shared/api";
import { primeiroDiaDoMes, ultimoDiaDoMes } from "@/features/contas/dateUtils";
import { UsuariosPagination } from "@/features/usuarios/components/UsuariosPagination";
import { AnexarNotaModal, type AnexarNotaFormData } from "./components/AnexarNotaModal";
import { NotasContasTable, type ContaComNotas } from "./components/NotasContasTable";

interface ContaPagar {
  id: string;
  empresa_id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  pago: boolean;
  data_pagamento: string | null;
}

async function listarContasPagar(): Promise<ContaPagar[]> {
  const empresa_id = getEmpresaIdFromToken();
  if (!empresa_id) throw new Error("Empresa não encontrada na sessão");
  return apiClient.get<ContaPagar[]>("/contas-pagar", { empresa_id });
}

type Tab = "conta_receber" | "conta_pagar";

interface ModalState {
  open: boolean;
  tipo: Tab;
  referencia_id: string;
  descricao: string;
}

export default function NotasFiscaisPage() {
  const [tab, setTab] = useState<Tab>("conta_receber");
  const [contasReceber, setContasReceber] = useState<ContaReceberBackend[]>([]);
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>([]);
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<ModalState>({ open: false, tipo: "conta_receber", referencia_id: "", descricao: "" });
  const [confirmDeleteNfId, setConfirmDeleteNfId] = useState<string | null>(null);

  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMes);
  const [dataFim, setDataFim] = useState(ultimoDiaDoMes);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => setPageSize(e.matches ? 8 : 4);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const carregar = async () => {
    try {
      setLoading(true);
      const [cr, cp, nf] = await Promise.all([
        contasReceberService.listarContasReceber(),
        listarContasPagar(),
        notasFiscaisService.listar(),
      ]);
      setContasReceber(cr);
      setContasPagar(cp);
      setNotas(nf);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar notas fiscais.");
    } finally {
      setLoading(false);
    }
  };

  // Abre o modal automaticamente quando a página é chamada com ?darBaixaId=...
  useEffect(() => {
    carregar().then(() => {
      const search = new URLSearchParams(window.location.search);
      const darBaixaId = search.get("darBaixaId");
      const tipoBaixa = search.get("tipoBaixa") as Tab;
      const descBaixa = search.get("descBaixa");

      if (darBaixaId && tipoBaixa && descBaixa) {
        setTab(tipoBaixa);
        setModal({ open: true, tipo: tipoBaixa, referencia_id: darBaixaId, descricao: descBaixa });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAnexar(data: AnexarNotaFormData) {
    try {
      const url = await notasFiscaisService.uploadArquivo(data.arquivo);
      await notasFiscaisService.anexar({
        tipo_referencia: modal.tipo,
        referencia_id: modal.referencia_id,
        numero_nota: data.numero_nota || undefined,
        arquivo_url: url,
        arquivo_nome: data.arquivo.name,
        emitida_em: data.emitida_em || undefined,
      });

      if (modal.tipo === "conta_pagar") {
        const { contasPagarService } = await import("@/features/contas-pagar/contasPagarService");
        await contasPagarService.baixarConta(modal.referencia_id);
      } else {
        await contasReceberService.baixarConta(modal.referencia_id);
      }
      toast.success("Conta baixada com sucesso e nota fiscal anexada!");
      setModal((m) => ({ ...m, open: false }));
      await carregar();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível concluir a operação.");
    }
  }

  async function executeDeletar() {
    if (!confirmDeleteNfId) return;
    try {
      await notasFiscaisService.deletar(confirmDeleteNfId);
      toast.success("Nota fiscal removida.");
      await carregar();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível concluir a operação.");
    } finally {
      setConfirmDeleteNfId(null);
    }
  }

  const linhas: ContaComNotas[] =
    tab === "conta_receber"
      ? contasReceber
          .filter((c) => (!dataInicio || c.data_previsao >= dataInicio) && (!dataFim || c.data_previsao <= dataFim))
          .map((c) => ({
            id: c.id,
            titulo: c.origem,
            dataAlvo: c.data_previsao,
            valor: c.valor,
            liquidado: c.recebido,
            statusLiquidado: "Recebido",
            statusPendente: "Pendente",
          }))
      : contasPagar
          .filter((c) => (!dataInicio || c.data_vencimento >= dataInicio) && (!dataFim || c.data_vencimento <= dataFim))
          .map((c) => ({
            id: c.id,
            titulo: c.descricao,
            dataAlvo: c.data_vencimento,
            valor: c.valor,
            liquidado: c.pago,
            statusLiquidado: "Pago",
            statusPendente: "Em aberto",
          }));

  const totalPages = Math.max(1, Math.ceil(linhas.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = linhas.slice((safePage - 1) * pageSize, safePage * pageSize);
  const totalSemNF = linhas.filter((c) => !notas.some((n) => n.referencia_id === c.id)).length;

  const kpis = [
    { label: "Total de notas", value: notas.length, destaque: true },
    { label: "Contas a receber", value: contasReceber.length },
    { label: "Contas a pagar", value: contasPagar.length },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <header>
            <p className="text-label-sm uppercase tracking-widest text-primary">Gestão Financeira</p>
            <h1 className="text-headline-md text-on-surface tracking-tight mt-0.5">Notas Fiscais</h1>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className={`rounded-3xl p-5 ${kpi.destaque ? "bg-primary/10" : "bg-surface-container"}`}
              >
                <span className={`text-label-sm uppercase tracking-widest ${kpi.destaque ? "text-primary" : "text-on-surface-variant/70"}`}>
                  {kpi.label}
                </span>
                <p className={`text-2xl font-bold mt-2 tabular-nums ${kpi.destaque ? "text-primary" : "text-on-surface"}`}>
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {(["conta_receber", "conta_pagar"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setPage(1); }}
                className={`px-4 py-2 rounded-2xl text-label-sm font-semibold transition cursor-pointer ${
                  tab === t ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant/60 hover:text-on-surface"
                }`}
              >
                {t === "conta_receber" ? "Contas a Receber" : "Contas a Pagar"}
              </button>
            ))}
          </div>

          <div className="bg-surface-container p-4 rounded-2xl flex flex-col sm:flex-row flex-wrap gap-4 items-end border border-outline-variant/30">
            <Field label="Data inicial" className="flex-1 min-w-[120px]">
              <Input type="date" value={dataInicio} onChange={(e) => { setDataInicio(e.target.value); setPage(1); }} />
            </Field>
            <Field label="Data final" className="flex-1 min-w-[120px]">
              <Input type="date" value={dataFim} onChange={(e) => { setDataFim(e.target.value); setPage(1); }} />
            </Field>
            {(dataInicio || dataFim) && (
              <Button variant="ghost" onClick={() => { setDataInicio(""); setDataFim(""); setPage(1); }}>
                <X size={14} /> Limpar
              </Button>
            )}
          </div>

          <NotasContasTable
            titulo={tab === "conta_receber" ? "Contas a Receber" : "Contas a Pagar"}
            contas={paginated}
            notas={notas}
            loading={loading}
            totalSemNF={totalSemNF}
            onAnexar={(c) => setModal({ open: true, tipo: tab, referencia_id: c.id, descricao: c.titulo })}
            onDeletarNota={setConfirmDeleteNfId}
          />

          {!loading && linhas.length > 0 && (
            <UsuariosPagination
              page={safePage}
              totalPages={totalPages}
              total={linhas.length}
              pageSize={pageSize}
              onPage={setPage}
            />
          )}
        </div>
      </main>

      <AnexarNotaModal
        open={modal.open}
        descricao={modal.descricao}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onSubmit={handleAnexar}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteNfId}
        title="Remover nota fiscal?"
        description="Esta ação removerá a nota fiscal do sistema e não poderá ser desfeita."
        onConfirm={executeDeletar}
        onCancel={() => setConfirmDeleteNfId(null)}
        confirmText="Sim, remover"
      />
    </div>
  );
}
