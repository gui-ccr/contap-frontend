import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface ContasKpisProps {
  totalPendente: number;
  totalAtrasado: number;
  totalLiquidado: number;
  statusLiquidado: string;
  statusAtrasado: string;
}

export function ContasKpis({ totalPendente, totalAtrasado, totalLiquidado, statusLiquidado, statusAtrasado }: ContasKpisProps) {
  const cards = [
    { label: "Total pendente", value: totalPendente, tone: "text-amber-400 bg-amber-500/10", icon: <Clock size={18} /> },
    { label: `Total ${statusAtrasado.toLowerCase()}`, value: totalAtrasado, tone: "text-error bg-error-container/30", icon: <AlertTriangle size={18} /> },
    { label: `Total ${statusLiquidado.toLowerCase()}`, value: totalLiquidado, tone: "text-primary bg-primary/10", icon: <CheckCircle size={18} /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const [textTone, bgTone] = card.tone.split(" ");
        return (
          <div key={card.label} className={`rounded-2xl p-5 flex items-center justify-between ${bgTone}`}>
            <div>
              <p className={`text-label-sm uppercase tracking-widest mb-1 ${textTone}`}>{card.label}</p>
              <p className={`text-xl font-bold ${textTone} tabular-nums`}>{formatCurrency(card.value)}</p>
            </div>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${textTone} ${bgTone}`}>
              {card.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
}
