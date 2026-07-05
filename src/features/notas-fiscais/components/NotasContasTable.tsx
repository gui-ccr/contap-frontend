import { FileText, Upload, Trash2, ExternalLink, Paperclip } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { formatDate } from "@/features/contas/dateUtils";
import type { NotaFiscal } from "../notasFiscaisService";

/** Linha unificada: conta a pagar ou a receber com o mesmo formato. */
export interface ContaComNotas {
  id: string;
  titulo: string;
  dataAlvo: string;
  valor: number;
  valor_pago?: number | null;
  liquidado: boolean;
  statusLiquidado: string;
  statusPendente: string;
}

interface NotasContasTableProps {
  titulo: string;
  contas: ContaComNotas[];
  notas: NotaFiscal[];
  loading: boolean;
  totalSemNF: number;
  onAnexar: (conta: ContaComNotas) => void;
  onDeletarNota: (notaId: string) => void;
}

function NfChips({ nfs, onDeletar }: { nfs: NotaFiscal[]; onDeletar: (id: string) => void }) {
  if (nfs.length === 0) return <span className="text-on-surface-variant/40 text-label-sm">Nenhuma</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {nfs.map((nf) => (
        <div key={nf.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-label-sm bg-primary/10 text-primary">
          <Paperclip size={11} />
          <span className="max-w-[100px] truncate" title={nf.arquivo_nome}>
            {nf.numero_nota ? `NF-${nf.numero_nota}` : nf.arquivo_nome}
          </span>
          <a href={nf.arquivo_url} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100" title="Abrir">
            <ExternalLink size={11} />
          </a>
          <button
            onClick={() => onDeletar(nf.id)}
            className="opacity-40 hover:opacity-100 hover:text-error transition cursor-pointer"
            title="Remover"
          >
            <Trash2 size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}

const th = "pb-3 text-label-sm font-medium text-on-surface-variant/60";

export function NotasContasTable({ titulo, contas, notas, loading, totalSemNF, onAnexar, onDeletarNota }: NotasContasTableProps) {
  const notasDe = (id: string) => notas.filter((n) => n.referencia_id === id);

  return (
    <div className="rounded-3xl overflow-hidden bg-surface-container border border-outline-variant/30">
      <div className="px-5 py-4 flex items-center gap-2 border-b border-outline-variant/30 bg-surface-container-low">
        <FileText size={14} className="text-on-surface-variant/60" />
        <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">
          {titulo} — Notas Fiscais
        </span>
        {totalSemNF > 0 && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-label-sm font-semibold bg-amber-500/10 text-amber-400">
            {totalSemNF} sem NF
          </span>
        )}
      </div>

      <div className="p-5 overflow-x-auto">
        {loading ? (
          <p className="text-center text-on-surface-variant/60 py-8">Carregando...</p>
        ) : contas.length === 0 ? (
          <p className="text-center text-on-surface-variant/60 py-8">
            Nenhuma conta encontrada com estes filtros.
          </p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className={th}>Descrição</th>
                <th className={th}>Data</th>
                <th className={`${th} text-right`}>Valor</th>
                <th className={`${th} text-center`}>Status</th>
                <th className={th}>Notas Fiscais</th>
                <th className={`${th} text-right`}>Ação</th>
              </tr>
            </thead>
            <tbody className="text-body-sm">
              {contas.map((c) => (
                <tr key={c.id} className="border-t border-outline-variant/20">
                  <td className="py-4 text-on-surface">{c.titulo}</td>
                  <td className="py-4 text-on-surface-variant/80">{formatDate(c.dataAlvo)}</td>
                  <td className="py-4 text-right text-on-surface font-medium tabular-nums">
                    {c.liquidado && c.valor_pago && c.valor_pago !== c.valor ? (
                      <div className="flex flex-col items-end">
                        <span className="text-on-surface-variant/50 line-through text-[0.7rem] leading-none mb-0.5">{formatCurrency(c.valor)}</span>
                        <span>{formatCurrency(c.valor_pago)}</span>
                      </div>
                    ) : (
                      formatCurrency(c.valor)
                    )}
                  </td>
                  <td className="py-4 text-center">
                    {c.liquidado ? (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-label-sm font-medium">{c.statusLiquidado}</span>
                    ) : c.statusPendente === "Vencido" ? (
                      <span className="px-2 py-1 bg-error/10 text-error rounded text-label-sm font-medium">{c.statusPendente}</span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-label-sm font-medium">{c.statusPendente}</span>
                    )}
                  </td>
                  <td className="py-4"><NfChips nfs={notasDe(c.id)} onDeletar={onDeletarNota} /></td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => onAnexar(c)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-label-sm font-semibold transition hover:bg-primary/20 ml-auto bg-primary/10 text-primary border border-primary/20 cursor-pointer"
                    >
                      <Upload size={12} /> Anexar NF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
