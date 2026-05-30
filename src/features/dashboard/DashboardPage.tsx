"use client";

import {
  TrendingUp, TrendingDown,
  AlertCircle, Wallet,
  BarChart3, ArrowUpRight, ArrowDownRight, Bell, Plus,
  RefreshCw, Target, Zap, ShieldCheck, Clock, CheckCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const KPI_DATA = [
  { id: 1, label: "Saldo Consolidado", value: "R$ 248.320,00", change: "+12,5%", positive: true,  icon: Wallet,    detail: "vs. mês anterior" },
  { id: 2, label: "Receita do Mês",    value: "R$ 124.500,00", change: "+8,2%",  positive: true,  icon: TrendingUp, detail: "maio 2025"        },
  { id: 3, label: "Despesas Totais",   value: "R$ 45.200,00",  change: "+3,1%",  positive: false, icon: TrendingDown, detail: "maio 2025"      },
  { id: 4, label: "Lucro Líquido",     value: "R$ 79.300,00",  change: "+15,4%", positive: true,  icon: BarChart3,  detail: "margem: 63,7%"   },
];

const MONTHLY_DATA = [
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

const CATEGORIES = [
  { label: "Serviços Prestados", value: "R$ 58.400,00", pct: 47, color: "#10b981" },
  { label: "Produtos Vendidos",  value: "R$ 37.200,00", pct: 30, color: "#34d399" },
  { label: "Assinaturas",        value: "R$ 18.700,00", pct: 15, color: "#6ee7b7" },
  { label: "Outros",             value: "R$ 10.200,00", pct: 8,  color: "#a7f3d0" },
];

const CASHFLOW_ROWS = [
  { id: 1, descricao: "Receita de Serviços",    tipo: "entrada", data: "28/05", valor: "+R$ 18.400,00", status: "Confirmado" },
  { id: 2, descricao: "Folha de Pagamento",     tipo: "saida",   data: "27/05", valor: "-R$ 12.300,00", status: "Confirmado" },
  { id: 3, descricao: "Aluguel Escritório",     tipo: "saida",   data: "25/05", valor: "-R$  5.500,00", status: "Confirmado" },
  { id: 4, descricao: "Venda de Licenças",      tipo: "entrada", data: "23/05", valor: "+R$  9.800,00", status: "Confirmado" },
  { id: 5, descricao: "Conta de Energia",       tipo: "saida",   data: "22/05", valor: "-R$    980,00", status: "Pendente"   },
  { id: 6, descricao: "Consultoria Financeira", tipo: "entrada", data: "20/05", valor: "+R$  4.200,00", status: "Pendente"   },
];

const INDICATORS = [
  { id: 1, label: "Margem de Lucro",    value: "63,7%", meta: "Meta: 60%",     icon: Target,     ok: true },
  { id: 2, label: "Liquidez Corrente",  value: "2,4x",  meta: "Ideal: > 1,5x", icon: Zap,        ok: true },
  { id: 3, label: "Inadimplência",      value: "1,2%",  meta: "Meta: < 3%",    icon: ShieldCheck, ok: true },
];

const RECENT = [
  { id: 1, nome: "Salário Equipe",    categoria: "RH",         data: "28 Mai", valor: "-R$ 12.300,00", entrada: false, avatar: "SE" },
  { id: 2, nome: "Cliente Alfa",      categoria: "Receita",    data: "27 Mai", valor: "+R$  8.500,00", entrada: true,  avatar: "CA" },
  { id: 3, nome: "AWS Cloud",         categoria: "Tecnologia", data: "26 Mai", valor: "-R$  1.240,00", entrada: false, avatar: "AW" },
  { id: 4, nome: "Venda Licença Pro", categoria: "Software",   data: "25 Mai", valor: "+R$  4.200,00", entrada: true,  avatar: "VL" },
  { id: 5, nome: "Conta de Energia",  categoria: "Despesas",   data: "24 Mai", valor: "-R$    980,00", entrada: false, avatar: "CE" },
];

const PENDING_ITEMS = [
  { id: 1, titulo: "NF-e aguardando aprovação", detalhe: "3 notas fiscais pendentes", urgente: true,  icon: AlertCircle  },
  { id: 2, titulo: "Conciliação bancária",       detalhe: "Vence em 2 dias",           urgente: false, icon: Clock        },
  { id: 3, titulo: "Relatório DRE — Abril",      detalhe: "Pronto para revisão",       urgente: false, icon: CheckCircle  },
];

// ─────────────────────────────────────────────
// SUB-COMPONENTES INTERNOS
// ─────────────────────────────────────────────

/** Tooltip customizado do gráfico */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-3 shadow-2xl text-sm"
      style={{ background: "#1a1a1a", backdropFilter: "blur(12px)" }}>
      <p className="text-gray-400 font-medium mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-400 text-xs">{p.name === "receita" ? "Receita" : "Despesa"}:</span>
          <span className="text-white font-semibold text-xs">
            {p.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Badge de status da tabela */
function StatusBadge({ status }: { status: string }) {
  const ok = status === "Confirmado";
  return (
    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: ok ? "#10b98118" : "#f59e0b18", color: ok ? "#10b981" : "#f59e0b" }}>
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <main className="flex-1 overflow-auto px-6 py-8 text-white">

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs text-gray-500 font-medium capitalize">{today}</p>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">Visão Geral</h1>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Sino de notificações */}
            <button className="relative w-9 h-9 rounded-2xl flex items-center justify-center   transition-all"
              style={{ background: "#1e1e1e" }}>
              <Bell size={15} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
                style={{ background: "#10b981", borderColor: "#1e1e1e" }} />
            </button>
            {/* Conferir dados */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium  text-gray-300 hover:text-white  transition-all"
              style={{ background: "#1e1e1e" }}>
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Conferir dados</span>
            </button>
            {/* CTA principal */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold text-white hover:opacity-90 transition-all shadow-lg"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
              <Plus size={15} strokeWidth={2.5} />
              <span>Novo lançamento</span>
            </button>
          </div>
        </header>

        {/* SEÇÃO 1 — KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {KPI_DATA.map(({ id, label, value, change, positive, icon: Icon, detail }) => (
            <div key={id}
              className="relative rounded-3xl p-5  overflow-hidden group  transition-all duration-300"
              style={{ background: "#1e1e1e" }}>
              {/* Glow de hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: positive
                  ? "radial-gradient(ellipse at top left,#10b98112 0%,transparent 70%)"
                  : "radial-gradient(ellipse at top left,#f4375412 0%,transparent 70%)" }} />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</span>
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                  style={{ background: positive ? "#10b98120" : "#f4375420" }}>
                  <Icon size={16} color={positive ? "#10b981" : "#f43754"} />
                </div>
              </div>
              <p className="text-xl font-bold text-white tracking-tight mb-2">{value}</p>
              <div className="flex items-center gap-1.5">
                {positive
                  ? <ArrowUpRight size={13} color="#10b981" />
                  : <ArrowDownRight size={13} color="#f43754" />}
                <span className="text-xs font-semibold" style={{ color: positive ? "#10b981" : "#f43754" }}>{change}</span>
                <span className="text-xs text-gray-600">{detail}</span>
              </div>
            </div>
          ))}
        </section>

        {/* SEÇÃO 2 — GRÁFICO MENSAL + RECEITA POR CATEGORIA */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

          {/* Gráfico de área (recharts) — 2/3 */}
          <div className="lg:col-span-2 rounded-3xl p-5 " style={{ background: "#1e1e1e" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-white">Desempenho Mensal</h2>
                <p className="text-xs text-gray-500 mt-0.5">Receita vs Despesa — 2025</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block" /> Receita
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block opacity-70" /> Despesa
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#ffffff10" }} />
                <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2}
                  fill="url(#gradReceita)" dot={false}
                  activeDot={{ r: 5, fill: "#10b981", stroke: "#131313", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="despesa" stroke="#f43f5e" strokeWidth={2}
                  fill="url(#gradDespesa)" dot={false}
                  activeDot={{ r: 5, fill: "#f43f5e", stroke: "#131313", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Receita por categoria — 1/3 */}
          <div className="rounded-3xl p-5 " style={{ background: "#1e1e1e" }}>
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Receita por Categoria</h2>
              <p className="text-xs text-gray-500 mt-0.5">Distribuição — maio 2025</p>
            </div>
            <div className="flex flex-col gap-5">
              {CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-300">{cat.label}</span>
                    <span className="text-xs font-semibold text-white">{cat.value}</span>
                  </div>
                  <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "#2a2a2a" }}>
                    <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                      style={{ width: `${cat.pct}%`, background: cat.color }} />
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1">{cat.pct}% do total</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO 3 — TABELA DE FLUXO DE CAIXA */}
        <section className="mb-6 rounded-3xl  overflow-hidden" style={{ background: "#1e1e1e" }}>
          <div className="flex items-center justify-between px-5 py-4 ">
            <div>
              <h2 className="text-sm font-semibold text-white">Fluxo de Caixa</h2>
              <p className="text-xs text-gray-500 mt-0.5">Últimos lançamentos</p>
            </div>
            <button className="text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
              style={{ color: "#10b981" }}>
              Ver todos →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["Descrição", "Tipo", "Data", "Valor", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {CASHFLOW_ROWS.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-gray-200 font-medium text-xs whitespace-nowrap">{row.descricao}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: row.tipo === "entrada" ? "#10b98118" : "#f4375418",
                          color:      row.tipo === "entrada" ? "#10b981"   : "#f43754",
                        }}>
                        {row.tipo === "entrada" ? "↑ Entrada" : "↓ Saída"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{row.data}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold"
                      style={{ color: row.tipo === "entrada" ? "#10b981" : "#f43754" }}>
                      {row.valor}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SEÇÃO 4 — WIDGETS: INDICADORES + MOVIMENTAÇÕES + PENDÊNCIAS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* Indicadores Rápidos */}
          <div className="rounded-3xl p-5 " style={{ background: "#1e1e1e" }}>
            <h2 className="text-sm font-semibold text-white mb-4">Indicadores Rápidos</h2>
            <div className="flex flex-col gap-3">
              {INDICATORS.map(({ id, label, value, meta, icon: Icon, ok }) => (
                <div key={id}
                  className="flex items-center gap-3 p-3 rounded-2xl border-none transition-all"
                  style={{ background: "#242424" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: ok ? "#10b98118" : "#f4375418" }}>
                    <Icon size={16} color={ok ? "#10b981" : "#f43754"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-300">{label}</p>
                    <p className="text-[10px] text-gray-600">{meta}</p>
                  </div>
                  <span className="text-sm font-bold shrink-0" style={{ color: ok ? "#10b981" : "#f43754" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Movimentações Recentes */}
          <div className="rounded-3xl p-5 " style={{ background: "#1e1e1e" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Movimentações Recentes</h2>
                <p className="text-xs text-gray-500 mt-0.5">Últimos lançamentos</p>
              </div>
              <button className="text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "#10b981" }}>
                Ver todas →
              </button>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.04]">
              {RECENT.map((tx) => (
                <div key={tx.id}
                  className="flex items-center gap-3 py-3 hover:bg-white/[0.02] -mx-2 px-2 rounded-2xl transition-colors">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      background: tx.entrada ? "#10b98120" : "#f4375420",
                      color:      tx.entrada ? "#10b981"   : "#f43754",
                    }}>
                    {tx.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{tx.nome}</p>
                    <p className="text-[10px] text-gray-600">{tx.categoria} · {tx.data}</p>
                  </div>
                  <span className="text-xs font-bold shrink-0"
                    style={{ color: tx.entrada ? "#10b981" : "#f43754" }}>
                    {tx.valor}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pendências Operacionais */}
          <div className="rounded-3xl p-5 " style={{ background: "#1e1e1e" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Pendências Operacionais</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#f4375420", color: "#f43754" }}>
                1 urgente
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {PENDING_ITEMS.map(({ id, titulo, detalhe, urgente, icon: Icon }) => (
                <div key={id}
                  className="flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer hover:scale-[1.01]"
                  style={{
                    background: urgente ? "#f4375410" : "#242424",
                  }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: urgente ? "#f4375420" : "#10b98118" }}>
                    <Icon size={14} color={urgente ? "#f43754" : "#10b981"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{titulo}</p>
                    <p className="text-[10px] text-gray-500">{detalhe}</p>
                  </div>
                  {urgente && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: "#f4375430", color: "#f43754" }}>
                      URGENTE
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </section>
    </main>
  );
}