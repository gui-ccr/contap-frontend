"use client";

import React, { useState } from "react";
import { MODULOS } from "../docsData";
import { cx } from "@/utils/cx";
import { Menu, X } from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-surface-container rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cx(
        "fixed inset-y-0 left-0 z-40 w-72 bg-surface-container border-r border-outline-variant/40 transform transition-transform duration-300 overflow-y-auto lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-on-surface mb-8">ContaUp API</h2>
          <nav className="space-y-8">
            {MODULOS.map(mod => (
              <div key={mod.id}>
                <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">{mod.titulo}</h3>
                <ul className="space-y-2">
                  {mod.endpoints.map(ep => (
                    <li key={ep.path}>
                      <a 
                        href={`#${mod.id}-${ep.metodo}-${ep.path.replace(/[^a-zA-Z0-9-]/g, '-')}`} 
                        className="text-sm text-on-surface/80 hover:text-primary transition-colors block py-1"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className={cx(
                          "inline-block w-12 text-xs font-bold",
                          ep.metodo === "GET" && "text-blue-500",
                          ep.metodo === "POST" && "text-green-500",
                          ep.metodo === "PUT" && "text-amber-500",
                          ep.metodo === "DELETE" && "text-red-500"
                        )}>{ep.metodo}</span>
                        <span className="font-mono text-xs truncate" title={ep.path}>{ep.path}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
