"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2, Pencil, Check } from "lucide-react";
import { cargosService, type CargoBackend } from "@/features/cargos/cargosService";

interface GerenciarCargosModalProps {
  onClose: () => void;
}

export function GerenciarCargosModal({ onClose }: GerenciarCargosModalProps) {
  const [cargos, setCargos] = useState<CargoBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function carregarCargos() {
    try {
      setLoading(true);
      const data = await cargosService.listarCargos();
      setCargos(data);
    } catch (err) {
      setError("Não foi possível carregar os cargos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarCargos();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    try {
      setSaving(true);
      setError("");
      if (editingId) {
        await cargosService.atualizarCargo(editingId, { nome, descricao });
      } else {
        await cargosService.criarCargo({ nome, descricao });
      }
      setNome("");
      setDescricao("");
      setEditingId(null);
      await carregarCargos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar cargo.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(cargo: CargoBackend) {
    setEditingId(cargo.id);
    setNome(cargo.nome);
    setDescricao(cargo.descricao || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setNome("");
    setDescricao("");
  }

  async function handleRemove(id: string) {
    if (!confirm("Tem certeza que deseja excluir este cargo?")) return;
    try {
      setError("");
      await cargosService.removerCargo(id);
      await carregarCargos();
    } catch (err) {
      setError("Erro ao excluir cargo. Verifique se não há funcionários utilizando-o.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: "#1a1a1a" }}
      >
        <div
          className="flex items-center justify-between px-6 py-5 shrink-0"
          style={{ background: "#1a1a1a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ color: "#e5e2e1" }}>Gerenciar Cargos</h2>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Crie e organize os cargos da sua empresa</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5 cursor-pointer"
            style={{ color: "#6b7280" }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="rounded-2xl px-4 py-3 text-xs font-medium mb-4" style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-3 mb-6 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#e5e2e1" }}>
                {editingId ? "Editar Cargo" : "Novo Cargo"}
              </h3>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="text-xs text-gray-400 hover:text-white">
                  Cancelar
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input required value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome (Ex: Vendedor)" className="w-full rounded-xl px-3 py-2 text-sm outline-none transition-all focus:ring-1" style={{ background: "#242424", border: "1px solid rgba(255,255,255,0.08)", color: "#e5e2e1" }} />
              <input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição (Opcional)" className="w-full rounded-xl px-3 py-2 text-sm outline-none transition-all focus:ring-1" style={{ background: "#242424", border: "1px solid rgba(255,255,255,0.08)", color: "#e5e2e1" }} />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="mt-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90 self-start"
              style={{ background: saving ? "#2f8f69" : (editingId ? "#3b82f6" : "#4edea3"), color: editingId ? "#ffffff" : "#003824" }}
            >
              {editingId ? <Check size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
              {saving ? "Salvando..." : (editingId ? "Salvar Alterações" : "Adicionar Cargo")}
            </button>
          </form>

          {loading ? (
            <p className="text-sm text-center py-6" style={{ color: "#6b7280" }}>Carregando...</p>
          ) : cargos.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: "#6b7280" }}>Nenhum cargo personalizado encontrado.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {cargos.map(cargo => (
                <div key={cargo.id} className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-white/5" style={{ background: "#242424", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#e5e2e1" }}>{cargo.nome}</p>
                    {cargo.descricao && <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{cargo.descricao}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(cargo)}
                      className="p-2 rounded-lg transition-colors hover:bg-blue-500/20 text-blue-400"
                      title="Editar cargo"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleRemove(cargo.id)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-500/20 text-red-400"
                      title="Excluir cargo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
