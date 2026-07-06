"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MODULOS } from "../docsData";
import { cx } from "@/utils/cx";
import { Menu, X, Search, ArrowLeft, ChevronDown } from "lucide-react";

const METHOD_COLOR: Record<string, string> = {
  GET: "text-tertiary bg-tertiary/10 border-tertiary/25",
  POST: "text-primary bg-primary/10 border-primary/25",
  PUT: "text-secondary bg-secondary/10 border-secondary/25",
  PATCH: "text-secondary bg-secondary/10 border-secondary/25",
  DELETE: "text-error bg-error/10 border-error/25",
};

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const linksRef = useRef<HTMLDivElement>(null);

  const toggleCollapsed = (id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalEndpoints = useMemo(
    () => MODULOS.reduce((acc, mod) => acc + mod.endpoints.length, 0),
    []
  );

  const filteredModulos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MODULOS;
    return MODULOS.map(mod => ({
      ...mod,
      endpoints: mod.endpoints.filter(
        ep => ep.path.toLowerCase().includes(q) || mod.titulo.toLowerCase().includes(q)
      ),
    })).filter(mod => mod.endpoints.length > 0);
  }, [query]);

  useEffect(() => {
    const targets: Element[] = [];
    // Só observa os cards de endpoint (<article>), não as <section> de módulo
    // que também têm id — senão a section (maior, sempre "intersecting" por
    // mais tempo) pode vencer o entries[0] e não bater com nenhum link do menu.
    document.querySelectorAll("main article[id]").forEach(el => targets.push(el));

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    targets.forEach(t => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-surface-container-high border border-outline-variant/40 rounded-full shadow-lg text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-40 w-72 bg-surface-container-low border-r border-outline-variant/30 transform transition-transform duration-300 flex flex-col lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand header */}
        <div className="relative shrink-0 px-6 pt-7 pb-5 overflow-hidden border-b border-outline-variant/30">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -left-10 size-40 rounded-full bg-primary/20 blur-[70px]"
          />
          <Link href="/" className="relative flex items-center gap-2.5 w-fit group">
            <span className="size-9 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-lg shadow-primary/20">
              <i className="fi fi-rr-terminal text-sm text-on-primary" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-extrabold text-on-surface tracking-tight">
                ContaUp <span className="text-primary">API</span>
              </span>
              <span className="text-[11px] font-medium text-on-surface-variant/70 mt-1">
                {totalEndpoints} endpoints documentados
              </span>
            </span>
          </Link>
        </div>

        <div className="px-6 pt-5 pb-3 shrink-0">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar endpoint..."
              className="w-full bg-surface-container-high border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-shadow"
            />
          </div>
        </div>

        <nav ref={linksRef} className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6 space-y-6">
          {filteredModulos.length === 0 && (
            <p className="px-2 text-sm text-on-surface-variant/70 italic">Nenhum endpoint encontrado.</p>
          )}
          {filteredModulos.map(mod => {
            const isSearching = query.trim().length > 0;
            const isCollapsed = !isSearching && !!collapsed[mod.id];
            return (
            <div key={mod.id}>
              <button
                type="button"
                onClick={() => toggleCollapsed(mod.id)}
                disabled={isSearching}
                aria-expanded={!isCollapsed}
                className="w-full px-2 mb-2 flex items-center justify-between gap-2 text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider hover:text-on-surface-variant transition-colors disabled:cursor-default"
              >
                <span className="flex items-center gap-1.5">
                  <ChevronDown
                    className={cx(
                      "size-3.5 shrink-0 transition-transform",
                      isCollapsed && "-rotate-90"
                    )}
                  />
                  <span>{mod.titulo}</span>
                </span>
                <span className="text-on-surface-variant/40 font-mono normal-case">{mod.endpoints.length}</span>
              </button>
              <div
                className={cx(
                  "grid transition-[grid-template-rows] duration-300 ease-in-out",
                  isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                )}
              >
              <ul className="space-y-1 overflow-hidden">
                {mod.endpoints.map(ep => {
                  const anchor = `${mod.id}-${ep.metodo}-${ep.path.replace(/[^a-zA-Z0-9-]/g, "-")}`;
                  const active = activeId === anchor;
                  return (
                    <li key={anchor}>
                      <a
                        href={`#${anchor}`}
                        className={cx(
                          "group flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-all",
                          active
                            ? "border-primary/30 bg-primary/10 text-on-surface shadow-sm shadow-primary/10"
                            : "border-transparent text-on-surface-variant/80 hover:border-outline-variant/50 hover:bg-surface-container-high hover:text-on-surface"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <span
                          className={cx(
                            "inline-flex items-center justify-center w-10 shrink-0 rounded-md border px-1 py-0.5 text-[9px] font-extrabold uppercase tracking-wider",
                            METHOD_COLOR[ep.metodo]
                          )}
                        >
                          {ep.metodo}
                        </span>
                        <span className="font-mono text-xs truncate flex-1" title={ep.path}>
                          {ep.path}
                        </span>
                        <span
                          className={cx(
                            "size-1.5 rounded-full shrink-0 transition-colors",
                            active ? "bg-primary" : "bg-transparent group-hover:bg-outline-variant"
                          )}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
              </div>
            </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-outline-variant/30 p-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-outline-variant/40 bg-surface-container text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Voltar para o site
          </Link>
        </div>
      </aside>
    </>
  );
}
