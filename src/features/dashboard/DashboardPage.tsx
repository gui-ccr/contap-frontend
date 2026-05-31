"use client";

import { DashboardHeader } from "./components/DashboardHeader";
import { KpiCards } from "./components/KpiCards";
import { MonthlyChart } from "./components/MonthlyChart";
import { CashFlowTable } from "./components/CashFlowTable";
import { QuickIndicators } from "./components/QuickIndicators";
import { RecentTransactions } from "./components/RecentTransactions";
import { PendingItems } from "./components/PendingItems";
import {
  KPI_DATA, MONTHLY_DATA, CATEGORIES,
  CASHFLOW_ROWS, INDICATORS, RECENT, PENDING_ITEMS,
} from "./data/data";

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <main className="flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8 text-white">
      <DashboardHeader today={today} />
      <KpiCards data={KPI_DATA} />
      <MonthlyChart data={MONTHLY_DATA} categories={CATEGORIES} />
      <CashFlowTable rows={CASHFLOW_ROWS} />

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <QuickIndicators indicators={INDICATORS} />
        <RecentTransactions transactions={RECENT} />
        <PendingItems items={PENDING_ITEMS} />
      </section>
    </main>
  );
}
