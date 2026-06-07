"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowLeft,
  Shield,
  FileText,
  AlertTriangle,
  GraduationCap,
  Copyright,
  ChevronLeft,
  ChevronRight,
  Crown,
  Monitor,
  Server,
  Database,
  TestTube,
} from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Guilherme Rodrigues",
    role: "Tech Lead & Arquiteto",
    sub: "Engenheiro de Software Full Stack",
    category: "tech-lead",
  },
  {
    name: "Davi Pereira Dutra",
    role: "Desenvolvedor Front-end",
    sub: "Interface & UX",
    category: "frontend",
  },
  {
    name: "Joao Antonio",
    role: "Desenvolvedor Front-end",
    sub: "Interface & UX",
    category: "frontend",
  },
  {
    name: "Julio Cesar",
    role: "Desenvolvedor Front-end",
    sub: "Interface & UX",
    category: "frontend",
  },
  {
    name: "Bruna Mossen Rios",
    role: "Desenvolvedora Back-end",
    sub: "Regras de Negócio & Contábil",
    category: "backend",
  },
  {
    name: "Joao Pedro Matos",
    role: "Desenvolvedor Back-end",
    sub: "Regras de Negócio & Contábil",
    category: "backend",
  },
  {
    name: "Wesley",
    role: "Desenvolvedor Back-end",
    sub: "Regras de Negócio & Contábil",
    category: "backend",
  },
  {
    name: "Thalys Souza",
    role: "DBA",
    sub: "Modelagem & Otimização de Dados",
    category: "dba",
  },
  {
    name: "Milena Ferreira da Silva",
    role: "Analista de Qualidade",
    sub: "QA & Testes Unitários",
    category: "qa",
  },
  {
    name: "Igor de Oliveira Silva",
    role: "Analista de Qualidade",
    sub: "QA & Testes Unitários",
    category: "qa",
  },
];

const ROLE_STYLES: Record<
  string,
  { color: string; bg: string; border: string; Icon: React.ElementType }
> = {
  "tech-lead": {
    color: "#a855f7",
    bg: "#a855f710",
    border: "#a855f730",
    Icon: Crown,
  },
  frontend: {
    color: "#3b82f6",
    bg: "#3b82f610",
    border: "#3b82f630",
    Icon: Monitor,
  },
  backend: {
    color: "#4edea3",
    bg: "#4edea310",
    border: "#4edea330",
    Icon: Server,
  },
  dba: {
    color: "#f97316",
    bg: "#f9731610",
    border: "#f9731630",
    Icon: Database,
  },
  qa: {
    color: "#ec4899",
    bg: "#ec489910",
    border: "#ec489930",
    Icon: TestTube,
  },
};

const MEMBERS_PER_PAGE = 2;

const TABS = [
  { id: "privacidade", label: "Política de Privacidade", icon: Shield },
  { id: "termos", label: "Termos de Serviço", icon: FileText },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold mb-3" style={{ color: "#e5e2e1" }}>
        {title}
      </h2>
      <div
        className="text-sm leading-relaxed space-y-3"
        style={{ color: "#a3a3a3" }}
      >
        {children}
      </div>
    </div>
  );
}

