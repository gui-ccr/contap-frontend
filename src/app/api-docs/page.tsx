import React from "react";
import { Sidebar } from "@/features/api-docs/components/Sidebar";
import { EndpointCard } from "@/features/api-docs/components/EndpointCard";
import { CopyableUrl } from "@/features/api-docs/components/CopyableUrl";
import { MODULOS } from "@/features/api-docs/docsData";

export const metadata = {
  title: "API Docs | ContaUp",
  description: "Documentação oficial da API REST do ContaUp",
};

export default function ApiDocsPage() {
  const totalEndpoints = MODULOS.reduce((acc, mod) => acc + mod.endpoints.length, 0);

  return (
    <div className="min-h-screen bg-surface flex selection:bg-primary/20 selection:text-primary">
      <Sidebar />

      <main className="relative flex-1 lg:ml-72 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden"
        >
          <div className="absolute -top-40 left-1/4 size-[420px] rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute -top-24 right-0 size-[360px] rounded-full bg-tertiary/10 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px), linear-gradient(to bottom, var(--color-outline-variant) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />
        </div>

        <div className="relative max-w-6xl p-6 lg:p-12 xl:p-16">
          <header className="mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-xs font-bold uppercase tracking-wider rounded-full border border-outline-variant/40">
                v1.0.0
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                {totalEndpoints} endpoints ativos
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-on-surface mb-5 leading-[1.05]">
              Documentação da <span className="text-primary">API</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Referência oficial da API REST do <strong className="text-on-surface">ContaUp</strong> — endpoints,
              parâmetros, exemplos de request/response e regras de autenticação, módulo por módulo.
            </p>
          </header>

          <section id="visao-geral" className="mb-20 scroll-mt-28">
            <h2 className="text-2xl font-bold text-on-surface mb-8 border-b border-outline-variant/40 pb-4">
              Visão Geral e Padrões
            </h2>

            <div className="space-y-8">
              <article className="bg-surface-container-low rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden">
                <div className="p-6 lg:p-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
                    1. Base URL
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed mb-4">
                    Todas as requisições devem ser feitas para a seguinte URL base em produção (o Gateway Nginx):
                  </p>
                  <CopyableUrl url="https://nginx-production-6d15.up.railway.app" />
                </div>
              </article>

            <article className="bg-surface-container-low rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden">
              <div className="p-6 lg:p-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
                  2. Fluxo Completo de Onboarding
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-on-surface-variant leading-relaxed">
                  <li>Cadastrar o dono em <code className="bg-surface-container px-1.5 py-0.5 rounded text-xs">POST /auth/registrar-dono</code>.</li>
                  <li>Fazer login em <code className="bg-surface-container px-1.5 py-0.5 rounded text-xs">POST /auth/login</code> e guardar o <code className="bg-surface-container px-1.5 py-0.5 rounded text-xs">token</code>.</li>
                  <li>Criar a empresa em <code className="bg-surface-container px-1.5 py-0.5 rounded text-xs">POST /empresas</code>.</li>
                  <li>Usar o token em todas as chamadas para os demais módulos.</li>
                </ol>
              </div>
            </article>
          </div>
        </section>

        {MODULOS.map(mod => (
          <section key={mod.id} id={mod.id} className="mb-24 scroll-mt-28">
            <div className="mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-on-surface mb-4 flex items-center gap-3">
                {mod.titulo}
              </h2>
              <p className="text-on-surface-variant text-base lg:text-lg leading-relaxed max-w-4xl" dangerouslySetInnerHTML={{ __html: mod.descricao.replace(/<code class="[^"]*">/g, '<code class="bg-surface-container px-1.5 py-0.5 rounded text-xs text-primary">') }} />
            </div>

            <div className="space-y-12">
              {mod.endpoints.map((ep, idx) => (
                <EndpointCard key={idx} ep={ep} moduloId={mod.id} />
              ))}
            </div>
          </section>
        ))}
        </div>
      </main>
    </div>
  );
}
