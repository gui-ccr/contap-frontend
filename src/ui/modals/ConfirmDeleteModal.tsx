import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (excluirContas: boolean) => Promise<void>;
  title: string;
  itemName: string;
}

export function ConfirmDeleteModal({ open, onClose, onConfirm, title, itemName }: ConfirmDeleteModalProps) {
  const [excluirContas, setExcluirContas] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => setExcluirContas(false), 0);
    }
  }, [open]);

  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirm(excluirContas);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="400px">
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Esta ação não poderá ser desfeita.</p>
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-300">
          Tem certeza que deseja remover permanentemente <strong>{itemName}</strong> do sistema?
        </div>

        <div className="mt-2 flex flex-col justify-center">
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-colors" style={{ background: "rgba(255,255,255,0.02)", borderColor: excluirContas ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)" }}>
            <input 
              type="checkbox" 
              checked={excluirContas} 
              onChange={(e) => setExcluirContas(e.target.checked)} 
              className="mt-0.5 w-4 h-4 rounded text-red-500 focus:ring-red-500 bg-[#242424] border-gray-600" 
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Excluir contas vinculadas</span>
              <span className="text-xs text-gray-500 mt-0.5">Apagar todas as contas a pagar de salário (lançamentos futuros) criadas para esta pessoa.</span>
            </div>
          </label>
        </div>

        <div className="flex gap-3 pt-2 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#ef4444", color: "#fff" }}
          >
            {loading ? (
              "Removendo..."
            ) : (
              <>
                <Trash2 size={16} /> Remover
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
