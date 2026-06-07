/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  User,
  Building2,
  SlidersHorizontal,
  ShieldCheck,
  Wallet,
  Camera,
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  Loader2,
  Smartphone,
  LogOut,
  Key,
  Plus,
  Trash2,
  Copy,
  LayoutDashboard,
  TrendingUp,
  ArrowLeftRight,
  AlertCircle,
  DollarSign,
  ChevronRight,
  Settings,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────

type SaveState = "idle" | "loading" | "saved";

// ─────────────────────────────────────────────────────────────
// COMPONENTES UTILITÁRIOS DE UI
// ─────────────────────────────────────────────────────────────

/** Input estilizado padrão ContaUp */
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2.5 rounded-2xl text-sm text-white placeholder-gray-600 outline-none transition-all focus:ring-1 focus:ring-[#10b981]/50 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#242424" }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

/** Select estilizado */
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl text-sm text-white outline-none appearance-none cursor-pointer transition-all focus:ring-1 focus:ring-[#10b981]/50"
          style={{ background: "#242424" }}
        >
          {options.map((o) => (
            <option
              key={o.value}
              value={o.value}
              style={{ background: "#242424" }}
            >
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        />
      </div>
    </div>
  );
}

/** Toggle switch */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 cursor-pointer"
      style={{ background: checked ? "#10b981" : "#333" }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

/** Card container de seção */
function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl p-6 transition-all"
      style={{ background: "#1e1e1e" }}
    >
      {children}
    </div>
  );
}

/** Cabeçalho de seção com ícone */
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: "#10b98118" }}
      >
        <Icon size={18} color="#10b981" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

