"use client";

import React from "react";
import { Endpoint } from "../docsData";
import { cx } from "@/utils/cx";
import { DataTable } from "./DataTable";
import { CodeBlock } from "./CodeBlock";
import { Lock, Unlock } from "lucide-react";

export function EndpointCard({ ep, moduloId }: { ep: Endpoint; moduloId: string }) {
  const methodStyles: Record<string, { text: string; bar: string }> = {
    GET: { text: "text-tertiary", bar: "bg-tertiary" },
    POST: { text: "text-primary", bar: "bg-primary" },
    PUT: { text: "text-secondary", bar: "bg-secondary" },
    PATCH: { text: "text-secondary", bar: "bg-secondary" },
    DELETE: { text: "text-error", bar: "bg-error" },
  };

  const method = methodStyles[ep.metodo] || methodStyles.GET;
  const anchorId = `${moduloId}-${ep.metodo}-${ep.path.replace(/[^a-zA-Z0-9-]/g, '-')}`;
  const isPublic = /p[uú]blic/i.test(ep.auth);

  return (
    <article id={anchorId} className="relative rounded-2xl border border-outline-variant/40 shadow-sm mb-10 overflow-hidden group scroll-mt-28 bg-surface-container-low">
      <span className={cx("absolute left-0 top-0 bottom-0 w-1", method.bar)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-6 pr-5 py-5 border-b border-outline-variant/40 bg-surface-container">
        <div className="flex items-center gap-3 min-w-0">
          <span className={cx("text-xs font-extrabold uppercase tracking-widest shrink-0", method.text)}>
            {ep.metodo}
          </span>
          <code className="font-mono text-sm font-semibold text-on-surface truncate">{ep.path}</code>
        </div>
        <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5 shrink-0">
          {isPublic ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}
          {ep.auth}
        </span>
      </div>

      <div className="p-6 lg:p-8">
        <p className="mb-8 text-on-surface leading-relaxed">
          {ep.descricao}
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="min-w-0">
            {ep.pathParams && (
              <>
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
                  Parâmetros de Rota
                </h3>
                <DataTable campos={ep.pathParams} emptyMessage="Sem parâmetros de rota." />
              </>
            )}
            
            {ep.queryParams && (
              <>
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
                  Query Params
                </h3>
                <DataTable campos={ep.queryParams} emptyMessage="Sem parâmetros de query." />
              </>
            )}

            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
              Body (JSON)
            </h3>
            <DataTable campos={ep.body} emptyMessage="Sem corpo de requisição." />
            
            {ep.bodyExemplo && (
              <>
                <h4 className="text-xs font-semibold text-on-surface-variant mb-2 mt-4">Exemplo</h4>
                <CodeBlock code={ep.bodyExemplo} label="request.json" />
              </>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
              Resposta ({ep.respostaStatus})
            </h3>
            <CodeBlock code={ep.respostaExemplo} label={`${ep.respostaStatus} response.json`} />

            {ep.erros && ep.erros.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4 text-error">
                  Possíveis Erros
                </h3>
                <div className="bg-surface border border-outline-variant/40 rounded-xl overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-surface-container-high text-on-surface-variant">
                      <tr>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Status / Código</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Quando ocorre</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 text-on-surface">
                      {ep.erros.map((e, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-mono text-error text-xs whitespace-nowrap">{e.codigo}</td>
                          <td className="px-4 py-3 text-xs min-w-[250px] leading-relaxed">{e.quando}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {ep.notas && ep.notas.length > 0 && (
          <div className="mt-8 p-4 rounded-xl bg-secondary-container text-on-secondary-container border border-secondary/20">
            <p className="text-xs font-bold uppercase tracking-wider mb-2">Atenção</p>
            <ul className="list-disc list-inside space-y-1 text-xs leading-relaxed">
              {ep.notas.map((n, idx) => (
                <li key={idx}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
