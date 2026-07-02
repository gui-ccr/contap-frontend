"use client";

import { useState } from "react";
import { User, Building2, SlidersHorizontal, ShieldCheck, Wallet, FileText } from "lucide-react";
import { ProfileSettings } from "./components/ProfileSettings";
import { CompanySettings } from "./components/CompanySettings";
import { SystemPreferences } from "./components/SystemPreferences";
import { SecuritySettings } from "./components/SecuritySettings";
import { FinancialSettings } from "./components/FinancialSettings";
import { LgpdSettings } from "./components/LgpdSettings";

const TABS = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "company", label: "Empresa", icon: Building2 },
  { id: "system", label: "Sistema", icon: SlidersHorizontal },
  { id: "security", label: "Segurança", icon: ShieldCheck },
  { id: "financial", label: "Financeiro", icon: Wallet },
  { id: "lgpd", label: "LGPD", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CONTENT: Record<TabId, React.ComponentType> = {
  profile: ProfileSettings,
  company: CompanySettings,
  system: SystemPreferences,
  security: SecuritySettings,
  financial: FinancialSettings,
  lgpd: LgpdSettings,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const ActiveContent = CONTENT[activeTab];

  const tabClass = (id: TabId) =>
    `flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
      activeTab === id
        ? "bg-primary text-on-primary"
        : "text-on-surface-variant/60 hover:text-on-surface"
    }`;

  return (
    <div className="px-4 md:px-8 py-6 md:py-8">
      <div className="mb-6 md:mb-8 max-w-3xl">
        <p className="text-label-sm uppercase tracking-widest text-primary">
          ContaUp · Administração
        </p>
        <h1 className="text-headline-md tracking-tight mt-0.5 text-on-surface">
          Configurações
        </h1>
      </div>

      {/* Abas: grid 2 colunas no mobile, linha no desktop */}
      <div className="mb-6 md:mb-8 max-w-3xl">
        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl md:hidden bg-surface-container">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={tabClass(id)}>
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="hidden md:flex gap-1 p-1 rounded-2xl w-fit bg-surface-container">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={tabClass(id)}>
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl">
        <ActiveContent />
      </div>
    </div>
  );
}
