"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// ── Types ─────────────────────────────────────────────────────────────────────
type Period = "mensal" | "semestral" | "anual";

interface PriceEntry {
  price: number;
  period: string;
  save?: string;
}
interface PlanPrices {
  basico: PriceEntry;
  pro: PriceEntry;
  empresarial: PriceEntry;
}

// ── Static data ───────────────────────────────────────────────────────────────
const PRICING: Record<Period, PlanPrices> = {
  mensal: {
    basico: { price: 99, period: "mês" },
    pro: { price: 199, period: "mês" },
    empresarial: { price: 399, period: "mês" },
  },
  semestral: {
    basico: { price: 79, period: "mês", save: "Economize 20%" },
    pro: { price: 169, period: "mês", save: "Economize 15%" },
    empresarial: { price: 349, period: "mês", save: "Economize 13%" },
  },
  anual: {
    basico: { price: 69, period: "mês", save: "Economize 30%" },
    pro: { price: 149, period: "mês", save: "Economize 25%" },
    empresarial: { price: 299, period: "mês", save: "Economize 25%" },
  },
};

const PROBLEMS = [
  {
    icon: "table_chart",
    title: "Planilhas que não escalam",
    desc: "Excel quebra com volume. Fórmulas erram. Dados se perdem. O que era solução vira problema rapidamente.",
  },
  {
    icon: "shuffle",
    title: "Dados espalhados por toda parte",
    desc: "Banco aqui, nota fiscal lá, folha de pagamento em outro lugar. Consolidar tudo consome horas preciosas.",
  },
  {
    icon: "visibility_off",
    title: "Zero visibilidade em tempo real",
    desc: "O fechamento do mês vira um pesadelo. Decisões são tomadas no escuro, sem dados confiáveis à mão.",
  },
  {
    icon: "hourglass_empty",
    title: "Tempo perdido em tarefas manuais",
    desc: "Lançamentos repetitivos, relatórios feitos à mão, conciliações que demoram horas. Tempo que podia ser estratégia.",
  },
];

const FEATURES = [
  {
    icon: "receipt_long",
    title: "Lançamentos Inteligentes",
    desc: "Categorize e registre transações com agilidade. Histórico completo com filtros avançados por data e conta.",
    color: "#4edea3",
  },
  {
    icon: "trending_up",
    title: "DRE em Tempo Real",
    desc: "Demonstração do Resultado do Exercício atualizada automaticamente. Decisões baseadas em dados reais.",
    color: "#c0c1ff",
  },
  {
    icon: "account_balance",
    title: "Balanço Patrimonial",
    desc: "Ativo, Passivo e Patrimônio Líquido organizados e prontos para auditoria a qualquer momento.",
    color: "#4edea3",
  },
  {
    icon: "group",
    title: "Gestão de Funcionários",
    desc: "Cadastro completo, cargos e informações do time em um só lugar, integrado à gestão financeira.",
    color: "#c0c1ff",
  },
  {
    icon: "dashboard",
    title: "Dashboard Executivo",
    desc: "KPIs financeiros, fluxo de caixa e indicadores de saúde da empresa em uma visão unificada.",
    color: "#4edea3",
  },
  {
    icon: "security",
    title: "Conformidade com LGPD",
    desc: "Dados protegidos, direito de exclusão garantido. Sua empresa em conformidade total com a lei.",
    color: "#c0c1ff",
  },
];

const BASIC_FEATURES = [
  "Até 3 usuários",
  "Lançamentos ilimitados",
  "DRE e Balanço Patrimonial",
  "Dashboard básico",
  "Suporte por e-mail",
];
const PRO_FEATURES = [
  "Até 10 usuários",
  "Lançamentos ilimitados",
  "DRE, Balanço e Relatórios",
  "Dashboard avançado",
  "Gestão de Funcionários",
  "Exportação PDF / Excel",
  "Suporte prioritário",
];
const ENTERPRISE_FEAT = [
  "Usuários ilimitados",
  "Multi-empresa",
  "Tudo do plano Pro",
  "API de integração",
  "Relatórios customizados",
  "Gestor de conta dedicado",
  "SLA garantido",
];

