"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, CheckCheck, X, TrendingUp, FileText, AlertTriangle, CreditCard, Wallet, Info } from "lucide-react";
import { useAuth } from "@/shared/AuthContext";
import { notificacoesService, type Notificacao } from "@/features/notificacoes/notificacoesService";
import { toast } from "sonner";

export default function Header() {
  const { usuario, empresa } = useAuth();
  const [now, setNow] = useState(new Date());
  const [bellHovered, setBellHovered] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notificacao[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const loadNotifs = async () => {
    if (!empresa?.id) return;
    try {
      const data = await notificacoesService.listar();
      setNotifications(data.notificacoes);
      setUnreadCount(data.naoLidas);
    } catch (error) {
      console.error("Erro ao carregar notificações", error);
    }
  };

  useEffect(() => {
    loadNotifs();
    const id = setInterval(loadNotifs, 30_000); // refresh every 30s
    return () => clearInterval(id);
  }, [empresa?.id]);

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

  const handleRead = async (notif: Notificacao) => {
    if (notif.lida) return;
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, lida: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await notificacoesService.marcarComoLida(notif.id);
    } catch (e) {
      loadNotifs();
    }
  };

  const markAllRead = () => {
    notifications.forEach((n) => {
      if (!n.lida) handleRead(n);
    });
  };

  const iniciaisUsuario = usuario?.nome
    ? usuario.nome.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "US";
  const primeiroNome = usuario?.nome
    ? usuario.nome.split(" ")[0]
    : null;

  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <header
      className="hidden md:flex h-16 shrink-0 items-center justify-between px-6 z-30 sticky top-0"
      style={{
        background: "rgba(13,13,13,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Search */}
      <div className="relative group">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#4edea3] transition-colors"
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

              <div className="overflow-y-auto" style={{ maxHeight: "340px" }}>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">Nenhuma notificação</div>
                ) : (
                  notifications.map((n) => {
                    const Icon = Info;
                    return (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] cursor-pointer border-b"
                        style={{
                          borderColor: "rgba(255,255,255,0.04)",
                          background: !n.lida ? "rgba(78,222,163,0.03)" : "transparent",
                        }}
                        onClick={() => handleRead(n)}
                      >
                        <div
                          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
                          style={{ background: "#4edea318" }}
                        >
                          <Icon size={14} style={{ color: "#4edea3" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className="text-xs font-semibold leading-tight"
                              style={{ color: !n.lida ? "#e5e2e1" : "#9ca3af" }}
                            >
                              {n.titulo}
                            </p>
                            {!n.lida && (
                              <span
                                className="shrink-0 w-1.5 h-1.5 rounded-full mt-1"
                                style={{ background: "#4edea3" }}
                              />
                            )}
                          </div>
                          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "#6b7280" }}>
                            {n.mensagem}
                          </p>
                          <p className="text-[10px] mt-1" style={{ color: "#4b5563" }}>
                            {new Date(n.data_criacao).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
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
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-cover bg-center bg-no-repeat"
            style={
              usuario?.foto_url 
                ? { backgroundImage: `url(${usuario.foto_url})` }
                : { background: "linear-gradient(135deg,#4edea3,#10b981)", color: "#003824" }
            }
          >
            {!usuario?.foto_url && iniciaisUsuario}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold leading-tight" style={{ color: "#e5e2e1" }}>
              {primeiroNome || "Carregando..."}
            </p>
            <p className="text-[10px]" style={{ color: "#6b7280" }}>
              {usuario?.cargo || "Usuário"}
            </p>
          </div>
        </button>

      </div>
    </header>
  );
}
