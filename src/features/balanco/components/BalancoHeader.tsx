import { Download } from "lucide-react";

interface BalancoHeaderProps {
  today: string;
}

export function BalancoHeader({ today }: BalancoHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: "#e5e2e1" }}>
          Balanço Patrimonial
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
          Posição financeira em {today}
        </p>
      </div>
      <button
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all hover:bg-white/5 self-start md:self-auto"
        style={{ background: "#1e1e1e", color: "#e5e2e1", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Download size={15} />
        Exportar PDF
      </button>
    </div>
  );
}