function PrivacidadeContent() {
  return (
    <div>
      <p className="text-sm leading-relaxed mb-8" style={{ color: "#6b7280" }}>
        Última atualização: junho de 2026. Esta Política de Privacidade descreve
        como a <strong style={{ color: "#e5e2e1" }}>TechBalance</strong> coleta,
        utiliza e protege suas informações pessoais no uso da plataforma
        ContaUp, em conformidade com a Lei Geral de Proteção de Dados (LGPD —
        Lei nº 13.709/2018).
      </p>

      <Section title="1. Quem somos">
        <p>
          A <strong style={{ color: "#e5e2e1" }}>TechBalance</strong> é a
          empresa desenvolvedora e operadora da plataforma ContaUp, solução de
          gestão financeira e contábil voltada para empresas brasileiras. Para
          fins da LGPD, atuamos como{" "}
          <strong style={{ color: "#e5e2e1" }}>controladora</strong> dos dados
          pessoais tratados por meio desta plataforma.
        </p>
      </Section>

      <Section title="2. Dados que coletamos">
        <p>Coletamos os seguintes dados pessoais:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>
            <strong style={{ color: "#e5e2e1" }}>Dados cadastrais:</strong> nome
            completo, e-mail, CPF e telefone.
          </li>
          <li>
            <strong style={{ color: "#e5e2e1" }}>Dados da empresa:</strong>{" "}
            CNPJ, razão social e dados de endereço.
          </li>
          <li>
            <strong style={{ color: "#e5e2e1" }}>Dados de uso:</strong>{" "}
            registros de acesso, logs de navegação e preferências do sistema.
          </li>
          <li>
            <strong style={{ color: "#e5e2e1" }}>Dados financeiros:</strong>{" "}
            lançamentos, contas e movimentações inseridas pelo próprio usuário.
          </li>
        </ul>
      </Section>

      <Section title="3. Finalidade do tratamento">
        <p>Utilizamos seus dados para:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Prestação dos serviços contratados e operação da plataforma;</li>
          <li>Autenticação e controle de acesso;</li>
          <li>Envio de notificações e relatórios operacionais;</li>
          <li>Cumprimento de obrigações legais e fiscais;</li>
          <li>Melhoria contínua da plataforma com base em métricas de uso.</li>
        </ul>
      </Section>

      <Section title="4. Base legal">
        <p>
          O tratamento dos seus dados é realizado com base nas seguintes
          hipóteses previstas na LGPD: execução de contrato (art. 7º, V),
          cumprimento de obrigação legal (art. 7º, II) e legítimo interesse
          (art. 7º, IX), sempre limitado ao necessário para as finalidades
          declaradas.
        </p>
      </Section>

      <Section title="5. Compartilhamento de dados">
        <p>
          Não vendemos seus dados pessoais. O compartilhamento ocorre apenas
          com:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>
            Fornecedores de infraestrutura (ex.: hospedagem em nuvem) sob
            obrigação contratual de sigilo;
          </li>
          <li>
            Autoridades públicas, quando exigido por lei ou ordem judicial.
          </li>
        </ul>
      </Section>

      <Section title="6. Retenção de dados">
        <p>
          Mantemos seus dados pelo tempo necessário à prestação dos serviços e
          ao cumprimento de obrigações legais. Após o encerramento da conta, os
          dados são anonimizados ou excluídos em até{" "}
          <strong style={{ color: "#e5e2e1" }}>90 dias</strong>, exceto quando a
          retenção for exigida por lei.
        </p>
      </Section>

      <Section title="7. Seus direitos">
        <p>Como titular, você pode a qualquer momento:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Confirmar a existência de tratamento e acessar seus dados;</li>
          <li>Solicitar correção de dados incompletos ou incorretos;</li>
          <li>Solicitar a portabilidade dos dados a outro fornecedor;</li>
          <li>Revogar consentimentos previamente concedidos;</li>
          <li>
            Solicitar a exclusão dos dados tratados com base em consentimento.
          </li>
        </ul>
        <p className="mt-3">
          Para exercer seus direitos, acesse{" "}
          <strong style={{ color: "#e5e2e1" }}>Configurações → LGPD</strong>{" "}
          dentro da plataforma ou envie um e-mail para{" "}
          <strong style={{ color: "#4edea3" }}>
            privacidade@techbalance.com.br
          </strong>
          .
        </p>
      </Section>

      <Section title="8. Segurança">
        <p>
          Adotamos medidas técnicas e organizacionais adequadas para proteger
          seus dados contra acesso não autorizado, perda ou destruição,
          incluindo criptografia em trânsito (TLS), controle de acesso por
          perfil e monitoramento de acessos.
        </p>
      </Section>

      <Section title="9. Contato">
        <p>
          Encarregado de Proteção de Dados (DPO) da TechBalance:{" "}
          <strong style={{ color: "#4edea3" }}>dpo@techbalance.com.br</strong>
        </p>
      </Section>
    </div>
  );
}

