"use client";

import React from "react";
import { Endpoint } from "../docsData";
import { cx } from "@/utils/cx";
import { DataTable } from "./DataTable";
import { CodeBlock } from "./CodeBlock";

export function EndpointCard({ ep, moduloId }: { ep: Endpoint; moduloId: string }) {
  const methodColors: Record<string, string> = {
    GET: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    POST: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    PATCH: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    DELETE: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  };

  const methodClass = methodColors[ep.metodo] || methodColors.GET;
  const anchorId = `${moduloId}-${ep.metodo}-${ep.path.replace(/[^a-zA-Z0-9-]/g, '-')}`;

  return (
    <article id={anchorId} className="bg-surface-container-low rounded-2xl border border-outline-variant/40 shadow-sm mb-10 overflow-hidden group scroll-mt-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-outline-variant/40 bg-surface-container">
        <div className="flex items-center gap-3">
          <span className={cx("px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider", methodClass)}>
            {ep.metodo}
          </span>
          <code className="font-mono text-sm font-semibold text-on-surface">{ep.path}</code>
        </div>
        <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
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
                <CodeBlock code={ep.bodyExemplo} />
              </>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
              Resposta ({ep.respostaStatus})
            </h3>
            <CodeBlock code={ep.respostaExemplo} />

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
