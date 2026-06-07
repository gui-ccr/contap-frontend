import { SectionHeader } from "./SectionHeader";
import { LineItem } from "./LineItem";
import { SubtotalRow } from "./SubtotalRow";

interface Item { label: string; valor: string; }

interface PassivoSectionProps {
  circulante: Item[];
  naoCirculante: Item[];
  patrimonioLiquido: Item[];
  totalCirculante: string;
  totalNaoCirculante: string;
  totalPatrimonio: string;
  totalPassivo: string;
}

export function PassivoSection({
  circulante, naoCirculante, patrimonioLiquido,
  totalCirculante, totalNaoCirculante, totalPatrimonio, totalPassivo,
}: PassivoSectionProps) {
  return (
    <div className="rounded-3xl p-6 flex flex-col" style={{ background: "#1e1e1e" }}>
      <div
        className="flex items-center gap-3 mb-6 pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "#ffb3b018" }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: "#ffb3b0" }}>trending_down</span>
        </div>
        <h2 className="text-lg font-bold tracking-tight" style={{ color: "#e5e2e1" }}>
          Passivo e Patrimônio Líquido
        </h2>
      </div>

      <div className="mb-6">
        <SectionHeader label="Passivo Circulante" color="#ffb3b0" />
        {circulante.map((i) => <LineItem key={i.label} {...i} />)}
        <SubtotalRow label="Total Passivo Circulante" valor={totalCirculante} color="#ffb3b0" />
      </div>

      <div className="mb-6">
        <SectionHeader label="Passivo Não Circulante" color="#ffb3b0" />
        {naoCirculante.map((i) => <LineItem key={i.label} {...i} />)}
        <SubtotalRow label="Total Passivo Não Circ." valor={totalNaoCirculante} color="#ffb3b0" />
      </div>

      <div className="mb-6">
        <SectionHeader label="Patrimônio Líquido" color="#4edea3" />
        {patrimonioLiquido.map((i) => <LineItem key={i.label} {...i} />)}
        <SubtotalRow label="Total Patrimônio Líquido" valor={totalPatrimonio} color="#4edea3" />
      </div>

      <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="flex justify-between items-center py-3.5 px-4 rounded-2xl"
          style={{ background: "#4edea312", border: "1px solid #4edea320" }}
        >
          <span className="text-base font-bold" style={{ color: "#e5e2e1" }}>Total Passivo + PL</span>
          <span className="text-base font-bold font-mono" style={{ color: "#4edea3" }}>{totalPassivo}</span>
        </div>
      </div>
    </div>
  );
}
