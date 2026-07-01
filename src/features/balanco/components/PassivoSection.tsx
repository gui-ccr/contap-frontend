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

function ListContainer({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="py-5 px-4 text-xs italic text-center rounded-2xl mb-2" style={{ color: "#6b7280", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.05)" }}>
        Nenhuma conta com saldo nesta categoria.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1 p-2 rounded-2xl mb-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
      {items.map((i) => <LineItem key={i.label} {...i} />)}
    </div>
  );
}

export function PassivoSection({
  circulante, naoCirculante, patrimonioLiquido,
  totalCirculante, totalNaoCirculante, totalPatrimonio, totalPassivo,
}: PassivoSectionProps) {
  return (
    <div className="rounded-[32px] p-7 flex flex-col shadow-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-red-500/10" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.03)" }}>
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none transition-all group-hover:bg-red-500/10" />

      <div
        className="flex items-center gap-4 mb-8 pb-6 relative z-10"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: "rgba(255, 179, 176, 0.08)", border: "1px solid rgba(255, 179, 176, 0.15)" }}>
          <span className="material-symbols-outlined text-[24px]" style={{ color: "#ffb3b0" }}>trending_down</span>
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Passivo e P.L.</h2>
          <p className="text-xs font-medium mt-0.5" style={{ color: "#6b7280" }}>Obrigações e capital da empresa</p>
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <SectionHeader label="Passivo Circulante" color="#ffb3b0" />
        <ListContainer items={circulante} />
        <SubtotalRow label="Total Passivo Circulante" valor={totalCirculante} color="#ffb3b0" />
      </div>

      <div className="mb-8 relative z-10">
        <SectionHeader label="Passivo Não Circulante" color="#ffb3b0" />
        <ListContainer items={naoCirculante} />
        <SubtotalRow label="Total Passivo Não Circ." valor={totalNaoCirculante} color="#ffb3b0" />
      </div>

      <div className="mb-8 relative z-10">
        <SectionHeader label="Patrimônio Líquido" color="#4edea3" />
        <ListContainer items={patrimonioLiquido} />
        <SubtotalRow label="Total Patrimônio Líquido" valor={totalPatrimonio} color="#4edea3" />
      </div>

      <div className="mt-auto pt-6 relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="flex justify-between items-center py-4 px-5 rounded-2xl transition-transform hover:scale-[1.02] shadow-lg"
          style={{ background: "linear-gradient(135deg, rgba(255, 179, 176, 0.15) 0%, rgba(255, 179, 176, 0.05) 100%)", border: "1px solid rgba(255, 179, 176, 0.25)" }}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-white">Total Passivo + PL</span>
          <span className="text-xl font-black tracking-tight" style={{ color: "#ffb3b0" }}>{totalPassivo}</span>
        </div>
      </div>
    </div>
  );
}