// ── Ambient canvas (GSAP orbs + grid) ────────────────────────────────────────
function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const orbs = el.querySelectorAll<HTMLElement>(".lp-orb");
    const ctx = gsap.context(() => {
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: gsap.utils.random(-70, 70),
          y: gsap.utils.random(-70, 70),
          duration: 10 + i * 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 1.8,
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
    >
      {/* blobs */}
      <div
        className="lp-orb absolute top-[10%] left-[5%] w-[700px] h-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,103,79,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="lp-orb absolute top-[55%] right-[-8%] w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(62,187,158,0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="lp-orb absolute bottom-[5%] left-[35%] w-[450px] h-[450px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,103,79,0.12) 0%, transparent 70%)",
        }}
      />
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #4edea3 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────
function CountUp({
  target,
  prefix = "",
  suffix = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        onEnter: () => {
          if (fired.current) return;
          fired.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => {
              if (el)
                el.textContent =
                  prefix + Math.round(obj.val).toLocaleString("pt-BR") + suffix;
            },
          });
        },
      });
    });
    return () => ctx.revert();
  }, [target, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

// ── Smooth scroll (sem hash na URL) ──────────────────────────────────────────
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ── Floating shrinking navbar ─────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /*
     * Começa em top:24px flutuando com largura expandida e transparente.
     * Após 50px de scroll encolhe: max-width menor, padding menor,
     * border-radius maior, background glass. Tudo via transition CSS.
     */
    <nav
      className="fixed left-0 right-0 z-50 flex justify-center"
      style={{
        top: scrolled ? "10px" : "24px",
        transition: "top 0.4s ease-in-out",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: scrolled ? "860px" : "1200px",
          margin: "0 auto",
          padding: scrolled ? "0 20px" : "0 24px",
          height: scrolled ? "52px" : "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: scrolled ? "20px" : "12px",
          background: scrolled ? "rgba(16,16,20,0.45)" : "transparent",
          backdropFilter: scrolled ? "blur(28px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(28px) saturate(180%)" : "none",
          border: scrolled
            ? "1px solid rgba(255,255,255,0.09)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "none",
          transition:
            "max-width 0.4s ease-in-out, height 0.4s ease-in-out, padding 0.4s ease-in-out, border-radius 0.4s ease-in-out, background 0.4s ease-in-out, border-color 0.4s ease-in-out, box-shadow 0.4s ease-in-out, backdrop-filter 0.4s ease-in-out",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/contauplogo.png"
            alt="ContaUp"
            width={scrolled ? 26 : 30}
            height={scrolled ? 26 : 30}
            className="rounded-xl"
            style={{
              transition: "width 0.4s ease-in-out, height 0.4s ease-in-out",
            }}
          />
          <span
            className="font-black tracking-tight text-white"
            style={{
              fontSize: scrolled ? "16px" : "18px",
              transition: "font-size 0.4s ease-in-out",
            }}
          >
            Conta<span style={{ color: "#4edea3" }}>Up</span>
          </span>
        </div>

        {/* Nav links */}
        <div
          className="hidden md:flex items-center"
          style={{
            gap: scrolled ? "20px" : "32px",
            transition: "gap 0.4s ease-in-out",
          }}
        >
          {[
            { id: "inicio", label: "Início" },
            { id: "problemas", label: "Problemas" },
            { id: "solucoes", label: "Solução" },
            { id: "precos", label: "Preços" },
            { id: "faq", label: "FAQ" },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToSection(l.id)}
              className="bg-transparent border-0 cursor-pointer p-0 font-medium transition-colors"
              style={{
                color: "#86948a",
                fontSize: scrolled ? "13px" : "14px",
                transition: "font-size 0.4s ease-in-out, color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e5e2e1")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#86948a")}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTAs */}
        <div
          className="flex items-center shrink-0"
          style={{
            gap: scrolled ? "6px" : "8px",
            transition: "gap 0.4s ease-in-out",
          }}
        >
          <Link
            href={"/login" as Route}
            className="hidden sm:block font-semibold rounded-xl transition-colors"
            style={{
              color: "#bbcabf",
              fontSize: scrolled ? "13px" : "14px",
              padding: scrolled ? "6px 12px" : "8px 16px",
              transition:
                "font-size 0.4s ease-in-out, padding 0.4s ease-in-out",
            }}
          >
            Entrar
          </Link>
          <Link
            href={"/cadastro-empresa" as Route}
            className="font-bold rounded-xl hover:scale-[1.03] transition-all"
            style={{
              background: "#4edea3",
              color: "#003824",
              fontSize: scrolled ? "13px" : "14px",
              padding: scrolled ? "6px 14px" : "8px 16px",
              transition:
                "font-size 0.4s ease-in-out, padding 0.4s ease-in-out, transform 0.2s",
            }}
          >
            Cadastrar-se
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Mini dashboard mockup ─────────────────────────────────────────────────────
function AppPreview() {
  return (
    <div
      className="relative mx-auto mt-16 max-w-3xl rounded-2xl border overflow-hidden shadow-2xl"
      style={{
        borderColor: "rgba(78,222,163,0.15)",
        background: "#1c1c1f",
        boxShadow:
          "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(78,222,163,0.08)",
      }}
    >
      {/* title bar */}
      <div
        className="flex items-center gap-1.5 px-4 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)", background: "#111" }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "#ff5f57" }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "#febc2e" }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "#28c840" }}
        />
        <span
          className="flex-1 text-center text-[11px] font-medium"
          style={{ color: "#555" }}
        >
          contaup.app · Dashboard
        </span>
      </div>
      {/* mock content */}
      <div className="p-5 flex flex-col gap-4">
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Receita",
              value: "R$ 125.000",
              icon: "trending_up",
              color: "#4edea3",
            },
            {
              label: "Despesas",
              value: "R$ 64.000",
              icon: "trending_down",
              color: "#ffb3b0",
            },
            {
              label: "Lucro Líquido",
              value: "R$ 61.000",
              icon: "account_balance",
              color: "#c0c1ff",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-xl p-3.5 flex flex-col gap-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-medium"
                  style={{ color: "#86948a" }}
                >
                  {k.label}
                </span>
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ color: k.color, fontVariationSettings: '"FILL" 1' }}
                >
                  {k.icon}
                </span>
              </div>
              <span
                className="text-[15px] font-bold tabular-nums"
                style={{ color: "#e5e2e1" }}
              >
                {k.value}
              </span>
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width:
                      k.label === "Receita"
                        ? "100%"
                        : k.label === "Despesas"
                          ? "51%"
                          : "49%",
                    background: k.color,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* transactions list */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            className="px-4 py-2.5"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <span
              className="text-[11px] font-bold tracking-widest uppercase"
              style={{ color: "#86948a" }}
            >
              Lançamentos recentes
            </span>
          </div>
          {[
            {
              desc: "Venda de Produto",
              value: "+ R$ 8.500",
              type: "positive",
              icon: "add_circle",
            },
            {
              desc: "Aluguel escritório",
              value: "- R$ 3.200",
              type: "negative",
              icon: "home_work",
            },
            {
              desc: "Prestação de serviço",
              value: "+ R$ 4.200",
              type: "positive",
              icon: "handshake",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom:
                  i < 2 ? "1px solid rgba(255,255,255,0.04)" : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{
                    color: t.type === "positive" ? "#4edea3" : "#ffb3b0",
                    fontVariationSettings: '"FILL" 1',
                  }}
                >
                  {t.icon}
                </span>
                <span className="text-[13px]" style={{ color: "#bbcabf" }}>
                  {t.desc}
                </span>
              </div>
              <span
                className="text-[13px] font-bold tabular-nums font-mono"
                style={{ color: t.type === "positive" ? "#4edea3" : "#ffb3b0" }}
              >
                {t.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ boxShadow: "inset 0 0 60px rgba(78,222,163,0.03)" }}
      />
    </div>
  );
}

