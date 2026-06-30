import type { PendingItem } from "../types";

interface PendingItemsProps {
  items: PendingItem[];
}

export function PendingItems({ items }: PendingItemsProps) {
  const urgentCount = items.filter((i) => i.urgente).length;

  return (
    <div className="rounded-3xl p-5" style={{ background: "#1e1e1e" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">Pendências Operacionais</h2>
        {urgentCount > 0 && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#f4375420", color: "#f43754" }}
          >
            {urgentCount} urgente{urgentCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {items.map(({ id, titulo, detalhe, urgente, icon: Icon }) => (
          <div
            key={id}
            className="flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer hover:scale-[1.01]"
            style={{ background: urgente ? "#f4375410" : "#242424" }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: urgente ? "#f4375420" : "#10b98118" }}
            >
              <Icon size={14} color={urgente ? "#f43754" : "#10b981"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{titulo}</p>
              <p className="text-[10px] text-gray-500">{detalhe}</p>
            </div>
            {urgente && (
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: "#f4375430", color: "#f43754" }}
              >
                URGENTE
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
