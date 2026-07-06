"use client";

import React from "react";
import { Campo } from "../docsData";

interface DataTableProps {
  campos?: Campo[];
  emptyMessage: string;
}

export function DataTable({ campos, emptyMessage }: DataTableProps) {
  if (!campos || campos.length === 0) {
    return <p className="text-sm text-on-surface-variant italic">{emptyMessage}</p>;
  }

  return (
    <div className="bg-surface border border-outline-variant/40 rounded-xl overflow-x-auto mb-6 custom-scrollbar">
      <table className="w-full text-sm text-left">
        <thead className="bg-surface-container-high text-on-surface-variant">
          <tr>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Campo</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Tipo</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Descrição</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40 text-on-surface">
          {campos.map((c, idx) => (
            <tr key={idx}>
              <td className="px-4 py-3 font-mono text-primary text-xs whitespace-nowrap">
                {c.nome}
                {c.obrigatorio && <span className="text-error ml-1">*</span>}
              </td>
              <td className="px-4 py-3 text-xs opacity-80 min-w-[120px]">{c.tipo}</td>
              <td className="px-4 py-3 text-xs min-w-[250px] leading-relaxed">{c.descricao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
