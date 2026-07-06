"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ code, label = "response.json" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const highlightJSON = (jsonString: string) => {
    let formatted = jsonString.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    formatted = formatted.replace(/"([^"]+)":/g, '<span class="text-primary">"$1"</span>:');
    formatted = formatted.replace(/: "([^"]+)"/g, ': <span class="text-tertiary">"$1"</span>');
    formatted = formatted.replace(/: ([0-9.]+|true|false)/g, ': <span class="text-secondary">$1</span>');
    return formatted;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-outline-variant/40 bg-surface-container-highest shadow-inner">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-container-high border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-secondary/70" />
            <span className="size-2.5 rounded-full bg-tertiary/70" />
            <span className="size-2.5 rounded-full bg-primary/70" />
          </div>
          <span className="text-xs font-mono text-on-surface-variant/80">{label}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
            copied
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-outline-variant/50 bg-surface-container text-on-surface-variant hover:border-primary/40 hover:text-primary hover:bg-primary/5"
          }`}
          aria-label="Copiar código"
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
      <pre className="p-4 text-sm font-mono overflow-x-auto text-on-surface custom-scrollbar">
        <code dangerouslySetInnerHTML={{ __html: highlightJSON(code) }} />
      </pre>
    </div>
  );
}
