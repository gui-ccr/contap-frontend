"use client";

import { Download, Bell, HelpCircle, CheckCircle } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ATIVO_CIRCULANTE = [
  { label: "Caixa e Equivalentes",  valor: "R$ 1.245.000,00" },
  { label: "Contas a Receber",      valor: "R$ 850.500,00"   },
  { label: "Estoques",              valor: "R$ 420.000,00"   },
];

const ATIVO_NAO_CIRCULANTE = [
  { label: "Imobilizado",    valor: "R$ 3.100.000,00" },
  { label: "Intangível",     valor: "R$ 550.000,00"   },
  { label: "Investimentos",  valor: "R$ 800.000,00"   },
];

const PASSIVO_CIRCULANTE = [
  { label: "Fornecedores",          valor: "R$ 620.000,00" },
  { label: "Obrigações Fiscais",    valor: "R$ 185.000,00" },
  { label: "Empréstimos Curto Prazo", valor: "R$ 350.000,00" },
];

const PASSIVO_NAO_CIRCULANTE = [
  { label: "Financiamentos Longo Prazo", valor: "R$ 1.800.000,00" },
  { label: "Provisões",                  valor: "R$ 210.500,00"   },
];

const PATRIMONIO_LIQUIDO = [
  { label: "Capital Social",    valor: "R$ 3.000.000,00" },
  { label: "Reservas de Lucro", valor: "R$ 800.000,00"   },
];

const TOTAL_ATIVO    = "R$ 6.965.500,00";
const TOTAL_PASSIVO  = "R$ 6.965.500,00";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-0.5 h-4 rounded-full" style={{ background: color }} />
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#6b7280" }}>
        {label}
      </span>
    </div>
  );
}

function LineItem({ label, valor, muted }: { label: string; valor: string; muted?: boolean }) {
  return (
    <div
      className="flex justify-between items-center py-2.5 px-3 rounded-xl transition-colors"
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span className="text-sm" style={{ color: muted ? "#6b7280" : "#e5e2e1" }}>{label}</span>
      <span className="text-sm font-semibold font-mono" style={{ color: muted ? "#6b7280" : "#e5e2e1" }}>
        {valor}
      </span>
    </div>
  );
}