function TermosContent() {
  return (
    <div>
      <p className="text-sm leading-relaxed mb-8" style={{ color: "#6b7280" }}>
        Última atualização: junho de 2026. Ao utilizar a plataforma ContaUp,
        você concorda com os termos abaixo, estabelecidos pela{" "}
        <strong style={{ color: "#e5e2e1" }}>TechBalance</strong>. Leia com
        atenção antes de prosseguir.
      </p>

      <Section title="1. Aceitação">
        <p>
          O uso da plataforma ContaUp implica a aceitação integral destes Termos
          de Serviço. Caso não concorde com qualquer disposição, interrompa o
          uso imediatamente. A TechBalance se reserva o direito de atualizar
          estes termos, notificando os usuários com antecedência mínima de{" "}
          <strong style={{ color: "#e5e2e1" }}>15 dias</strong>.
        </p>
      </Section>

      <Section title="2. Descrição do serviço">
        <p>
          O ContaUp é uma plataforma SaaS de gestão financeira e contábil que
          permite o registro de lançamentos, geração de relatórios e controle de
          fluxo de caixa para pessoas jurídicas. A TechBalance não presta
          serviços de contabilidade regulamentada e o uso da plataforma não
          substitui a assessoria de um contador habilitado.
        </p>
      </Section>

      <Section title="3. Cadastro e conta">
        <p>
          Para utilizar o ContaUp, é necessário criar uma conta com informações
          verdadeiras e atualizadas. O usuário é responsável pela
          confidencialidade de suas credenciais de acesso e por todas as
          atividades realizadas em sua conta.
        </p>
      </Section>

      <Section title="4. Uso permitido">
        <p>É vedado ao usuário:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>
            Utilizar a plataforma para fins ilícitos ou em violação à legislação
            vigente;
          </li>
          <li>
            Tentar acessar dados de outros usuários ou áreas restritas do
            sistema;
          </li>
          <li>
            Reproduzir, vender ou sublicenciar qualquer parte da plataforma;
          </li>
          <li>
            Inserir dados falsos ou fraudulentos com o objetivo de prejudicar
            terceiros.
          </li>
        </ul>
      </Section>

      <Section title="5. Propriedade intelectual">
        <p>
          Toda a propriedade intelectual da plataforma ContaUp — incluindo
          código-fonte, design, marcas e conteúdo — pertence exclusivamente à{" "}
          <strong style={{ color: "#e5e2e1" }}>TechBalance</strong>. É concedida
          ao usuário uma licença limitada, não exclusiva e intransferível para
          uso da plataforma conforme o plano contratado.
        </p>
      </Section>

      <Section title="6. Dados do usuário">
        <p>
          Os dados inseridos pelo usuário na plataforma (lançamentos,
          relatórios, etc.) pertencem ao próprio usuário. A TechBalance não
          reivindica propriedade sobre esses dados e os trata conforme a
          Política de Privacidade.
        </p>
      </Section>

      <Section title="7. Disponibilidade e suporte">
        <p>
          A TechBalance emprega esforços razoáveis para manter a plataforma
          disponível 24/7, mas não garante disponibilidade ininterrupta.
          Manutenções programadas serão comunicadas com antecedência. Suporte
          técnico é prestado em dias úteis, das 9h às 18h (horário de Brasília).
        </p>
      </Section>

      <Section title="8. Limitação de responsabilidade">
        <p>
          A TechBalance não se responsabiliza por perdas decorrentes de:
          decisões financeiras tomadas com base nas informações da plataforma,
          indisponibilidade temporária do serviço, erros de inserção de dados
          pelo usuário ou ataques de terceiros além do razoável controle da
          empresa.
        </p>
      </Section>

      <Section title="9. Rescisão">
        <p>
          O usuário pode encerrar sua conta a qualquer momento. A TechBalance
          pode suspender ou encerrar contas que violem estes termos, mediante
          notificação prévia salvo em casos de fraude ou risco à segurança da
          plataforma.
        </p>
      </Section>

      <Section title="10. Foro e lei aplicável">
        <p>
          Estes termos são regidos pela legislação brasileira. Fica eleito o
          foro da comarca de{" "}
          <strong style={{ color: "#e5e2e1" }}>São Paulo/SP</strong> para
          dirimir quaisquer controvérsias decorrentes deste instrumento.
        </p>
        <p className="mt-3">
          Dúvidas:{" "}
          <strong style={{ color: "#4edea3" }}>
            contato@techbalance.com.br
          </strong>
        </p>
      </Section>
    </div>
  );
}