// ── Pricing card ──────────────────────────────────────────────────────────────
function PricingCard({
  tier,
  entry,
  features,
  highlight = false,
}: {
  tier: string;
  entry: PriceEntry;
  features: string[];
  highlight?: boolean;
}) {
  const priceRef = useRef<HTMLSpanElement>(null);
  const saveRef = useRef<HTMLParagraphElement>(null);
  const prevPrice = useRef(entry.price);

  useEffect(() => {
    const el = priceRef.current;
    if (!el) return;
    const from = prevPrice.current;
    const to = entry.price;
    prevPrice.current = to;
    if (from === to) return;

    // animate number
    const obj = { val: from };
    gsap.killTweensOf(obj);
    gsap.to(obj, {
      val: to,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = String(Math.round(obj.val));
      },
    });

    // flash the save badge if visible
    if (saveRef.current) {
      gsap.fromTo(
        saveRef.current,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    }
  }, [entry.price]);

  return (
    <div
      className="stagger-card relative flex flex-col rounded-2xl p-8 glass-panel"
      style={
        highlight
          ? {
              border: "1px solid rgba(78,222,163,0.30)",
              background: "rgba(39,39,42,0.55)",
              boxShadow: "0 0 60px rgba(78,222,163,0.08)",
            }
          : {
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(39,39,42,0.45)",
            }
      }
    >
      {highlight && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase"
          style={{ background: "#4edea3", color: "#003824" }}
        >
          Mais popular
        </div>
      )}

      <div className="mb-8">
        <p
          className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1"
          style={{ color: highlight ? "#4edea3" : "#86948a" }}
        >
          {tier}
        </p>
        <div className="flex items-baseline gap-1 mt-4 mb-1">
          <span
            className="text-[14px] font-medium"
            style={{ color: "#86948a" }}
          >
            R$
          </span>
          <span
            ref={priceRef}
            className="text-[3.5rem] font-black tabular-nums leading-none text-white"
          >
            {entry.price}
          </span>
          <span className="text-[14px]" style={{ color: "#86948a" }}>
            /{entry.period}
          </span>
        </div>
        {entry.save && (
          <p
            ref={saveRef}
            className="text-[13px] font-semibold"
            style={{ color: "#4edea3" }}
          >
            {entry.save}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-3 flex-1 mb-8">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2.5 text-[14px]"
            style={{ color: highlight ? "#e5e2e1" : "#bbcabf" }}
          >
            <span
              className="material-symbols-outlined text-[16px] shrink-0"
              style={{ color: "#4edea3", fontVariationSettings: '"FILL" 1' }}
            >
              check_circle
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={"/cadastro-empresa" as Route}
        className="block text-center py-3.5 rounded-xl font-bold text-[14px] transition-all"
        style={
          highlight
            ? {
                background: "#4edea3",
                color: "#003824",
                boxShadow: "0 8px 24px rgba(78,222,163,0.25)",
              }
            : { border: "1px solid rgba(255,255,255,0.10)", color: "#e5e2e1" }
        }
        onMouseEnter={(e) => {
          if (highlight) e.currentTarget.style.opacity = "0.9";
          else e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          if (!highlight) e.currentTarget.style.background = "transparent";
        }}
      >
        Escolher Plano
      </Link>
    </div>
  );
}

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "O que é o ContaUp?",
    a: "O ContaUp é uma plataforma de gestão financeira e contabilidade desenvolvida para empresas brasileiras. Centralizamos lançamentos, DRE, Balanço Patrimonial, gestão de funcionários e muito mais em uma única interface limpa e intuitiva.",
  },
  {
    q: "Preciso ter conhecimento contábil para usar?",
    a: "Não. O ContaUp foi pensado para ser acessível tanto para contadores quanto para empreendedores sem formação contábil. A interface guia você em cada etapa, com terminologia clara e relatórios visuais.",
  },
  {
    q: "Como funciona o período gratuito de 30 dias?",
    a: "Você tem acesso completo a todas as funcionalidades do plano escolhido por 30 dias, sem precisar cadastrar cartão de crédito. Ao final do período, você decide se quer continuar — sem cobranças surpresa.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Não há fidelidade, multa ou burocracia. Você pode cancelar sua assinatura diretamente nas configurações da conta, a qualquer momento, e seus dados continuarão disponíveis por mais 30 dias.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Totalmente. O ContaUp é 100% aderente à LGPD. Seus dados são criptografados em trânsito e em repouso. Você também pode solicitar a exclusão completa dos seus dados a qualquer momento.",
  },
  {
    q: "O ContaUp substitui um contador?",
    a: "O ContaUp é uma poderosa ferramenta de apoio à gestão financeira, mas não substitui a consultoria de um contador habilitado. Ele torna o trabalho do contador muito mais ágil e reduz horas de trabalho manual.",
  },
  {
    q: "Quantas empresas posso gerenciar?",
    a: "No plano Básico e Profissional você gerencia uma empresa por conta. No plano Empresarial, o recurso Multi-empresa permite gerenciar múltiplos CNPJs em uma única plataforma.",
  },
  {
    q: "Qual suporte está disponível?",
    a: "Todos os planos incluem suporte por e-mail. O plano Profissional conta com suporte prioritário e o Empresarial inclui gestor de conta dedicado com SLA garantido.",
  },
];

