"use client";

import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";

export default function Header() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <header
      className="hidden md:flex fixed top-0 right-0 h-16 items-center justify-between px-8 z-30 border-b"
      style={{
        left: "256px",
        background: "rgba(13,13,13,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#6b7280" }}
        />
        <input
          placeholder="Buscar lançamentos, contas..."
          className="rounded-full pl-9 pr-5 py-2 text-sm outline-none w-72 transition-all"
          style={{
            background: "#1e1e1e",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#e5e2e1",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(78,222,163,0.35)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Clock + date */}
        <div className="text-right pr-1">
          <p className="text-sm font-bold leading-tight tabular-nums" style={{ color: "#e5e2e1" }}>
            {time}
          </p>
          <p className="text-[10px] capitalize tracking-wide" style={{ color: "#6b7280" }}>
            {date}
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-6 shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-2xl flex items-center justify-center transition-colors hover:bg-white/5"
          style={{ background: "#1e1e1e", color: "#6b7280" }}
          aria-label="Notificações"
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
            style={{ background: "#4edea3", borderColor: "#0f0f0f" }}
          />
        </button>

        {/* User card */}
        <button
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl transition-colors hover:bg-white/5"
          style={{ background: "#1e1e1e" }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
            style={{ background: "linear-gradient(135deg,#4edea3,#10b981)", color: "#003824" }}
          >
            GR
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold leading-tight" style={{ color: "#e5e2e1" }}>
              Guilherme
            </p>
            <p className="text-[10px]" style={{ color: "#6b7280" }}>
              Administrador
            </p>
          </div>
        </button>

      </div>
    </header>
  );
}
