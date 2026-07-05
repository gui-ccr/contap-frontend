import { Bell, RefreshCw, Plus } from "lucide-react";

interface DashboardHeaderProps {
  today: string;
}

export function DashboardHeader({ today }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <p className="text-xs text-gray-500 font-medium capitalize">{today}</p>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">Visão Geral</h1>
      </div>

    </header>
  );
}