// ── FAQ accordion item ────────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const icon = iconRef.current;
    if (!body || !icon) return;

    if (open) {
      gsap.set(body, { height: "auto", opacity: 1 });
      const fullH = body.offsetHeight;
      gsap.fromTo(
        body,
        { height: 0, opacity: 0 },
        { height: fullH, opacity: 1, duration: 0.38, ease: "power3.out" },
      );
      gsap.to(icon, { rotation: 45, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(body, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
      });
      gsap.to(icon, { rotation: 0, duration: 0.3, ease: "power2.out" });
    }
  }, [open]);

  return (
    <div
      className="reveal-up border-b"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer bg-transparent border-0 group"
      >
        <span
          className="text-[16px] font-semibold transition-colors"
          style={{ color: open ? "#e5e2e1" : "#bbcabf" }}
        >
          {q}
        </span>
        <span
          ref={iconRef}
          className="material-symbols-outlined shrink-0 transition-colors"
          style={{ color: open ? "#4edea3" : "#555", fontSize: "20px" }}
        >
          add
        </span>
      </button>

      <div ref={bodyRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <p
          className="pb-5 text-[15px] leading-relaxed"
          style={{ color: "#86948a" }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

// ── FAQ section ───────────────────────────────────────────────────────────────
function FaqSection() {
  return (
    <section id="faq" className="relative py-32 px-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-1px] left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(192,193,255,0.05), transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="reveal-up text-center mb-14">
          <p
            className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#c0c1ff" }}
          >
            FAQ
          </p>
          <h2
            className="font-black tracking-[-0.03em] text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Perguntas frequentes.
          </h2>
          <p
            className="mt-5 text-[1rem] max-w-[560px] mx-auto"
            style={{ color: "#86948a" }}
          >
            Não encontrou o que procura? Entre em contato pelo botão abaixo.
          </p>
        </div>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function LandingPage() {
  const [period, setPeriod] = useState<Period>("mensal");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.set(
        [
          ".lp-hero-badge",
          ".lp-hero-h1",
          ".lp-hero-sub",
          ".lp-hero-ctas",
          ".lp-hero-stats",
        ],
        { opacity: 0, y: 30 },
      );
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".lp-hero-badge", { opacity: 1, y: 0, duration: 0.7 }, 0.2)
        .to(".lp-hero-h1", { opacity: 1, y: 0, duration: 0.85 }, 0.35)
        .to(".lp-hero-sub", { opacity: 1, y: 0, duration: 0.8 }, 0.55)
        .to(".lp-hero-ctas", { opacity: 1, y: 0, duration: 0.75 }, 0.7)
        .to(".lp-hero-stats", { opacity: 1, y: 0, duration: 0.75 }, 0.85);

      // Scroll reveals
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          },
        );
      });

      // Stagger cards
      gsap.utils.toArray<HTMLElement>(".stagger-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: el, start: "top 86%" },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const prices = PRICING[period];

  return (
    <div
      className="min-h-screen text-on-surface overflow-x-hidden"
      style={{ background: "#1e1e22" }}
    >
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        id="inicio"
        className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-6"
      >
        <AmbientBackground />

        <div className="relative z-10 max-w-4xl mx-auto text-center py-24">
          {/* Badge */}
          <div
            className="lp-hero-badge inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border"
            style={{
              background: "rgba(78,222,163,0.08)",
              borderColor: "rgba(78,222,163,0.2)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#4edea3" }}
            />
            <span
              className="text-[12px] font-bold tracking-[0.12em] uppercase"
              style={{ color: "#4edea3" }}
            >
              30 dias grátis · Sem cartão de crédito
            </span>
          </div>

          {/* Headline */}
          <h1
            className="lp-hero-h1 font-black leading-[1.0] tracking-[-0.04em] text-white mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            Contabilidade que
            <br />
            <span style={{ color: "#4edea3" }}>realmente funciona.</span>
          </h1>

          {/* Sub */}
          <p
            className="lp-hero-sub text-[1.1rem] leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ color: "#bbcabf" }}
          >
            O ContaUp automatiza sua gestão financeira — de lançamentos a DRE,
            balanço patrimonial a funcionários — em uma plataforma limpa e
            poderosa.{" "}
            <span className="text-on-surface font-medium">
              Sem planilhas. Sem dor de cabeça.
            </span>
          </p>

          {/* CTAs */}
          <div className="lp-hero-ctas flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href={"/cadastro-empresa" as Route}
              className="inline-flex items-center justify-center gap-2 font-bold text-[15px] px-8 py-4 rounded-2xl transition-all hover:scale-[1.03] hover:opacity-95"
              style={{
                background: "#4edea3",
                color: "#003824",
                boxShadow: "0 12px 32px rgba(78,222,163,0.22)",
              }}
            >
              <span className="material-symbols-outlined text-[18px]">
                rocket_launch
              </span>
              Cadastrar-se
            </Link>
            <Link
              href={"/login" as Route}
              className="inline-flex items-center justify-center gap-2 font-semibold text-[15px] px-8 py-4 rounded-2xl transition-all hover:scale-[1.01]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#e5e2e1",
              }}
            >
              <span className="material-symbols-outlined text-[18px]">
                login
              </span>
              Já tenho uma conta
            </Link>
          </div>

          {/* Stats */}
          <div className="lp-hero-stats grid grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto mt-12">
            {[
              {
                target: 500,
                prefix: "",
                suffix: "+",
                label: "Empresas ativas",
              },
              { target: 2, prefix: "R$", suffix: "B+", label: "Gerenciados" },
              { target: 98, prefix: "", suffix: "%", label: "Satisfação" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center flex flex-col items-center"
              >
                <div className="text-[2.25rem] md:text-[2.5rem] font-black text-white tabular-nums leading-none mb-2">
                  <CountUp
                    target={s.target}
                    prefix={s.prefix}
                    suffix={s.suffix}
                  />
                </div>
                <div className="text-[11px] md:text-[12px] font-medium text-[#86948a] max-w-[100px] leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* App preview mockup */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-24">
          <AppPreview />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <span
            className="text-[10px] tracking-[0.2em] uppercase font-medium"
            style={{ color: "#86948a" }}
          >
            Rolar
          </span>
          <span
            className="material-symbols-outlined text-[20px] animate-bounce"
            style={{ color: "#86948a" }}
          >
            keyboard_arrow_down
          </span>
        </div>
      </section>

      {/* ── PROBLEM ───────────────────────────────────────────────────────── */}
      <section id="problemas" className="relative py-32 px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-1px] left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="reveal-up text-center mb-16">
            <p
              className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#ffb3b0" }}
            >
              O problema
            </p>
            <h2
              className="font-black tracking-[-0.03em] text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Por que a contabilidade
              <br />
              tradicional falha?
            </h2>
            <p
              className="mt-5 text-[1rem] max-w-[560px] mx-auto"
              style={{ color: "#86948a" }}
            >
              Você não está sozinho. Milhares de empresas sofrem com os mesmos
              problemas todos os dias.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROBLEMS.map((p, i) => (
              <div
                key={i}
                className="stagger-card group rounded-2xl p-7 glass-panel transition-all duration-300 cursor-default"
                style={{
                  background: "rgba(39,39,42,0.5)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,179,176,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
                }
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors"
                  style={{
                    background: "rgba(255,179,176,0.08)",
                    border: "1px solid rgba(255,179,176,0.14)",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ color: "#ffb3b0" }}
                  >
                    {p.icon}
                  </span>
                </div>
                <h3 className="font-bold text-[17px] text-white mb-2">
                  {p.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "#86948a" }}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION / FEATURES ───────────────────────────────────────────── */}
      <section id="solucoes" className="relative py-32 px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-1px] left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            }}
          />
          <div
            className="absolute top-[20%] left-[-5%] w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(78,222,163,0.05), transparent 70%)",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="reveal-up text-center mb-16">
            <p
              className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#4edea3" }}
            >
              A solução
            </p>
            <h2
              className="font-black tracking-[-0.03em] text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Tudo que você precisa,
              <br />
              em um só lugar.
            </h2>
            <p
              className="mt-5 text-[1rem] max-w-[560px] mx-auto"
              style={{ color: "#86948a" }}
            >
              O ContaUp integra todas as áreas da sua gestão financeira com uma
              experiência limpa e eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="stagger-card group rounded-2xl p-7 glass-panel transition-all duration-300 cursor-default"
                style={{
                  background: "rgba(39,39,42,0.45)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = `${f.color}28`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
                }
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${f.color}12`,
                    border: `1px solid ${f.color}1a`,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      color: f.color,
                      fontVariationSettings: '"FILL" 1',
                    }}
                  >
                    {f.icon}
                  </span>
                </div>
                <h3 className="font-bold text-[16px] text-white mb-2">
                  {f.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "#86948a" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="precos" className="relative py-32 px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-1px] left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            }}
          />
          <div
            className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(192,193,255,0.06), transparent 70%)",
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="reveal-up text-center mb-12">
            <p
              className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#c0c1ff" }}
            >
              Preços
            </p>
            <h2
              className="font-black tracking-[-0.03em] text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Planos para todo
              <br />
              tamanho de empresa.
            </h2>
            <p
              className="mt-5 text-[1rem] max-w-[560px] mx-auto"
              style={{ color: "#86948a" }}
            >
              Comece grátis por 30 dias. Sem cartão de crédito. Cancele quando
              quiser.
            </p>
          </div>

          {/* Period toggle */}
          <div className="reveal-up flex justify-center mb-10">
            <div
              className="flex items-center p-1.5 rounded-2xl gap-1"
              style={{
                background: "rgba(42,42,42,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {[
                { key: "mensal" as const, label: "Mensal" },
                {
                  key: "semestral" as const,
                  label: "Semestral",
                  badge: "−20%",
                },
                { key: "anual" as const, label: "Anual", badge: "−35%" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPeriod(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all cursor-pointer hover:text-emerald-300 hover:bg-outline/10 ${
                    period === tab.key
                      ? "bg-[#27272a] text-[#e5e2e1] shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                      : "bg-transparent text-outline"
                  }`}
                >
                  {tab.label}
                  {tab.badge && (
                    <span
                      className="text-[11px] font-bold px-1.5 py-0.5 rounded-md "
                      style={
                        period === tab.key
                          ? {
                              background: "rgba(78,222,163,0.15)",
                              color: "#4edea3",
                            }
                          : {
                              background: "rgba(255,255,255,0.05)",
                              color: "#86948a",
                            }
                      }
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PricingCard
              tier="Básico"
              entry={prices.basico}
              features={BASIC_FEATURES}
            />
            <PricingCard
              tier="Profissional"
              entry={prices.pro}
              features={PRO_FEATURES}
              highlight
            />
            <PricingCard
              tier="Empresarial"
              entry={prices.empresarial}
              features={ENTERPRISE_FEAT}
            />
          </div>

          <p
            className="text-center text-[13px] mt-6"
            style={{ color: "#86948a" }}
          >
            Todos os planos incluem{" "}
            <strong className="text-on-surface">30 dias grátis</strong> · Sem
            cartão · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <FaqSection />

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="reveal-up relative overflow-hidden rounded-3xl p-12 sm:p-20 text-center border"
            style={{
              background:
                "linear-gradient(135deg, rgba(78,222,163,0.07) 0%, rgba(20,20,24,0.95) 50%, rgba(192,193,255,0.05) 100%)",
              borderColor: "rgba(78,222,163,0.18)",
            }}
          >
            {/* ambient inside */}
            <div
              className="absolute top-[-40%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(78,222,163,0.12), transparent 65%)",
              }}
            />
            <div
              className="absolute bottom-[-40%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(192,193,255,0.09), transparent 65%)",
              }}
            />

            <div className="relative z-10">
              <p
                className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5"
                style={{ color: "#4edea3" }}
              >
                Comece hoje
              </p>
              <h2
                className="font-black tracking-[-0.04em] text-white leading-tight mb-6"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
              >
                30 dias grátis.
                <br />
                Sem compromisso.
              </h2>
              <p
                className="text-[1.05rem] max-w-[480px] mx-auto mb-10"
                style={{ color: "#86948a" }}
              >
                Configure em minutos. Importe seus dados. Veja a diferença no
                primeiro dia. Cancele quando quiser, sem burocracia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={"/cadastro-empresa" as Route}
                  className="inline-flex items-center justify-center gap-2 font-bold text-[16px] px-10 py-4 rounded-2xl transition-all hover:scale-[1.02] hover:opacity-95"
                  style={{
                    background: "#4edea3",
                    color: "#003824",
                    boxShadow: "0 16px 40px rgba(78,222,163,0.28)",
                  }}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    rocket_launch
                  </span>
                  Criar conta grátis agora
                </Link>
                <Link
                  href={"/login" as Route}
                  className="inline-flex items-center justify-center gap-2 font-semibold text-[16px] px-10 py-4 rounded-2xl transition-all hover:scale-[1.01]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#e5e2e1",
                  }}
                >
                  Fazer login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        className="px-6 py-14"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            {/* Brand */}
            <div className="max-w-[240px]">
              <div className="flex items-center gap-2.5 mb-3">
                <Image
                  src="/contauplogo.png"
                  alt="ContaUp"
                  width={28}
                  height={28}
                  className="rounded-xl"
                />
                <span className="font-black text-[17px] tracking-tight text-white">
                  Conta<span style={{ color: "#4edea3" }}>Up</span>
                </span>
              </div>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "#86948a" }}
              >
                Plataforma de contabilidade e gestão financeira para empresas
                brasileiras.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <p
                  className="text-[11px] font-bold tracking-[0.18em] uppercase mb-4"
                  style={{ color: "#86948a" }}
                >
                  Empresa
                </p>
                <ul className="flex flex-col gap-2.5">
                  <li>
                    <button
                      onClick={() => scrollToSection("precos")}
                      className="text-[13px] bg-transparent border-0 p-0 cursor-pointer transition-colors"
                      style={{ color: "#86948a" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#e5e2e1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#86948a")
                      }
                    >
                      Preços
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("faq")}
                      className="text-[13px] bg-transparent border-0 p-0 cursor-pointer transition-colors"
                      style={{ color: "#86948a" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#e5e2e1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#86948a")
                      }
                    >
                      FAQ
                    </button>
                  </li>
                  <li>
                    <Link
                      href={"/lgpd" as Route}
                      className="text-[13px] transition-colors"
                      style={{ color: "#86948a" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#e5e2e1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#86948a")
                      }
                    >
                      Privacidade & Termos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/solicitar-exclusao-dados" as Route}
                      className="text-[13px] transition-colors"
                      style={{ color: "#86948a" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#e5e2e1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#86948a")
                      }
                    >
                      Exclusão de dados
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p
                  className="text-[11px] font-bold tracking-[0.18em] uppercase mb-4"
                  style={{ color: "#86948a" }}
                >
                  Acesso
                </p>
                <ul className="flex flex-col gap-2.5">
                  <li>
                    <Link
                      href={"/login" as Route}
                      className="text-[13px] transition-colors"
                      style={{ color: "#86948a" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#e5e2e1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#86948a")
                      }
                    >
                      Fazer login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/cadastro-empresa" as Route}
                      className="text-[13px] transition-colors"
                      style={{ color: "#4edea3" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "0.75")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                    >
                      Criar conta grátis →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <p className="text-[12px]" style={{ color: "#555" }}>
              © 2026 ContaUp. Projeto acadêmico universitário.
            </p>
            <p
              className="text-[12px] flex items-center gap-1.5"
              style={{ color: "#555" }}
            >
              Desenvolvido pela
              <span className="font-bold" style={{ color: "#4edea3" }}>
                TechBalance
              </span>
              · Feito no Brasil
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
