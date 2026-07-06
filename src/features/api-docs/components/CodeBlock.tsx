"use client";

import React from "react";

export function CodeBlock({ code }: { code: string }) {
  // A simple highlighting for JSON
  const highlightJSON = (jsonString: string) => {
    // Escape HTML just in case (although React handles it, we are using dangerouslySetInnerHTML here)
    let formatted = jsonString.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Highlight keys and string values
    formatted = formatted.replace(/"([^"]+)":/g, '<span class="text-primary">"$1"</span>:');
    formatted = formatted.replace(/: "([^"]+)"/g, ': <span class="text-tertiary">"$1"</span>');
    // Highlight numbers/booleans roughly
    formatted = formatted.replace(/: ([0-9.]+|true|false)/g, ': <span class="text-secondary">$1</span>');

    return formatted;
  };

  return (
    <pre className="bg-surface-container-highest p-4 rounded-xl text-sm font-mono overflow-x-auto text-on-surface shadow-inner">
      <code dangerouslySetInnerHTML={{ __html: highlightJSON(code) }} />
    </pre>
  );
}
