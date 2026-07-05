"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Smartphone, LogOut } from "lucide-react";
import { Toggle, SettingsCard, SectionHeader, SaveButton, useSave } from "./settingsUi";
import { apiClient } from "@/shared/api";
import { toast } from "sonner";

const INITIAL_SESSIONS = [
  { id: 1, device: "Chrome — Windows 11", location: "São Paulo, BR", time: "Agora", current: true },
  { id: 2, device: "Safari — iPhone 15", location: "São Paulo, BR", time: "2h atrás", current: false },
  { id: 3, device: "Firefox — macOS", location: "Campinas, BR", time: "Ontem, 14:30", current: false },
];

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("@contaup:security_prefs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.twoFactor !== undefined) setTwoFactor(parsed.twoFactor);
      } catch (e) {}
    }

    async function fetchSessoes() {
      try {
        const data = await apiClient.get<any[]>("/auth/sessoes");
        setHistory(data);
      } catch (err) {
        console.error("Erro ao carregar sessões", err);
      } finally {
        setLoading(false);
      }
    }

    void fetchSessoes();
  }, []);

  const handleSave = () => {
    localStorage.setItem("@contaup:security_prefs", JSON.stringify({ twoFactor }));
  };

  const { state, save } = useSave(handleSave);

  const handleDesconectarTodas = async () => {
    try {
      if (!confirm("Tem certeza que deseja desconectar de todos os dispositivos? Você precisará fazer login novamente.")) return;
      await apiClient.post("/auth/sessoes/desconectar-todas");
      toast.success("Todos os dispositivos foram desconectados com sucesso!");
      window.location.href = "/login";
    } catch (err: any) {
      toast.error(err.message || "Erro ao desconectar dispositivos");
    }
  };

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

      <div className="flex flex-col gap-2">
        {loading ? (
          <p className="text-sm text-gray-500 py-4">Carregando histórico...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhum login registrado.</p>
        ) : (
          history.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between px-4 py-3 rounded-2xl"
              style={{ background: "#242424" }}
            >
              <div>
                <p className="text-xs font-semibold text-white">
                  {new Date(l.time).toLocaleString("pt-BR")}
                </p>
                <p className="text-[10px] text-gray-500">
                  {l.device} · {l.location}
                </p>
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
          ))
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleDesconectarTodas}
          className="w-full sm:w-auto text-xs font-semibold px-4 py-2.5 rounded-2xl hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center gap-2"
          style={{ background: "#f4375420", color: "#f43754" }}
        >
          <LogOut size={13} />
          Desconectar de Todos os Dispositivos
        </button>
      </div>
      
      <SaveButton state={state} onClick={save} />
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// SEÇÃO 5 — CONFIGURAÇÕES FINANCEIRAS
