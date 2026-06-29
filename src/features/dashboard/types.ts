import type { LucideIcon } from "lucide-react";

export interface KpiItem {
  id: number;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  detail: string;
}

export interface MonthlyItem {
  mes: string;
  receita: number;
  despesa: number;
}

export interface CategoryItem {
  label: string;
  value: string;
  pct: number;
  color: string;
}

export interface CashFlowRow {
  id: number;
  descricao: string;
  tipo: "entrada" | "saida";
  data: string;
  valor: string;
  status: string;
}

export interface IndicatorItem {
  id: number;
  label: string;
  value: string;
  meta: string;
  icon: LucideIcon;
  ok: boolean;
}

export interface RecentItem {
  id: number;
  nome: string;
  categoria: string;
  data: string;
  valor: string;
  entrada: boolean;
  avatar: string;
}

export interface PendingItem {
  id: number;
  titulo: string;
  detalhe: string;
  urgente: boolean;
  icon: LucideIcon;
}
