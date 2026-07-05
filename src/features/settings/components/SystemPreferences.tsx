"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SelectField, Toggle, SettingsCard, SectionHeader, SaveButton, useSave } from "./settingsUi";

export function SystemPreferences() {
  const [language, setLanguage] = useState("pt_br");
  const [notifs, setNotifs] = useState({
    email: true,
    push: true,
    relatorio: false,
    alerta: true,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("@contaup:system_prefs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.notifs) setNotifs(parsed.notifs);
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("@contaup:system_prefs", JSON.stringify({ language, notifs }));
  };

  const { state, save } = useSave(handleSave);

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs((n) => ({ ...n, [key]: !n[key] }));

  const NOTIF_LABELS: {
    key: keyof typeof notifs;
    label: string;
    sub: string;
  }[] = [
    {
      key: "email",
      label: "Notificações por e-mail",
      sub: "Receba resumos e alertas no seu e-mail",
    },
    {
      key: "push",
      label: "Notificações push",
      sub: "Alertas em tempo real no navegador",
    },
    {
      key: "relatorio",
      label: "Relatórios automáticos",
      sub: "Envio semanal de relatório financeiro",
    },
    {
      key: "alerta",
      label: "Alertas de vencimento",
      sub: "Aviso antes de contas a pagar vencerem",
    },
    {
      key: "marketing",
      label: "Novidades e atualizações",
      sub: "Comunicados sobre novos recursos do sistema",
    },
  ];

  return (
    <SettingsCard>
      <SectionHeader
        icon={SlidersHorizontal}
        title="Preferências do Sistema"
        subtitle="Tema, idioma e controle de notificações"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <SelectField
          label="Idioma"
          value={language}
          onChange={setLanguage}
          options={[
            { label: "Português (Brasil)", value: "pt_br" },
            { label: "English (US)", value: "en_us" },
            { label: "Español", value: "es" },
          ]}
        />
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
        Notificações
      </p>
      <div className="flex flex-col gap-1">
        {NOTIF_LABELS.map(({ key, label, sub }) => (
          <div
            key={key}
            className="flex items-center justify-between py-3 px-4 rounded-2xl transition-colors hover:bg-white/2"
          >
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-gray-500">{sub}</p>
            </div>
            <Toggle checked={notifs[key]} onChange={() => toggleNotif(key)} />
          </div>
        ))}
      </div>
      <SaveButton state={state} onClick={save} />
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// SEÇÃO 4 — SEGURANÇA & PRIVACIDADE
