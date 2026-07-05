"use client";

import { toast } from "sonner";

import {
  User, Building2, SlidersHorizontal, ShieldCheck, Wallet,
  Check, FileText, ArrowRight, Info, Download, UserX,
} from "lucide-react";
import { SettingsCard, SectionHeader } from "./settingsUi";

export function LgpdSettings() {
  const rights = [
    { icon: Info, title: "Acesso aos dados", desc: "Você pode solicitar uma cópia completa de todos os dados pessoais que armazenamos sobre você." },
    { icon: Download, title: "Portabilidade", desc: "Exporte seus dados em formato legível para transferi-los a outro serviço." },
    { icon: Check, title: "Correção", desc: "Solicite a correção de dados pessoais incompletos, inexatos ou desatualizados." },
    { icon: UserX, title: "Exclusão", desc: "Solicite a exclusão definitiva dos seus dados pessoais da nossa plataforma." },
  ];

  return (
    <SettingsCard>
      <SectionHeader
        icon={FileText}
        title="LGPD — Proteção de Dados"
        subtitle="Seus direitos sob a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)"
      />

      {/* Aviso informativo */}
      <div
        className="flex gap-3 p-4 rounded-2xl mb-6"
        style={{ background: "#4edea308", border: "1px solid #4edea320" }}
      >
        <Info size={16} className="shrink-0 mt-0.5" style={{ color: "#4edea3" }} />
        <p className="text-xs leading-relaxed" style={{ color: "#a3a3a3" }}>
          A ContaUp respeita sua privacidade e garante o exercício dos seus direitos previstos
          na LGPD. Todos os pedidos são analisados em até <strong style={{ color: "#e5e2e1" }}>15 dias úteis</strong>.
        </p>
      </div>

      {/* Direitos */}
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>
        Seus Direitos
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {rights.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex gap-3 p-4 rounded-2xl"
            style={{ background: "#242424" }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#4edea312" }}
            >
              <Icon size={15} style={{ color: "#4edea3" }} />
            </div>
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "#e5e2e1" }}>{title}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: "#6b7280" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA — exclusão de dados */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl"
        style={{ background: "#242424", border: "1px solid #2a2a2a" }}
      >
        <div className="flex gap-3 items-start">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#f4375418" }}
          >
            <UserX size={16} style={{ color: "#f43754" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>
              Solicitar exclusão dos meus dados
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
              Solicite a remoção permanente de todas as suas informações pessoais da plataforma.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            toast.success("Solicitação de exclusão de dados enviada com sucesso. Nossa equipe entrará em contato em até 48 horas.");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-opacity hover:opacity-80 cursor-pointer"
          style={{ background: "#f4375420", color: "#f43754" }}
        >
          Solicitar exclusão
          <ArrowRight size={13} />
        </button>
      </div>
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// TABS DE NAVEGAÇÃO INTERNA
// ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "company", label: "Empresa", icon: Building2 },
  { id: "system", label: "Sistema", icon: SlidersHorizontal },
  { id: "security", label: "Segurança", icon: ShieldCheck },
  { id: "financial", label: "Financeiro", icon: Wallet },
  { id: "lgpd", label: "LGPD", icon: FileText },
];

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