function TeamGrid() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(TEAM_MEMBERS.length / MEMBERS_PER_PAGE);
  const slice = TEAM_MEMBERS.slice(
    page * MEMBERS_PER_PAGE,
    page * MEMBERS_PER_PAGE + MEMBERS_PER_PAGE
  );

  return (
    <div>
      <div className="flex flex-col gap-2 mb-3">
        {slice.map(({ name, role, sub, category }) => {
          const style = ROLE_STYLES[category];
          const { Icon } = style;
          return (
            <div
              key={name}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: style.bg, border: `1px solid ${style.border}` }}
            >
              <div
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                style={{ background: style.color + "22" }}
              >
                <Icon size={13} style={{ color: style.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-tight truncate" style={{ color: "#e5e2e1" }}>
                  {name}
                </p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: style.color }}>
                  {role}
                </p>
                <p className="text-[10px] text-white/50 mt-0.5 " >
                  {sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between mt-1">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{ background: "#f59e0b18", color: "#f59e0b" }}
        >
          <ChevronLeft size={12} />
          Anterior
        </button>
        <span className="text-[11px]" style={{ color: "#92704a" }}>
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{ background: "#f59e0b18", color: "#f59e0b" }}
        >
          Próximo
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

export default function LgpdPage() {
  const [activeTab, setActiveTab] = useState("privacidade");

  return (
    <div
      className="min-h-screen"
      style={{ background: "#131313", color: "#e5e2e1" }}
    >
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Voltar */}
        <Link
          href={"/login" as Route}
          className="inline-flex items-center gap-2 text-xs font-medium mb-8 transition-opacity hover:opacity-70"
          style={{ color: "#6b7280" }}
        >
          <ArrowLeft size={14} />
          Voltar para o login
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: "#4edea318", color: "#4edea3" }}
            >
              TechBalance
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ color: "#e5e2e1" }}
          >
            Privacidade & Termos
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Documentos legais da plataforma ContaUp
          </p>
        </div>

        {/* ── DISCLAIMER ACADÊMICO ── */}
        <div
          className="rounded-3xl p-6 mb-8"
          style={{ border: "1px solid #f59e0b40", background: "#f59e0b08" }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <AlertTriangle
              size={18}
              style={{ color: "#f59e0b" }}
              className="shrink-0"
            />
            <h2 className="text-sm font-bold" style={{ color: "#f59e0b" }}>
              DISCLAIMER ACADÊMICO — AVISO IMPORTANTE
            </h2>
          </div>

          {/* Bloco principal */}
          <div
            className="rounded-2xl p-4 mb-5 text-xs leading-relaxed"
            style={{
              background: "#f59e0b0d",
              border: "1px solid #f59e0b28",
              color: "#d4b483",
            }}
          >
            <p className="mb-3">
              O <strong style={{ color: "#fbbf24" }}>ContaUp</strong> (operado
              ficticiamente pela{" "}
              <strong style={{ color: "#fbbf24" }}>TechBalance</strong>) é uma
              aplicação de software{" "}
              <strong style={{ color: "#fbbf24" }}>
                estritamente fictícia e acadêmica
              </strong>
              . Foi desenvolvida exclusivamente como projeto de avaliação para a
              disciplina de Contabilidade do{" "}
              <strong style={{ color: "#fbbf24" }}>
                Instituto Federal do Norte de Minas Gerais — Campus Teófilo
                Otoni (IFNMG-TO)
              </strong>
              .
            </p>
            <p className="mb-3">
              <strong style={{ color: "#fbbf24" }}>
                Este sistema NÃO é um produto comercial.
              </strong>{" "}
              Não possui valor legal, fiscal ou contábil real. Nenhuma transação
              financeira verdadeira ocorre nesta plataforma. Os dados exibidos
              são inteiramente fictícios e utilizados apenas para demonstração.
            </p>
            <p>
              A empresa{" "}
              <strong style={{ color: "#fbbf24" }}>TechBalance</strong> é uma
              marca fictícia criada exclusivamente para contextualizar este
              projeto acadêmico.
            </p>
          </div>

          {/* Propriedade intelectual */}
          <div className="flex items-start gap-2.5 mb-5">
            <Copyright
              size={15}
              style={{ color: "#f59e0b" }}
              className="shrink-0 mt-0.5"
            />
            <div>
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "#fbbf24" }}
              >
                Propriedade Intelectual
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#d4b483" }}
              >
                Todo o{" "}
                <strong style={{ color: "#e5e2e1" }}>código-fonte</strong>,{" "}
                <strong style={{ color: "#e5e2e1" }}>
                  arquitetura de software
                </strong>{" "}
                (Clean Architecture, DDD),{" "}
                <strong style={{ color: "#e5e2e1" }}>
                  design de interface
                </strong>
                , (TechBalance e ContaUp) e{" "}
                <strong style={{ color: "#e5e2e1" }}>
                  documentação técnica
                </strong>{" "}
                deste projeto são propriedade intelectual exclusiva dos seus
                desenvolvedores, estudantes do IFNMG. O uso deste código para
                fins de cópia acadêmica não autorizada (plágio) por outros
                estudantes é{" "}
                <strong style={{ color: "#f43754" }}>
                  estritamente proibido
                </strong>
                .
              </p>
              <p
                className="text-xs leading-relaxed mt-2"
                style={{ color: "#d4b483" }}
              >
                As identidades visuais e logomarcas da{" "}
                <strong style={{ color: "#e5e2e1" }}>TechBalance</strong> e do{" "}
                <strong style={{ color: "#e5e2e1" }}>ContaUp</strong> foram
                geradas integralmente por ferramentas de{" "}
                <strong style={{ color: "#e5e2e1" }}>
                  Inteligência Artificial
                </strong>{" "}
                para fins de ilustração acadêmica. Por se tratar de conteúdo
                gerado por IA sem alterações humanas subsequentes, a equipe não
                reivindica direitos autorais ou de exclusividade sobre essas
                imagens, integrando o escopo do projeto apenas de forma
                demonstrativa.
              </p>
            </div>
          </div>

          {/* Equipe */}
          <div className="flex items-start gap-2.5">
            <GraduationCap
              size={15}
              style={{ color: "#f59e0b" }}
              className="shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <p
                className="text-xs font-semibold mb-3"
                style={{ color: "#fbbf24" }}
              >
                Equipe de Desenvolvimento — IFNMG Campus Teófilo Otoni
              </p>
              <TeamGrid />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-2xl w-fit mb-8"
          style={{ background: "#1e1e1e" }}
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
              style={{
                background: activeTab === id ? "#4edea3" : "transparent",
                color: activeTab === id ? "#003824" : "#6b7280",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div
          className="rounded-3xl p-6 md:p-8"
          style={{ background: "#1e1e1e" }}
        >
          {activeTab === "privacidade" ? (
            <PrivacidadeContent />
          ) : (
            <TermosContent />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-8" style={{ color: "#4b5563" }}>
          © {new Date().getFullYear()} TechBalance. Todos os direitos
          reservados.
        </p>
      </div>
    </div>
  );
}
