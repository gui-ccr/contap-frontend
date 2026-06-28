"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import type { Route } from "next";
import Header from "./Header";

const NAV_ITEMS: { icon: string; label: string; href: Route }[] = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" as Route },
  { icon: "account_balance_wallet", label: "Contas a Receber", href: "/contas-receber" as Route },
  { icon: "menu_book", label: "Listagem de Lançamentos", href: "/lancamentos" as Route },
  {
    icon: "account_balance",
    label: "Balanço Patrimonial",
    href: "/balanco-patrimonial" as Route
  },
  { icon: "receipt_long", label: "DRE", href: "/dre" as Route },
  { icon: "group", label: "Funcionários", href: "/funcionarios" as Route },
  { icon: "settings", label: "Configurações", href: "/configuracoes" as Route },
];

const AUTH_ROUTES = ["/", "/login", "/cadastro-empresa", "/recuperar-senha", "/lgpd", "/landing"];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 mb-10">
          <Image
            src="/contauplogo.png"
            alt="ContaUp"
            width={36}
            height={36}
            className="rounded-2xl shadow-lg"
          />
          <div>
            <span className="text-white font-bold text-lg tracking-tight leading-none">
              Conta<span style={{ color: "#4edea3" }}>Up</span>
            </span>
            <p
              className="text-[12px] mt-0.5 font-medium"
              style={{ color: "#6b7280" }}
            >
              Gestão Financeira
            </p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ icon, label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 hover:bg-[#4edea318]/50 hover:text-[#4edea3]/50
                  ${isActive ? "bg-[#4edea318] text-[#4edea3]" :  "bg-transparent text-[#6b7280]"}`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={
                    isActive ? { fontVariationSettings: "'FILL' 1" } : undefined
                  }
                >
                  {icon}
                </span>
                <span className="flex-1 leading-tight">{label}</span>
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "#4edea3" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <Link
        href="/login"
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors hover:bg-white/5"
        style={{ color: "#6b7280" }}
      >
        <LogOut size={17} />
        Sair
      </Link>
    </>
  );
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (AUTH_ROUTES.includes(pathname)) return <>{children}</>;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#131313", color: "#e5e2e1" }}
    >
      {/* ── Mobile top bar ── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 h-14 z-40 flex items-center px-4 gap-3 border-b"
        style={{
          background: "rgba(13,13,13,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "#1e1e1e", color: "#e5e2e1" }}
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Image
            src="/contauplogo.png"
            alt="ContaUp"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="font-bold text-white text-base">
            Conta<span style={{ color: "#4edea3" }}>Up</span>
          </span>
        </div>
      </header>

      {/* ── Mobile drawer (always in DOM — animado via CSS) ── */}
      <div
        className="fixed inset-0 z-50 md:hidden"
        style={{
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: "opacity 280ms ease, visibility 280ms ease",
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          onClick={() => setOpen(false)}
        />

        {/* Drawer panel */}
        <aside
          className="absolute left-0 top-0 bottom-0 w-72 flex flex-col px-4 py-6 justify-between"
          style={{
            background: "#0f0f0f",
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 320ms cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "4px 0 32px rgba(0,0,0,0.5)",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ background: "#1e1e1e", color: "#6b7280" }}
            aria-label="Fechar menu"
          >
            <X size={16} />
          </button>

          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 px-4 py-6 justify-between"
        style={{ background: "#0f0f0f" }}
      >
        <NavLinks pathname={pathname} />
      </aside>

      {/* ── Page content ── */}
      <div className="flex-1 flex flex-col min-w-0 pt-14 md:pt-16">
        <Header />
        {children}
      </div>
    </div>
  );
}
