import { CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";
import { formatDate, getDiffDays } from "../dateUtils";

interface StatusBadgeProps {
  liquidado: boolean;
  dataAlvo: string;
  statusLiquidado: string;
  statusAtrasado: string;
}

const badgeBase = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-semibold";

export function StatusBadge({ liquidado, dataAlvo, statusLiquidado, statusAtrasado }: StatusBadgeProps) {
  if (liquidado) {
    return (
      <span className={`${badgeBase} bg-primary/10 text-primary`}>
        <CheckCircle size={11} /> {statusLiquidado}
      </span>
    );
  }
  const diff = getDiffDays(dataAlvo);
  if (diff < 0) {
    return (
      <span className={`${badgeBase} bg-error-container/30 text-error`}>
        <AlertTriangle size={11} /> {statusAtrasado} ({Math.abs(diff)}d)
      </span>
    );
  }
  if (diff <= 3) {
    return (
      <span className={`${badgeBase} bg-amber-500/10 text-amber-400`}>
        <Clock size={11} /> Vence em {diff}d
      </span>
    );
  }
  return (
    <span className={`${badgeBase} bg-tertiary/10 text-tertiary`}>
      <Calendar size={11} /> {formatDate(dataAlvo)}
    </span>
  );
}
