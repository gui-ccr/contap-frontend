"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowLeft,
  UserX,
  AlertTriangle,
  Check,
  Loader2,
  ShieldAlert,
  FileText,
  Database,
  Receipt,
} from "lucide-react";

type Step = "confirm" | "loading" | "done";

const DATA_ITEMS = [
  { icon: FileText, label: "Dados pessoais", desc: "Nome, e-mail, CPF e informações de perfil" },
  { icon: Database, label: "Dados da empresa", desc: "CNPJ, razão social e configurações corporativas" },
  { icon: Receipt, label: "Histórico financeiro", desc: "Lançamentos, relatórios e movimentações registradas" },
  { icon: ShieldAlert, label: "Dados de acesso", desc: "Histórico de login, sessões e chaves de API" },
];

export default function SolicitarExclusaoDadosPage() {
  const [step, setStep] = useState<Step>("confirm");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);

  const canSubmit = email.trim() !== "" && agreed;

  function handleSubmit() {
    if (!canSubmit) return;
    setStep("loading");
    setTimeout(() => setStep("done"), 2200);
  }

  if (step === "done") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "#4edea318" }}
          >
            <Check size={28} style={{ color: "#4edea3" }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#e5e2e1" }}>
            Solicitação recebida
          </h2>
          <p className="text-sm mb-1" style={{ color: "#6b7280" }}>
            Seu pedido de exclusão foi registrado com sucesso.
          </p>
          <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
            Nossa equipe analisará a solicitação e responderá em até{" "}
            <span style={{ color: "#e5e2e1" }}>15 dias úteis</span> no e-mail informado.
          </p>
          <Link
            href={"/configuracoes" as Route}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "#1e1e1e", color: "#e5e2e1" }}
          >
            <ArrowLeft size={14} />
            Voltar para Configurações
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-2xl">
      {/* Breadcrumb / voltar */}
      <Link
        href={"/configuracoes" as Route}
        className="inline-flex items-center gap-2 text-xs font-medium mb-6 transition-opacity hover:opacity-70"
        style={{ color: "#6b7280" }}
      >
        <ArrowLeft size={14} />
        Voltar para Configurações
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "#f4375418" }}
        >
          <UserX size={18} style={{ color: "#f43754" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "#e5e2e1" }}>
            Solicitar Exclusão de Dados
          </h1>
          <p className="text-xs" style={{ color: "#6b7280" }}>
            Conforme art. 18, VI da Lei nº 13.709/2018 (LGPD)
          </p>
        </div>
      </div>

      <p className="text-sm mb-8 leading-relaxed" style={{ color: "#6b7280" }}>
        Ao prosseguir, você solicita a exclusão permanente e irrecuperável de todos os seus
        dados pessoais armazenados pela ContaUp. Esta ação não pode ser desfeita.
      </p>

      {/* O que será excluído */}
      <div className="rounded-3xl p-6 mb-5" style={{ background: "#1e1e1e" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>
          O que será excluído
        </p>
        <div className="flex flex-col gap-3">
          {DATA_ITEMS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "#f4375412" }}
              >
                <Icon size={14} style={{ color: "#f43754" }} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#e5e2e1" }}>{label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#6b7280" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aviso */}
      <div
        className="flex gap-3 p-4 rounded-2xl mb-6"
        style={{ background: "#f4375410", border: "1px solid #f4375428" }}
      >
        <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: "#f43754" }} />
        <p className="text-xs leading-relaxed" style={{ color: "#a3a3a3" }}>
          A exclusão é <strong style={{ color: "#e5e2e1" }}>permanente e irreversível</strong>.
          Dados utilizados para cumprir obrigações legais ou fiscais podem ser retidos pelo
          prazo mínimo exigido por lei antes da exclusão definitiva.
        </p>
      </div>

      {/* Formulário */}
      <div className="rounded-3xl p-6" style={{ background: "#1e1e1e" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>
          Confirme sua solicitação
        </p>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
              E-mail cadastrado
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 rounded-2xl text-sm outline-none transition-all"
              style={{ background: "#242424", color: "#e5e2e1" }}
            />
            <p className="text-[11px]" style={{ color: "#6b7280" }}>
              Informe o e-mail da conta para confirmar sua identidade.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
              Motivo (opcional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo da solicitação..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-2xl text-sm outline-none resize-none transition-all"
              style={{ background: "#242424", color: "#e5e2e1" }}
            />
          </div>
        </div>

        {/* Checkbox de confirmação */}
        <button
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-3 text-left mb-6 cursor-pointer w-full"
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all"
            style={{
              background: agreed ? "#f43754" : "transparent",
              border: `2px solid ${agreed ? "#f43754" : "#3a3a3a"}`,
            }}
          >
            {agreed && <Check size={11} color="#fff" strokeWidth={3} />}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#a3a3a3" }}>
            Entendo que a exclusão é <strong style={{ color: "#e5e2e1" }}>permanente e irreversível</strong>{" "}
            e que não será possível recuperar meus dados após a conclusão do processo.
          </p>
        </button>

        {/* Botão */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || step === "loading"}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: "#f43754", color: "#fff" }}
        >
          {step === "loading" ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Enviando solicitação...
            </>
          ) : (
            <>
              <UserX size={15} />
              Confirmar solicitação de exclusão
            </>
          )}
        </button>
      </div>
    </div>
  );
}
