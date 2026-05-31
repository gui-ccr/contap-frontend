"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, LogOut, Menu, X } from "lucide-react";
import type { Route } from "next";

const NAV_ITEMS: { icon: string; label: string; href: Route }[] = [
  { icon: "dashboard",       label: "Dashboard",               href: "/dashboard"           },
  { icon: "menu_book",       label: "Listagem de Lançamentos", href: "/lancamentos"         },
  { icon: "account_balance", label: "Balanço Patrimonial",     href: "/balanco-patrimonial" },
];

const AUTH_ROUTES = ["/", "/login", "/cadastro-empresa", "/recuperar-senha"];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 mb-10">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg,#4edea3,#10b981)" }}
          >
            <DollarSign size={18} color="#003824" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight leading-none">
              Conta<span style={{ color: "#4edea3" }}>Up</span>
            </span>
            <p className="text-[10px] mt-0.5 font-medium" style={{ color: "#6b7280" }}>
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive ? "#4edea318" : "transparent",
                  color: isActive ? "#4edea3" : "#6b7280",
                }}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                <span className="flex-1 leading-tight">{label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#4edea3" }} />
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
    <div className="min-h-screen flex" style={{ background: "#131313", color: "#e5e2e1" }}>

      {/* ── Mobile top bar ── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 h-14 z-40 flex items-center px-4 gap-3 border-b"
        style={{
          background: "rgba(15,15,15,0.95)",
          backdropFilter: "blur(12px)",
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
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#4edea3,#10b981)" }}
          >
            <DollarSign size={14} color="#003824" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white text-base">
            Conta<span style={{ color: "#4edea3" }}>Up</span>
          </span>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 flex flex-col px-4 py-6 justify-between"
            style={{ background: "#0f0f0f" }}
          >
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
      )}

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 px-4 py-6 justify-between"
        style={{ background: "#0f0f0f" }}
      >
        <NavLinks pathname={pathname} />
      </aside>

      {/* ── Page content ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden pt-14 md:pt-0">
        {children}
      </div>
    </div>
  );
}
