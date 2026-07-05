"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Smartphone, LogOut } from "lucide-react";
import { Toggle, SettingsCard, SectionHeader, SaveButton, useSave } from "./settingsUi";

const INITIAL_SESSIONS = [
  { id: 1, device: "Chrome — Windows 11", location: "São Paulo, BR", time: "Agora", current: true },
  { id: 2, device: "Safari — iPhone 15", location: "São Paulo, BR", time: "2h atrás", current: false },
  { id: 3, device: "Firefox — macOS", location: "Campinas, BR", time: "Ontem, 14:30", current: false },
];

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  useEffect(() => {
    const saved = localStorage.getItem("@contaup:security_prefs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.twoFactor !== undefined) setTwoFactor(parsed.twoFactor);
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("@contaup:security_prefs", JSON.stringify({ twoFactor }));
  };

  const { state, save } = useSave(handleSave);

  const handleEncerrarSessao = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const loginHistory = [
    { date: "28/05 — 09:14", device: "Chrome · Windows", status: "ok" },
    { date: "27/05 — 18:02", device: "iPhone · Safari", status: "ok" },
    { date: "26/05 — 11:47", device: "Firefox · macOS", status: "fail" },
  ];

  return (
    <SettingsCard>
      <SectionHeader
        icon={ShieldCheck}
        title="Segurança & Privacidade"
        subtitle="Proteção da conta, sessões e autenticação"
      />
      <div
        className="flex items-center justify-between p-4 rounded-2xl mb-6"
        style={{ background: "#242424" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: twoFactor ? "#10b98120" : "#ffffff0a" }}
          >
            <Smartphone size={16} color={twoFactor ? "#10b981" : "#6b7280"} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Autenticação de dois fatores (2FA)
            </p>
            <p className="text-xs text-gray-500">
              {twoFactor
                ? "Ativo — via aplicativo autenticador"
                : "Inativo — sua conta está menos protegida"}
            </p>
          </div>
        </div>
        <Toggle checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Sessões Ativas
      </p>
      <div className="flex flex-col gap-2 mb-6">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{ background: "#242424" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: s.current ? "#10b981" : "#4b5563" }}
              />
              <div>
                <p className="text-xs font-semibold text-white">{s.device}</p>
                <p className="text-[10px] text-gray-500">
                  {s.location} · {s.time}
                </p>
              </div>
            </div>
            {s.current ? (
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-xl"
                style={{ background: "#10b98118", color: "#10b981" }}
              >
                Este dispositivo
              </span>
            ) : (
              <button
                onClick={() => handleEncerrarSessao(s.id)}
                className="text-[10px] font-semibold px-3 py-1 rounded-xl hover:opacity-70 transition-opacity cursor-pointer"
                style={{ background: "#f4375420", color: "#f43754" }}
              >
                <LogOut size={11} className="inline mr-1" />
                Encerrar
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Histórico de Login
      </p>
      <div className="flex flex-col gap-2">
        {loginHistory.map((l, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{ background: "#242424" }}
          >
            <div>
              <p className="text-xs font-semibold text-white">{l.date}</p>
              <p className="text-[10px] text-gray-500">{l.device}</p>
            </div>
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-xl"
              style={{
                background: l.status === "ok" ? "#10b98118" : "#f4375418",
                color: l.status === "ok" ? "#10b981" : "#f43754",
              }}
            >
              {l.status === "ok" ? "✓ Sucesso" : "✗ Falha"}
            </span>
          </div>
        ))}
      </div>
      
      <SaveButton state={state} onClick={save} />
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// SEÇÃO 5 — CONFIGURAÇÕES FINANCEIRAS
