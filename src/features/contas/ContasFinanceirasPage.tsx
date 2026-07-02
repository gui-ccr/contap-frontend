"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { planoContasService, type ContaContabil } from "@/features/plano-contas/planoContasService";
import { Button, FormAlert } from "@/ui/forms";
import { ContasKpis } from "./components/ContasKpis";
import { ContasFilters, type FiltroStatus } from "./components/ContasFilters";
import { ContasTable } from "./components/ContasTable";
import { ContaFormModal } from "./components/ContaFormModal";
import { getDiffDays, primeiroDiaDoMes, ultimoDiaDoMes } from "./dateUtils";
import type { ContaFinanceira, ContaFinanceiraPayload, ContasConfig } from "./types";

export function ContasFinanceirasPage({ config }: { config: ContasConfig }) {
  const router = useRouter();

  const [contas, setContas] = useState<ContaFinanceira[]>([]);
  const [planoContas, setPlanoContas] = useState<ContaContabil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ContaFinanceira | null>(null);

  const [filter, setFilter] = useState<FiltroStatus>("todos");
  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMes);
  const [dataFim, setDataFim] = useState(ultimoDiaDoMes);
  const [tipoFiltro, setTipoFiltro] = useState("");

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, contasContabeis] = await Promise.all([
        config.listar(),
        planoContasService.listarContas(),
      ]);
      setContas(data);
      setPlanoContas(contasContabeis.filter((c) => config.planoTipos.includes(c.tipo)));
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function handleSubmit(payload: ContaFinanceiraPayload) {
    try {
      if (editing) {
        await config.atualizar(editing.id, payload);
        toast.success("Conta atualizada com sucesso!");
      } else {
        await config.criar(payload);
        toast.success("Conta criada com sucesso!");
      }
      setShowForm(false);
      setEditing(null);
      carregar();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar conta.");
    }
  }

  function handleBaixar(c: ContaFinanceira) {
    const desc = encodeURIComponent(c.titulo);
    router.push(`/notas-fiscais?darBaixaId=${c.id}&tipoBaixa=${config.tipoBaixa}&descBaixa=${desc}` as never);
  }

  const filtradas = contas.filter((c) => {
    if (filter === "pendente" && c.liquidado) return false;
    if (filter === "liquidado" && !c.liquidado) return false;
    if (tipoFiltro && c.tipo !== tipoFiltro) return false;
    if (dataInicio && c.dataAlvo < dataInicio) return false;
    if (dataFim && c.dataAlvo > dataFim) return false;
    return true;
  });

  const totalPendente = filtradas.filter((c) => !c.liquidado).reduce((s, c) => s + c.valor, 0);
  const totalLiquidado = filtradas.filter((c) => c.liquidado).reduce((s, c) => s + c.valor, 0);
  const totalAtrasado = filtradas
    .filter((c) => !c.liquidado && getDiffDays(c.dataAlvo) < 0)
    .reduce((s, c) => s + c.valor, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen text-on-surface">
      <main className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-label-sm uppercase tracking-widest text-primary">{config.eyebrow}</p>
              <h1 className="text-headline-md tracking-tight mt-0.5">{config.titulo}</h1>
            </div>
            <Button onClick={() => { setEditing(null); setShowForm(true); }}>
              <Plus size={16} /> {config.novoLabel}
            </Button>
          </div>

          <ContasKpis
            totalPendente={totalPendente}
            totalAtrasado={totalAtrasado}
            totalLiquidado={totalLiquidado}
            statusLiquidado={config.statusLiquidado}
            statusAtrasado={config.statusAtrasado}
          />

          {error && <FormAlert>{error}</FormAlert>}

          <ContasFilters
            filter={filter}
            onFilter={setFilter}
            dataInicio={dataInicio}
            onDataInicio={setDataInicio}
            dataFim={dataFim}
            onDataFim={setDataFim}
            tipoFiltro={tipoFiltro}
            onTipoFiltro={setTipoFiltro}
            planoContas={planoContas}
            statusLiquidado={config.statusLiquidado}
          />

          <ContasTable
            contas={filtradas}
            loading={loading}
            planoContas={planoContas}
            tabelaTitulo={config.tabelaTitulo}
            fluxo={config.fluxo}
            statusLiquidado={config.statusLiquidado}
            statusAtrasado={config.statusAtrasado}
            onEdit={(c) => { setEditing(c); setShowForm(true); }}
            onBaixar={handleBaixar}
          />
        </div>
      </main>

      <ContaFormModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSubmit={handleSubmit}
        editing={editing}
        planoContas={planoContas}
        eyebrow={config.eyebrow}
        titulo={editing ? `Editar ${config.titulo.toLowerCase()}` : config.novoLabel}
        campoTituloLabel={config.campoTituloLabel}
        campoDataLabel={config.campoDataLabel}
        campoTipoLabel={config.campoTipoLabel}
      />
    </div>
  );
}
