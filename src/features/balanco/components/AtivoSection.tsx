import { SectionHeader } from "./SectionHeader";
import { LineItem } from "./LineItem";
import { SubtotalRow } from "./SubtotalRow";

interface Item { label: string; valor: string; }

interface AtivoSectionProps {
  circulante: Item[];
  naoCirculante: Item[];
  totalCirculante: string;
  totalNaoCirculante: string;
  totalAtivo: string;
}

export function AtivoSection({
  circulante, naoCirculante,
  totalCirculante, totalNaoCirculante, totalAtivo,
}: AtivoSectionProps) {
  return (
    <div className="rounded-3xl p-6 flex flex-col" style={{ background: "#1e1e1e" }}>
      <div
        className="flex items-center gap-3 mb-6 pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "#c0c1ff18" }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: "#c0c1ff" }}>trending_up</span>
        </div>
        <h2 className="text-lg font-bold tracking-tight" style={{ color: "#e5e2e1" }}>Ativo</h2>
      </div>

      <div className="mb-6">
        <SectionHeader label="Circulante" color="#c0c1ff" />
        {circulante.map((i) => <LineItem key={i.label} {...i} />)}
        <SubtotalRow label="Total Circulante" valor={totalCirculante} color="#c0c1ff" />
      </div>

      <div className="mb-6">
        <SectionHeader label="Não Circulante" color="#c0c1ff" />
        {naoCirculante.map((i) => <LineItem key={i.label} {...i} />)}
        <SubtotalRow label="Total Não Circulante" valor={totalNaoCirculante} color="#c0c1ff" />
      </div>

      <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="flex justify-between items-center py-3.5 px-4 rounded-2xl"
          style={{ background: "#c0c1ff12", border: "1px solid #c0c1ff20" }}
        >
          <span className="text-base font-bold" style={{ color: "#e5e2e1" }}>Total do Ativo</span>
          <span className="text-base font-bold font-mono" style={{ color: "#c0c1ff" }}>{totalAtivo}</span>
        </div>
      </div>
    </div>
  );
}
