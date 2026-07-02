import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-[90vw] sm:w-full max-w-md shrink-0 rounded-3xl overflow-hidden shadow-2xl relative" style={{ background: "#1e1e1e" }}>
        
        {/* Fechar no canto */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center">
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}
          >
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
          <p className="text-sm" style={{ color: "#9ca3af" }}>{description}</p>
        </div>

        <div className="px-6 py-4 flex gap-3" style={{ background: "#1a1a1a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition ${isDestructive ? "hover:bg-red-600" : "hover:bg-blue-600"}`}
            style={{ background: isDestructive ? "#ef4444" : "#3b82f6" }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
