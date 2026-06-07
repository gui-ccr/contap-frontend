"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, CheckCheck, X, TrendingUp, FileText, AlertTriangle, CreditCard, Wallet } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    icon: CreditCard,
    iconColor: "#4edea3",
    iconBg: "#4edea318",
    title: "Novo lançamento registrado",
    body: "Conta Corrente BB — entrada de R$ 4.850,00",
    time: "2 min atrás",
    unread: true,
  },
  {
    id: 2,
    icon: FileText,
    iconColor: "#3b82f6",
    iconBg: "#3b82f618",
    title: "Relatório mensal disponível",
    body: "Balanço Patrimonial de Junho/2026 gerado",
    time: "15 min atrás",
    unread: true,
  },
  {
    id: 3,
    icon: AlertTriangle,
    iconColor: "#f59e0b",
    iconBg: "#f59e0b18",
    title: "Vencimento próximo",
    body: "Fatura Fornecedor Alfa vence em 2 dias",
    time: "1 hora atrás",
    unread: true,
  },
  {
    id: 4,
    icon: TrendingUp,
    iconColor: "#a855f7",
    iconBg: "#a855f718",
    title: "Meta de receita atingida",
    body: "Receita mensal superou R$ 50.000,00",
    time: "3 horas atrás",
    unread: false,
  },
  {
    id: 5,
    icon: Wallet,
    iconColor: "#ec4899",
    iconBg: "#ec489918",
    title: "Alerta de saldo baixo",
    body: "Caixa com saldo abaixo do limite configurado",
    time: "Ontem, 18:42",
    unread: false,
  },
];

export default function Header() {
  const [now, setNow] = useState(new Date());
  const [bellHovered, setBellHovered] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current?.contains(e.target as Node) ||
        buttonRef.current?.contains(e.target as Node)
      )
        return;
      setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

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
        <div className="relative">
          <button
            ref={buttonRef}
            onMouseEnter={() => setBellHovered(true)}
            onMouseLeave={() => setBellHovered(false)}
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              background: bellHovered || notifOpen ? "#4edea318" : "#1e1e1e",
              color: bellHovered || notifOpen ? "#4edea3" : "#6b7280",
              border: `1px solid ${bellHovered || notifOpen ? "#4edea340" : "transparent"}`,
            }}
            aria-label="Notificações"
          >
            <Bell
              size={16}
              fill={bellHovered || notifOpen ? "#4edea3" : "none"}
              style={{ transition: "fill 0.15s" }}
            />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
                style={{ background: "#4edea3", borderColor: "#0f0f0f" }}
              />
            )}
          </button>

          {/* Notification panel */}
          {notifOpen && (
            <div
              ref={panelRef}
              className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl overflow-hidden"
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.08)",
                zIndex: 50,
              }}
            >
              {/* Header do painel */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>
                    Notificações
                  </p>
                  {unreadCount > 0 && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "#4edea320", color: "#4edea3" }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
                      style={{ color: "#4edea3" }}
                    >
                      <CheckCheck size={12} />
                      Marcar todas
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-white/5"
                    style={{ color: "#6b7280" }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Lista */}
              <div className="overflow-y-auto" style={{ maxHeight: "340px" }}>
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] cursor-pointer border-b"
                      style={{
                        borderColor: "rgba(255,255,255,0.04)",
                        background: n.unread ? "rgba(78,222,163,0.03)" : "transparent",
                      }}
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x))
                        )
                      }
                    >
                      <div
                        className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
                        style={{ background: n.iconBg }}
                      >
                        <Icon size={14} style={{ color: n.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className="text-xs font-semibold leading-tight"
                            style={{ color: n.unread ? "#e5e2e1" : "#9ca3af" }}
                          >
                            {n.title}
                          </p>
                          {n.unread && (
                            <span
                              className="shrink-0 w-1.5 h-1.5 rounded-full mt-1"
                              style={{ background: "#4edea3" }}
                            />
                          )}
                        </div>
                        <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "#6b7280" }}>
                          {n.body}
                        </p>
                        <p className="text-[10px] mt-1" style={{ color: "#4b5563" }}>
                          {n.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  className="w-full text-[11px] font-medium py-1.5 rounded-xl transition-colors cursor-pointer hover:bg-white/5"
                  style={{ color: "#6b7280" }}
                >
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

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
