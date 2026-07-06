"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyableUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-surface-container-highest border border-outline-variant p-4 rounded-xl flex items-center justify-between gap-4">
      <code className="text-sm font-mono text-primary font-bold truncate">{url}</code>
      <button
        type="button"
        onClick={handleCopy}
        className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors shrink-0 ${
          copied
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-outline-variant/50 bg-surface-container-high text-on-surface-variant hover:border-primary/40 hover:text-primary hover:bg-primary/5"
        }`}
        aria-label="Copiar URL"
      >
        {copied ? (
          <>
            <Check className="size-3.5" />
            <span>Copiado</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            <span>Copiar</span>
          </>
        )}
      </button>
    </div>
  );
}
