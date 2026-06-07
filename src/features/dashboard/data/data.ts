import { TrendingUp, TrendingDown, Wallet, BarChart3, AlertCircle, Clock, CheckCircle, Target, Zap, ShieldCheck } from "lucide-react";
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

export const KPI_DATA: KpiItem[] = [
  { id: 1, label: "Saldo Consolidado", value: "R$ 248.320,00", change: "+12,5%", positive: true,  icon: Wallet,      detail: "vs. mês anterior" },
  { id: 2, label: "Receita do Mês",    value: "R$ 124.500,00", change: "+8,2%",  positive: true,  icon: TrendingUp,  detail: "maio 2025"        },
  { id: 3, label: "Despesas Totais",   value: "R$ 45.200,00",  change: "+3,1%",  positive: false, icon: TrendingDown, detail: "maio 2025"       },
  { id: 4, label: "Lucro Líquido",     value: "R$ 79.300,00",  change: "+15,4%", positive: true,  icon: BarChart3,   detail: "margem: 63,7%"   },
];

export const MONTHLY_DATA: MonthlyItem[] = [
  { mes: "Jan", receita: 95000,  despesa: 38000 },
  { mes: "Fev", receita: 82000,  despesa: 41000 },
  { mes: "Mar", receita: 110000, despesa: 43500 },
  { mes: "Abr", receita: 104000, despesa: 39000 },
  { mes: "Mai", receita: 124500, despesa: 45200 },
  { mes: "Jun", receita: 98000,  despesa: 36000 },
  { mes: "Jul", receita: 117000, despesa: 42000 },
  { mes: "Ago", receita: 131000, despesa: 47000 },
  { mes: "Set", receita: 108000, despesa: 40000 },
  { mes: "Out", receita: 125000, despesa: 44500 },
  { mes: "Nov", receita: 140000, despesa: 48000 },
  { mes: "Dez", receita: 158000, despesa: 51000 },
];

export const CATEGORIES: CategoryItem[] = [
  { label: "Serviços Prestados", value: "R$ 58.400,00", pct: 47, color: "#10b981" },
  { label: "Produtos Vendidos",  value: "R$ 37.200,00", pct: 30, color: "#34d399" },
  { label: "Assinaturas",        value: "R$ 18.700,00", pct: 15, color: "#6ee7b7" },
  { label: "Outros",             value: "R$ 10.200,00", pct: 8,  color: "#a7f3d0" },
];

export const CASHFLOW_ROWS: CashFlowRow[] = [
  { id: 1, descricao: "Receita de Serviços",    tipo: "entrada", data: "28/05", valor: "+R$ 18.400,00", status: "Confirmado" },
  { id: 2, descricao: "Folha de Pagamento",     tipo: "saida",   data: "27/05", valor: "-R$ 12.300,00", status: "Confirmado" },
  { id: 3, descricao: "Aluguel Escritório",     tipo: "saida",   data: "25/05", valor: "-R$  5.500,00", status: "Confirmado" },
  { id: 4, descricao: "Venda de Licenças",      tipo: "entrada", data: "23/05", valor: "+R$  9.800,00", status: "Confirmado" },
  { id: 5, descricao: "Conta de Energia",       tipo: "saida",   data: "22/05", valor: "-R$    980,00", status: "Pendente"   },
  { id: 6, descricao: "Consultoria Financeira", tipo: "entrada", data: "20/05", valor: "+R$  4.200,00", status: "Pendente"   },
];

export const INDICATORS: IndicatorItem[] = [
  { id: 1, label: "Margem de Lucro",   value: "63,7%", meta: "Meta: 60%",     icon: Target,     ok: true },
  { id: 2, label: "Liquidez Corrente", value: "2,4x",  meta: "Ideal: > 1,5x", icon: Zap,        ok: true },
  { id: 3, label: "Inadimplência",     value: "1,2%",  meta: "Meta: < 3%",    icon: ShieldCheck, ok: true },
];

export const RECENT: RecentItem[] = [
  { id: 1, nome: "Salário Equipe",    categoria: "RH",         data: "28 Mai", valor: "-R$ 12.300,00", entrada: false, avatar: "SE" },
  { id: 2, nome: "Cliente Alfa",      categoria: "Receita",    data: "27 Mai", valor: "+R$  8.500,00", entrada: true,  avatar: "CA" },
  { id: 3, nome: "AWS Cloud",         categoria: "Tecnologia", data: "26 Mai", valor: "-R$  1.240,00", entrada: false, avatar: "AW" },
  { id: 4, nome: "Venda Licença Pro", categoria: "Software",   data: "25 Mai", valor: "+R$  4.200,00", entrada: true,  avatar: "VL" },
  { id: 5, nome: "Conta de Energia",  categoria: "Despesas",   data: "24 Mai", valor: "-R$    980,00", entrada: false, avatar: "CE" },
];

export const PENDING_ITEMS: PendingItem[] = [
  { id: 1, titulo: "NF-e aguardando aprovação", detalhe: "3 notas fiscais pendentes", urgente: true,  icon: AlertCircle },
  { id: 2, titulo: "Conciliação bancária",       detalhe: "Vence em 2 dias",           urgente: false, icon: Clock       },
  { id: 3, titulo: "Relatório DRE — Abril",      detalhe: "Pronto para revisão",       urgente: false, icon: CheckCircle },
];
