import { CheckCircle } from "lucide-react";

interface EquationFooterProps {
  totalAtivo: string;
  totalPassivo: string;
}

export function EquationFooter({ totalAtivo, totalPassivo }: EquationFooterProps) {
  return (
    <div
      className="rounded-3xl p-4 md:p-5 flex flex-wrap items-center justify-center gap-4 md:gap-8"
      style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#c0c1ff" }}>
          Total do Ativo
        </p>
        <p className="text-base font-bold font-mono" style={{ color: "#e5e2e1" }}>{totalAtivo}</p>
      </div>

      <span className="text-xl font-light" style={{ color: "#6b7280" }}>=</span>

      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#6b7280" }}>
          Total Passivo + PL
        </p>
        <p className="text-base font-bold font-mono" style={{ color: "#e5e2e1" }}>{totalPassivo}</p>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "#4edea318" }}>
        <CheckCircle size={14} style={{ color: "#4edea3" }} />
        <span className="text-xs font-semibold" style={{ color: "#4edea3" }}>Balancete ok</span>
      </div>
    </div>
  );
}
