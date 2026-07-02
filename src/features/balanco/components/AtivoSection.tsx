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

export function AtivoSection({
  circulante, naoCirculante,
  totalCirculante, totalNaoCirculante, totalAtivo,
}: AtivoSectionProps) {
  return (
    <div className="rounded-[32px] p-7 flex flex-col shadow-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-indigo-500/10" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.03)" }}>
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none transition-all group-hover:bg-indigo-500/10" />

      <div
        className="flex items-center gap-4 mb-8 pb-6 relative z-10"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: "rgba(192, 193, 255, 0.08)", border: "1px solid rgba(192, 193, 255, 0.15)" }}>
          <i className="fi fi-rr-arrow-trend-up text-[24px]" style={{ color: "#c0c1ff" }}></i>
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Ativo</h2>
          <p className="text-xs font-medium mt-0.5" style={{ color: "#6b7280" }}>Bens e direitos da empresa</p>
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <SectionHeader label="Circulante" color="#c0c1ff" />
        <ListContainer items={circulante} />
        <SubtotalRow label="Total Circulante" valor={totalCirculante} color="#c0c1ff" />
      </div>

      <div className="mb-8 relative z-10">
        <SectionHeader label="Não Circulante" color="#c0c1ff" />
        <ListContainer items={naoCirculante} />
        <SubtotalRow label="Total Não Circulante" valor={totalNaoCirculante} color="#c0c1ff" />
      </div>

      <div className="mt-auto pt-6 relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="flex justify-between items-center py-4 px-5 rounded-2xl transition-transform hover:scale-[1.02] shadow-lg"
          style={{ background: "linear-gradient(135deg, rgba(192, 193, 255, 0.15) 0%, rgba(192, 193, 255, 0.05) 100%)", border: "1px solid rgba(192, 193, 255, 0.25)" }}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-white">Total do Ativo</span>
          <span className="text-xl font-black tracking-tight" style={{ color: "#c0c1ff" }}>{totalAtivo}</span>
        </div>
      </div>
    </div>
  );
}