/** Botão salvar com estados idle / loading / saved */
function SaveButton({
  state,
  onClick,
}: {
  state: SaveState;
  onClick: () => void;
}) {
  return (
    <div
      className="flex justify-end mt-6 pt-5"
      style={{ borderTop: "1px solid #2a2a2a" }}
    >
      <button
        onClick={onClick}
        disabled={state === "loading"}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-lg min-w-40 justify-center  cursor-pointer"
        style={{
          background:
            state === "saved"
              ? "#059669"
              : "linear-gradient(135deg,#10b981,#059669)",
        }}
      >
        {state === "loading" && <Loader2 size={15} className="animate-spin" />}
        {state === "saved" && <Check size={15} />}
        {state === "loading"
          ? "Salvando..."
          : state === "saved"
            ? "Salvo!"
            : "Salvar alterações"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOOK: simula save com feedback visual
// ─────────────────────────────────────────────────────────────
function useSave() {
  const [state, setState] = useState<SaveState>("idle");
  const save = () => {
    setState("loading");
    setTimeout(() => {
      setState("saved");
      setTimeout(() => setState("idle"), 2000);
    }, 1400);
  };
  return { state, save };
}

// ─────────────────────────────────────────────────────────────
// SEÇÃO 1 — PERFIL DO USUÁRIO
// ─────────────────────────────────────────────────────────────
function ProfileSettings() {
  const [name, setName] = useState("João Dias");
  const [role, setRole] = useState("Administrador");
  const [email, setEmail] = useState("joao.dias@contaup.com.br");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { state, save } = useSave();

  return (
    <SettingsCard>
      <SectionHeader
        icon={User}
        title="Perfil do Usuário"
        subtitle="Suas informações pessoais e credenciais de acesso"
      />

      <div
        className="flex items-center gap-5 mb-6 pb-6"
        style={{ borderBottom: "1px solid #2a2a2a" }}
      >
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#10b981,#059669)",
              color: "#fff",
            }}
          >
            JD
          </div>
          <button
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: "#10b981" }}
          >
            <Camera size={11} color="#fff" />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Foto de Perfil</p>
          <p className="text-xs text-gray-500 mt-0.5">
            PNG, JPG ou WEBP. Máx. 2MB.
          </p>
          <button
            className="text-xs mt-2 font-medium transition-opacity hover:opacity-70 cursor-pointer"
            style={{ color: "#10b981" }}
          >
            Fazer upload →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field
          label="Nome completo"
          value={name}
          onChange={setName}
          placeholder="Seu nome"
        />
        <Field
          label="Cargo / Função"
          value={role}
          onChange={setRole}
          placeholder="Ex: Financeiro"
        />
        <Field
          label="E-mail"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
          type="email"
        />
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 mt-5">
        Alterar Senha
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Nova senha"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="••••••••"
        />
        <Field
          label="Confirmar senha"
          value={confirm}
          onChange={setConfirm}
          type="password"
          placeholder="••••••••"
        />
      </div>

      <SaveButton state={state} onClick={save} />
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// SEÇÃO 2 — CONTA / EMPRESA
// ─────────────────────────────────────────────────────────────
function CompanySettings() {
  const [company, setCompany] = useState("ContaUp Soluções Ltda.");
  const [cnpj, setCnpj] = useState("12.345.678/0001-99");
  const [timezone, setTimezone] = useState("america_sao_paulo");
  const [currency, setCurrency] = useState("brl");
  const { state, save } = useSave();

  return (
    <SettingsCard>
      <SectionHeader
        icon={Building2}
        title="Conta & Empresa"
        subtitle="Dados corporativos e configurações regionais"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Nome da empresa"
          value={company}
          onChange={setCompany}
          placeholder="Razão social"
        />
        <Field
          label="CNPJ"
          value={cnpj}
          onChange={setCnpj}
          placeholder="00.000.000/0000-00"
        />
        <SelectField
          label="Fuso horário"
          value={timezone}
          onChange={setTimezone}
          options={[
            { label: "Brasília (GMT-3)", value: "america_sao_paulo" },
            { label: "Manaus (GMT-4)", value: "america_manaus" },
            { label: "Recife (GMT-3)", value: "america_recife" },
            { label: "Porto Velho (GMT-4)", value: "america_porto_velho" },
          ]}
        />
        <SelectField
          label="Moeda padrão"
          value={currency}
          onChange={setCurrency}
          options={[
            { label: "Real Brasileiro (R$)", value: "brl" },
            { label: "Dólar Americano ($)", value: "usd" },
            { label: "Euro (€)", value: "eur" },
          ]}
        />
      </div>
      <SaveButton state={state} onClick={save} />
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// SEÇÃO 3 — PREFERÊNCIAS DO SISTEMA
// ─────────────────────────────────────────────────────────────
function SystemPreferences() {
  const [language, setLanguage] = useState("pt_br");
  const [notifs, setNotifs] = useState({
    email: true,
    push: true,
    relatorio: false,
    alerta: true,
    marketing: false,
  });
  const { state, save } = useSave();

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
// ─────────────────────────────────────────────────────────────
function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);

  const sessions = [
    {
      id: 1,
      device: "Chrome — Windows 11",
      location: "São Paulo, BR",
      time: "Agora",
      current: true,
    },
    {
      id: 2,
      device: "Safari — iPhone 15",
      location: "São Paulo, BR",
      time: "2h atrás",
      current: false,
    },
    {
      id: 3,
      device: "Firefox — macOS",
      location: "Campinas, BR",
      time: "Ontem, 14:30",
      current: false,
    },
  ];

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
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// SEÇÃO 5 — CONFIGURAÇÕES FINANCEIRAS
// ─────────────────────────────────────────────────────────────
function FinancialSettings() {
  const [closing, setClosing] = useState("ultimo_dia");
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "Integração Banco X",
      key: "sk_live_4Xk9••••••••••3mQp",
      created: "12/04/2025",
    },
    {
      id: 2,
      name: "ERP Interno",
      key: "sk_live_7Lp2••••••••••9nWr",
      created: "01/03/2025",
    },
  ]);
  const [categories, setCategories] = useState([
    "Receita Operacional",
    "Despesas Administrativas",
    "Folha de Pagamento",
    "Tecnologia",
    "Marketing",
    "Impostos",
  ]);
  const [newCat, setNewCat] = useState("");
  const { state, save } = useSave();

  const addCategory = () => {
    if (newCat.trim()) {
      setCategories([...categories, newCat.trim()]);
      setNewCat("");
    }
  };
  const removeCategory = (i: number) =>
    setCategories(categories.filter((_, idx) => idx !== i));
  const removeKey = (id: number) =>
    setApiKeys(apiKeys.filter((k) => k.id !== id));

  return (
    <SettingsCard>
      <SectionHeader
        icon={Wallet}
        title="Configurações Financeiras"
        subtitle="Categorias, ciclo contábil e integrações via API"
      />
      <SelectField
        label="Ciclo de Fechamento"
        value={closing}
        onChange={setClosing}
        options={[
          { label: "Último dia do mês", value: "ultimo_dia" },
          { label: "Dia 15 de cada mês", value: "dia_15" },
          { label: "Dia 1 de cada mês", value: "dia_1" },
          { label: "Personalizado", value: "custom" },
        ]}
      />
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-6 mb-3">
        Categorias Padrão
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {categories.map((c, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl"
            style={{ background: "#242424", color: "#d1d5db" }}
          >
            {c}
            <button
              onClick={() => removeCategory(i)}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={11} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          placeholder="Nova categoria..."
          className="flex-1 px-4 py-2.5 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-[#10b981]/50"
          style={{ background: "#242424" }}
        />
        <button
          onClick={addCategory}
          className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-white hover:opacity-80 transition-opacity cursor-pointer"
          style={{ background: "#10b981" }}
        >
          <Plus size={15} />
        </button>
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-6 mb-3">
        Integrações — API Keys
      </p>
      <div className="flex flex-col gap-2 mb-3">
        {apiKeys.map((k) => (
          <div
            key={k.id}
            className="flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{ background: "#242424" }}
          >
            <div>
              <p className="text-xs font-semibold text-white">{k.name}</p>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                {k.key}
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                Criado em {k.created}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-7 h-7 rounded-xl flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
                style={{ background: "#10b98118" }}
              >
                <Copy size={12} color="#10b981" />
              </button>
              <button
                onClick={() => removeKey(k.id)}
                className="w-7 h-7 rounded-xl flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
                style={{ background: "#f4375418" }}
              >
                <Trash2 size={12} color="#f43754" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-2xl hover:opacity-70 transition-opacity cursor-pointer"
        style={{ background: "#10b98118", color: "#10b981" }}
      >
        <Key size={13} /> Gerar nova API Key
      </button>
      <SaveButton state={state} onClick={save} />
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// NAV ITEMS — com href para navegação real via Link
// ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    id: "dashboard",
    href: "/dashboard",
  },
  {
    icon: TrendingUp,
    label: "Fluxo de Caixa",
    id: "cashflow",
    href: "/cashflow",
  },
  {
    icon: ArrowLeftRight,
    label: "Movimentações",
    id: "transactions",
    href: "/transactions",
  },
  { icon: AlertCircle, label: "Pendências", id: "pending", href: "/pending" },
  { icon: Settings, label: "Configurações", id: "settings", href: "/settings" },
];

// ─────────────────────────────────────────────────────────────
// SIDEBAR — usa usePathname para detectar rota ativa
// ─────────────────────────────────────────────────────────────
function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 px-4 py-6 justify-between"
      style={{ background: "#0f0f0f", borderRight: "1px solid #1f1f1f" }}
    >
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 mb-10">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
          >
            <DollarSign size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight leading-none">
              Conta<span style={{ color: "#10b981" }}>Up</span>
            </span>
            <p className="text-[10px] text-gray-600 mt-0.5 font-medium">
              Gestão Financeira
            </p>
          </div>
        </div>

        {/* Nav — Link com isActive baseado no pathname real */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ icon: Icon, label, id, href }) => {
            const isActive = pathname === href;
            
            return (
              <Link
                key={id}
                href={href as Route}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive ? "#10b98118" : "transparent",
                  color: isActive ? "#10b981" : "#6b7280",
                }}
              >
                <Icon size={17} />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <ChevronRight size={13} style={{ color: "#10b981" }} />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Perfil */}
      <div
        className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all"
        style={{ background: "#1a1a1a" }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            background: "linear-gradient(135deg,#10b981,#059669)",
            color: "#fff",
          }}
        >
          JD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">João Dias</p>
          <p className="text-[10px] text-gray-500 truncate">Administrador</p>
        </div>
      </div>
    </aside>
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
];

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL — ORQUESTRADOR
// ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div
      className="min-h-screen flex text-white"
      style={{ background: "#131313" }}
    >
      {/* Sidebar com navegação real */}
      <Sidebar />

      <main className="flex-1 overflow-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 font-medium">
            ContaUp · Administração
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Configurações
          </h1>
        </div>

        {/* Tabs internas */}
        <div
          className="flex gap-1 mb-8 p-1 rounded-2xl w-fit"
          style={{ background: "#1e1e1e" }}
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === id
                  ? "bg-[#10b981] text-white"
                  : "bg-transparent text-[#6b7280] hover:bg-white/2"
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo por tab */}
        <div className="max-w-3xl">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "company" && <CompanySettings />}
          {activeTab === "system" && <SystemPreferences />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "financial" && <FinancialSettings />}
        </div>
      </main>
    </div>
  );
}