function SubtotalRow({ label, valor, color }: { label: string; valor: string; color: string }) {
  return (
    <div
      className="flex justify-between items-center py-2.5 px-3 rounded-xl mt-1"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>{label}</span>
      <span className="text-sm font-bold font-mono" style={{ color }}>{valor}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BalancoPatrimonialPage() {
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top bar — desktop only */}
      <header
        className="hidden md:flex justify-between items-center px-8 h-16 sticky top-0 z-40 border-b"
        style={{ background: "rgba(19,19,19,0.85)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div />
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "#6b7280" }}>{today}</span>
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center hover:bg-white/5" style={{ color: "#6b7280" }}>
            <Bell size={17} />
          </button>
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center hover:bg-white/5" style={{ color: "#6b7280" }}>
            <HelpCircle size={17} />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: "linear-gradient(135deg,#4edea3,#10b981)", color: "#003824" }}>
            GR
          </div>
        </div>
      </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <div className="max-w-6xl mx-auto space-y-5">

            {/* Page header */}
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

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ── ATIVO ── */}
              <div className="rounded-3xl p-6 flex flex-col" style={{ background: "#1e1e1e" }}>
                <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                    style={{ background: "#c0c1ff18" }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: "#c0c1ff" }}>trending_up</span>
                  </div>
                  <h2 className="text-lg font-bold tracking-tight" style={{ color: "#e5e2e1" }}>Ativo</h2>
                </div>

                {/* Circulante */}
                <div className="mb-6">
                  <SectionHeader label="Circulante" color="#c0c1ff" />
                  <div>
                    {ATIVO_CIRCULANTE.map((i) => <LineItem key={i.label} {...i} />)}
                    <SubtotalRow label="Total Circulante" valor="R$ 2.515.500,00" color="#c0c1ff" />
                  </div>
                </div>

                {/* Não Circulante */}
                <div className="mb-6">
                  <SectionHeader label="Não Circulante" color="#c0c1ff" />
                  <div>
                    {ATIVO_NAO_CIRCULANTE.map((i) => <LineItem key={i.label} {...i} />)}
                    <SubtotalRow label="Total Não Circulante" valor="R$ 4.450.000,00" color="#c0c1ff" />
                  </div>
                </div>

                {/* Total Ativo */}
                <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div
                    className="flex justify-between items-center py-3.5 px-4 rounded-2xl"
                    style={{ background: "#c0c1ff12", border: "1px solid #c0c1ff20" }}
                  >
                    <span className="text-base font-bold" style={{ color: "#e5e2e1" }}>Total do Ativo</span>
                    <span className="text-base font-bold font-mono" style={{ color: "#c0c1ff" }}>{TOTAL_ATIVO}</span>
                  </div>
                </div>
              </div>

              {/* ── PASSIVO + PL ── */}
              <div className="rounded-3xl p-6 flex flex-col" style={{ background: "#1e1e1e" }}>
                <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                    style={{ background: "#ffb3b018" }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: "#ffb3b0" }}>trending_down</span>
                  </div>
                  <h2 className="text-lg font-bold tracking-tight" style={{ color: "#e5e2e1" }}>
                    Passivo e Patrimônio Líquido
                  </h2>
                </div>

                {/* Passivo Circulante */}
                <div className="mb-6">
                  <SectionHeader label="Passivo Circulante" color="#ffb3b0" />
                  <div>
                    {PASSIVO_CIRCULANTE.map((i) => <LineItem key={i.label} {...i} />)}
                    <SubtotalRow label="Total Passivo Circulante" valor="R$ 1.155.000,00" color="#ffb3b0" />
                  </div>
                </div>

                {/* Passivo Não Circulante */}
                <div className="mb-6">
                  <SectionHeader label="Passivo Não Circulante" color="#ffb3b0" />
                  <div>
                    {PASSIVO_NAO_CIRCULANTE.map((i) => <LineItem key={i.label} {...i} />)}
                    <SubtotalRow label="Total Passivo Não Circ." valor="R$ 2.010.500,00" color="#ffb3b0" />
                  </div>
                </div>

                {/* Patrimônio Líquido */}
                <div className="mb-6">
                  <SectionHeader label="Patrimônio Líquido" color="#4edea3" />
                  <div>
                    {PATRIMONIO_LIQUIDO.map((i) => <LineItem key={i.label} {...i} />)}
                    <SubtotalRow label="Total Patrimônio Líquido" valor="R$ 3.800.000,00" color="#4edea3" />
                  </div>
                </div>

                {/* Total Passivo + PL */}
                <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div
                    className="flex justify-between items-center py-3.5 px-4 rounded-2xl"
                    style={{ background: "#4edea312", border: "1px solid #4edea320" }}
                  >
                    <span className="text-base font-bold" style={{ color: "#e5e2e1" }}>Total Passivo + PL</span>
                    <span className="text-base font-bold font-mono" style={{ color: "#4edea3" }}>{TOTAL_PASSIVO}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Equation footer */}
            <div
              className="rounded-3xl p-4 md:p-5 flex flex-wrap items-center justify-center gap-4 md:gap-8"
              style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#c0c1ff" }}>
                  Total do Ativo
                </p>
                <p className="text-base font-bold font-mono" style={{ color: "#e5e2e1" }}>{TOTAL_ATIVO}</p>
              </div>

              <span className="text-xl font-light" style={{ color: "#6b7280" }}>=</span>

              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#6b7280" }}>
                  Total Passivo + PL
                </p>
                <p className="text-base font-bold font-mono" style={{ color: "#e5e2e1" }}>{TOTAL_PASSIVO}</p>
              </div>

              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "#4edea318" }}
              >
                <CheckCircle size={14} style={{ color: "#4edea3" }} />
                <span className="text-xs font-semibold" style={{ color: "#4edea3" }}>Balancete ok</span>
              </div>
            </div>

          </div>
      </main>
    </div>
  );
}
