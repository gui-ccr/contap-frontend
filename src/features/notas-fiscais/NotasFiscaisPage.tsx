"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { ConfirmModal } from "@/ui/modals/ConfirmModal";
import { Field, Input, Button, Select } from "@/ui/forms";
import { contasReceberService, ContaReceberBackend } from "@/features/contas-receber/contasReceberService";
import { notasFiscaisService, NotaFiscal } from "./notasFiscaisService";
import { apiClient, getEmpresaIdFromToken } from "@/shared/api";
import { primeiroDiaDoMes, ultimoDiaDoMes } from "@/features/contas/dateUtils";
import { UsuariosPagination } from "@/features/usuarios/components/UsuariosPagination";
import { AnexarNotaModal, type AnexarNotaFormData } from "./components/AnexarNotaModal";
import { NotasContasTable, type ContaComNotas } from "./components/NotasContasTable";
import { DatePicker } from "@/ui/aria/application/date-picker/date-picker";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

interface ContaPagar {
  id: string;
  empresa_id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  pago: boolean;
  data_pagamento: string | null;
  valor_pago: number | null;
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
  liquidado: boolean;
  valorOriginal: number;
  statusPendente: string;
}

export default function NotasFiscaisPage() {
  const [tab, setTab] = useState<Tab>("conta_receber");
  const [contasReceber, setContasReceber] = useState<ContaReceberBackend[]>([]);
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>([]);
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<ModalState>({ open: false, tipo: "conta_receber", referencia_id: "", descricao: "", liquidado: false, valorOriginal: 0, statusPendente: "Pendente" });
  const [confirmDeleteNfId, setConfirmDeleteNfId] = useState<string | null>(null);

  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMes);
  const [dataFim, setDataFim] = useState(ultimoDiaDoMes);
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const aplicarFiltro = (tipo: string) => {
    const hoje = new Date();
    if (tipo === "este_mes") {
      setDataInicio(new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split("T")[0]);
      setDataFim(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split("T")[0]);
    } else if (tipo === "mes_passado") {
      setDataInicio(new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1).toISOString().split("T")[0]);
      setDataFim(new Date(hoje.getFullYear(), hoje.getMonth(), 0).toISOString().split("T")[0]);
    } else if (tipo === "ultimos_30") {
      const start = new Date();
      start.setDate(start.getDate() - 30);
      setDataInicio(start.toISOString().split("T")[0]);
      setDataFim(hoje.toISOString().split("T")[0]);
    } else if (tipo === "hoje") {
      setDataInicio(hoje.toISOString().split("T")[0]);
      setDataFim(hoje.toISOString().split("T")[0]);
    } else if (tipo === "limpar") {
      setDataInicio("");
      setDataFim("");
      setValorMinimo("");
      setValorMaximo("");
    }
    setPage(1);
  };

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
        setModal({ open: true, tipo: tipoBaixa, referencia_id: darBaixaId, descricao: descBaixa, liquidado: false, valorOriginal: 0, statusPendente: "Vencido" });
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

      if (!modal.liquidado) {
        if (modal.tipo === "conta_pagar") {
          const { contasPagarService } = await import("@/features/contas-pagar/contasPagarService");
          await contasPagarService.baixarConta(modal.referencia_id, data.novo_valor);
        } else {
          await contasReceberService.baixarConta(modal.referencia_id, data.novo_valor);
        }
        toast.success("Conta baixada com sucesso e nota fiscal anexada!");
      } else {
        toast.success("Nota fiscal anexada com sucesso!");
      }

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
            valor_pago: c.valor_pago,
            liquidado: c.recebido,
            statusLiquidado: "Recebido",
            statusPendente: new Date(c.data_previsao) < new Date(new Date().setHours(0,0,0,0)) ? "Vencido" : "Pendente",
          }))
      : contasPagar
          .filter((c) => (!dataInicio || c.data_vencimento >= dataInicio) && (!dataFim || c.data_vencimento <= dataFim))
          .map((c) => ({
            id: c.id,
            titulo: c.descricao,
            dataAlvo: c.data_vencimento,
            valor: c.valor,
            valor_pago: c.valor_pago,
            liquidado: c.pago,
            statusLiquidado: "Pago",
            statusPendente: new Date(c.data_vencimento) < new Date(new Date().setHours(0,0,0,0)) ? "Vencido" : "Em aberto",
          }));

  const linhasFiltradas = linhas.filter(c => {
    if (filtroStatus === "com_nf") return notas.some(n => n.referencia_id === c.id);
    if (filtroStatus === "sem_nf") return !notas.some(n => n.referencia_id === c.id);
    if (filtroStatus === "vencidas") return c.statusPendente === "Vencido" && !c.liquidado;
    if (filtroStatus === "pendentes") return !c.liquidado;
    if (filtroStatus === "liquidadas") return c.liquidado;
    return true;
  }).filter(c => {
    if (valorMinimo && c.valor < Number(valorMinimo)) return false;
    if (valorMaximo && c.valor > Number(valorMaximo)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(linhasFiltradas.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = linhasFiltradas.slice((safePage - 1) * pageSize, safePage * pageSize);
  const totalSemNF = linhas.filter((c) => !notas.some((n) => n.referencia_id === c.id)).length;

  const kpis = [
    { label: "Resultados da Pesquisa", value: linhasFiltradas.length, destaque: true },
    { label: tab === "conta_receber" ? "Total Histórico (A Receber)" : "Total Histórico (A Pagar)", value: tab === "conta_receber" ? contasReceber.length : contasPagar.length },
    { label: "Total de NF Anexadas", value: notas.length },
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

          <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/30 space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-label-sm uppercase tracking-widest text-on-surface-variant/70 mr-2">Filtros Rápidos:</span>
              <button onClick={() => aplicarFiltro("hoje")} className="px-3 py-1.5 rounded-lg text-body-sm bg-surface-container-high hover:bg-surface-container-highest transition cursor-pointer">Hoje</button>
              <button onClick={() => aplicarFiltro("este_mes")} className="px-3 py-1.5 rounded-lg text-body-sm bg-surface-container-high hover:bg-surface-container-highest transition cursor-pointer">Este Mês</button>
              <button onClick={() => aplicarFiltro("mes_passado")} className="px-3 py-1.5 rounded-lg text-body-sm bg-surface-container-high hover:bg-surface-container-highest transition cursor-pointer">Mês Passado</button>
              <button onClick={() => aplicarFiltro("ultimos_30")} className="px-3 py-1.5 rounded-lg text-body-sm bg-surface-container-high hover:bg-surface-container-highest transition cursor-pointer">Últimos 30 Dias</button>
              <button onClick={() => aplicarFiltro("limpar")} className="px-3 py-1.5 rounded-lg text-body-sm text-primary hover:bg-primary/10 transition cursor-pointer font-medium ml-auto">Todas</button>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end pt-2 border-t border-outline-variant/30">
              <Field label="Data inicial" className="flex-1 min-w-[120px]">
              <DatePicker
                value={dataInicio ? parseDate(dataInicio) : null}
                onChange={(v: DateValue | null) => { setDataInicio(v ? v.toString() : ""); setPage(1); }}
              />
            </Field>
            <Field label="Data final" className="flex-1 min-w-[120px]">
              <DatePicker
                value={dataFim ? parseDate(dataFim) : null}
                onChange={(v: DateValue | null) => { setDataFim(v ? v.toString() : ""); setPage(1); }}
              />
            </Field>
            <Field label="Status / Tipo" className="flex-1 min-w-[150px]">
              <Select value={filtroStatus} onChange={(e) => { setFiltroStatus(e.target.value); setPage(1); }}>
                <option value="todas">Todas as Contas</option>
                <option value="sem_nf">Sem Nota Fiscal</option>
                <option value="com_nf">Com Nota Fiscal</option>
                <option value="pendentes">Em Aberto / Pendentes</option>
                <option value="vencidas">Vencidas</option>
                <option value="liquidadas">Pagas / Recebidas</option>
              </Select>
            </Field>
            <Field label="Valor Min." className="flex-1 min-w-[90px]">
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={valorMinimo}
                onChange={(e) => { setValorMinimo(e.target.value); setPage(1); }}
              />
            </Field>
            <Field label="Valor Max." className="flex-1 min-w-[90px]">
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={valorMaximo}
                onChange={(e) => { setValorMaximo(e.target.value); setPage(1); }}
              />
            </Field>
              {(dataInicio || dataFim || filtroStatus !== "todas" || valorMinimo || valorMaximo) && (
                <Button variant="ghost" onClick={() => { aplicarFiltro("limpar"); setFiltroStatus("todas"); }}>
                  <X size={14} /> Limpar Filtros
                </Button>
              )}
            </div>
          </div>

          <NotasContasTable
            titulo={tab === "conta_receber" ? "Contas a Receber" : "Contas a Pagar"}
            contas={paginated}
            notas={notas}
            loading={loading}
            totalSemNF={totalSemNF}
            onAnexar={(c) => setModal({ open: true, tipo: tab, referencia_id: c.id, descricao: c.titulo, liquidado: c.liquidado, valorOriginal: c.valor, statusPendente: c.statusPendente })}
            onDeletarNota={setConfirmDeleteNfId}
          />

          {!loading && linhasFiltradas.length > 0 && (
            <UsuariosPagination
              page={safePage}
              totalPages={totalPages}
              total={linhasFiltradas.length}
              pageSize={pageSize}
              onPage={setPage}
            />
          )}
        </div>
      </main>

      <AnexarNotaModal
        open={modal.open}
        descricao={modal.descricao}
        liquidado={modal.liquidado}
        valorOriginal={modal.valorOriginal}
        statusPendente={modal.statusPendente}
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
