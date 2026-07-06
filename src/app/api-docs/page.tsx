import React from "react";
import { Sidebar } from "@/features/api-docs/components/Sidebar";
import { EndpointCard } from "@/features/api-docs/components/EndpointCard";
import { MODULOS } from "@/features/api-docs/docsData";

export const metadata = {
  title: "API Docs | ContaUp",
  description: "Documentação oficial da API REST do ContaUp",
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-surface flex selection:bg-primary/20 selection:text-primary">
      <Sidebar />
      
      <main className="flex-1 lg:ml-72 p-6 lg:p-12 xl:p-16 max-w-6xl">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
              Documentação da <span className="text-primary">API</span>
            </h1>
            <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-sm font-semibold rounded-full border border-outline-variant/40">
              v1.0.0
            </span>
          </div>
          <p className="text-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Bem-vindo à documentação oficial da API REST do <strong>ContaUp</strong>. Aqui você encontra todos os endpoints, 
            parâmetros aceitos, exemplos práticos de requests em JSON e detalhes sobre autenticação.
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
                <div className="bg-surface-container-highest border border-outline-variant p-4 rounded-xl flex items-center justify-between">
                  <code className="text-sm font-mono text-primary font-bold">
                    https://nginx-production-6d15.up.railway.app
                  </code>
                </div>
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
      </main>
    </div>
  );
}
