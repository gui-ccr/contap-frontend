import type { RecentItem } from "../types";
import { Button } from "@/ui/forms";

interface RecentTransactionsProps {
  transactions: RecentItem[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-3xl p-5 bg-surface-container-low">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Movimentações Recentes</h2>
          <p className="text-xs text-gray-500 mt-0.5">Últimos lançamentos</p>
        </div>
        <Button variant="ghost" className="!text-xs !text-primary !px-2 !py-1 hover:!bg-primary/10">
          Ver todas →
        </Button>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.04]">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 py-3 hover:bg-white/[0.02] -mx-2 px-2 rounded-2xl transition-colors"
          >
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{
                background: tx.entrada ? "#10b98120" : "#f4375420",
                color:      tx.entrada ? "#10b981"   : "#f43754",
              }}
            >
              {tx.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{tx.nome}</p>
              <p className="text-[10px] text-gray-600">{tx.categoria} · {tx.data}</p>
            </div>
            <span
              className="text-xs font-bold shrink-0"
              style={{ color: tx.entrada ? "#10b981" : "#f43754" }}
            >
              {tx.valor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
