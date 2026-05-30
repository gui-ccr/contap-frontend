"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, LogOut } from "lucide-react";
import type { Route } from "next";

const NAV_ITEMS: { icon: string; label: string; href: Route }[] = [
  { icon: "dashboard",       label: "Dashboard",               href: "/dashboard"           },
  { icon: "menu_book",       label: "Listagem de Lançamentos", href: "/lancamentos"         },
  { icon: "account_balance", label: "Balanço Patrimonial",     href: "/balanco-patrimonial" },
];

const AUTH_ROUTES = ["/", "/login", "/cadastro-empresa", "/recuperar-senha"];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (AUTH_ROUTES.includes(pathname)) return <>{children}</>;

  return (
    <div className="min-h-screen flex" style={{ background: "#131313", color: "#e5e2e1" }}>
      {/* ── Sidebar nav ── */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 px-4 py-6 justify-between"
        style={{ background: "#0f0f0f" }}
      >
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors hover:bg-white/5"
          style={{ color: "#6b7280" }}
        >
          <LogOut size={17} />
          Sair
        </Link>
      </aside>

      {/* ── Page content ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
}
