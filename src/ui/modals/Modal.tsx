"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, children, maxWidth = "500px" }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl bg-surface-container border border-outline-variant/30 rim-light"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

/** Cabeçalho padrão de modal: eyebrow + título + botão de fechar. */
export function ModalHeader({
  eyebrow,
  title,
  subtitle,
  onClose,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 py-5 bg-surface-container border-b border-outline-variant/30">
      <div>
        {eyebrow && (
          <p className="text-label-sm uppercase tracking-widest text-primary mb-1">{eyebrow}</p>
        )}
        <h2 className="text-body-lg font-semibold text-on-surface">{title}</h2>
        {subtitle && <p className="text-body-sm text-on-surface-variant/70 mt-0.5">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-on-surface-variant transition-colors hover:bg-on-surface/5 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
      >
        <X size={16} />
      </button>
    </div>
  );
}

/** Rodapé padrão de modal: ações alinhadas à direita. */
export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end gap-2 px-6 py-4 border-t border-outline-variant/30">
      {children}
    </div>
  );
}
