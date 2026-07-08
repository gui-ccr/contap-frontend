import { TrendingDown, TrendingUp, Filter } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "../dateUtils";
import { formatCurrency } from "@/utils/format";
import type { ContaFinanceira } from "../types";
import type { ContaContabil } from "@/features/plano-contas/planoContasService";
import { Button } from "@/ui/forms";

interface ContasTableProps {
  contas: ContaFinanceira[];
  total?: number;
  loading: boolean;
  planoContas: ContaContabil[];
  tabelaTitulo: string;
  fluxo: "saida" | "entrada";
  statusLiquidado: string;
  statusAtrasado: string;
  onEdit: (c: ContaFinanceira) => void;
  onBaixar: (c: ContaFinanceira) => void;
}

const th = "px-5 py-3 text-left text-label-sm font-semibold text-on-surface-variant/60 uppercase tracking-wider";

export function ContasTable({
  contas, total, loading, planoContas, tabelaTitulo, fluxo,
  statusLiquidado, statusAtrasado, onEdit, onBaixar,
}: ContasTableProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/30">
      <div className="px-5 py-4 flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low">
        <div className="flex items-center gap-2">
          {fluxo === "saida"
            ? <TrendingDown size={15} className="text-error" />
            : <TrendingUp size={15} className="text-primary" />}
          <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">
            {tabelaTitulo}
          </span>
        </div>
        <span className="text-label-sm text-on-surface-variant/50">{total ?? contas.length} registro(s)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20">
              {["Descrição", "Tipo", "Data", "Valor", "Status", ""].map((h) => (
                <th key={h} className={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-body-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center">
                  <div className="flex flex-col items-center gap-3 text-on-surface-variant/60">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Carregando contas...
                  </div>
                </td>
              </tr>
            ) : contas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-on-surface-variant/60">
                    <Filter size={32} className="opacity-40" />
                    <p>Nenhuma conta encontrada com estes filtros</p>
                  </div>
                </td>
              </tr>
            ) : (
              contas.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-on-surface/[0.03] border-b border-outline-variant/10 last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-label-sm font-bold shrink-0 ${
                        fluxo === "saida" ? "bg-error-container/30 text-error" : "bg-primary/10 text-primary"
                      }`}>
                        {c.titulo.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-on-surface">{c.titulo}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant/80">
                    {planoContas.find((pc) => pc.id === c.tipo)?.nome || c.tipo}
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant/70">{formatDate(c.dataAlvo)}</td>
                  <td className="px-5 py-4 font-semibold text-on-surface tabular-nums">{formatCurrency(c.valor)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      liquidado={c.liquidado}
                      dataAlvo={c.dataAlvo}
                      statusLiquidado={statusLiquidado}
                      statusAtrasado={statusAtrasado}
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!c.liquidado ? (
                        <>
                          <Button
                            variant="tonal"
                            onClick={() => onEdit(c)}
                            className="!px-3 !py-1.5 !rounded-lg"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => onBaixar(c)}
                            className="!px-3 !py-1.5 !rounded-lg"
                          >
                            Dar baixa
                          </Button>
                        </>
                      ) : (
                        c.dataLiquidacao && (
                          <span className="text-label-sm text-on-surface-variant/50">
                            {statusLiquidado} em {formatDate(c.dataLiquidacao)}
                          </span>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
