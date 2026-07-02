"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Check } from "lucide-react";
import { ConfirmModal } from "@/ui/ConfirmModal";
import { Modal, ModalHeader } from "@/ui/Modal";
import { Input, Button, FormAlert } from "@/ui/forms";
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
  const [confirmDeleteCargoId, setConfirmDeleteCargoId] = useState<string | null>(null);

  async function carregarCargos() {
    try {
      setLoading(true);
      const data = await cargosService.listarCargos();
      setCargos(data);
    } catch {
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

  async function executeRemove() {
    if (!confirmDeleteCargoId) return;
    try {
      setError("");
      await cargosService.removerCargo(confirmDeleteCargoId);
      await carregarCargos();
    } catch {
      setError("Erro ao excluir cargo. Verifique se não há funcionários utilizando-o.");
    } finally {
      setConfirmDeleteCargoId(null);
    }
  }

  return (
    <>
      <Modal open onClose={onClose} maxWidth="672px">
        <ModalHeader
          eyebrow="Funcionários (RH)"
          title="Gerenciar cargos"
          subtitle="Crie e organize os cargos da sua empresa"
          onClose={onClose}
        />

        <div className="px-6 py-5">
          {error && <div className="mb-4"><FormAlert>{error}</FormAlert></div>}

          <form
            onSubmit={handleSave}
            className="flex flex-col gap-3 mb-6 p-4 rounded-2xl bg-surface-container-low border border-dashed border-outline-variant/50"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-label-sm uppercase tracking-widest text-primary border-l-2 border-primary pl-3">
                {editingId ? "Editar cargo" : "Novo cargo"}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-label-sm text-on-surface-variant/60 hover:text-on-surface cursor-pointer"
                >
                  Cancelar edição
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome (Ex: Vendedor)"
              />
              <Input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição (opcional)"
              />
            </div>
            <Button type="submit" disabled={saving} className="self-start">
              {editingId ? <Check size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
              {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar cargo"}
            </Button>
          </form>

          {loading ? (
            <p className="text-body-sm text-center py-6 text-on-surface-variant/60">Carregando...</p>
          ) : cargos.length === 0 ? (
            <p className="text-body-sm text-center py-6 text-on-surface-variant/60">
              Nenhum cargo criado ainda. Adicione o primeiro acima.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {cargos.map((cargo) => (
                <div
                  key={cargo.id}
                  className="flex items-center justify-between p-3 rounded-xl transition-colors bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container-high"
                >
                  <div>
                    <p className="text-body-sm font-semibold text-on-surface">{cargo.nome}</p>
                    {cargo.descricao && (
                      <p className="text-label-sm mt-0.5 text-on-surface-variant/60">{cargo.descricao}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(cargo)}
                      className="p-2 rounded-lg transition-colors hover:bg-tertiary/20 text-tertiary cursor-pointer"
                      title="Editar cargo"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteCargoId(cargo.id)}
                      className="p-2 rounded-lg transition-colors hover:bg-error-container/40 text-error cursor-pointer"
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
      </Modal>

      <ConfirmModal
        isOpen={!!confirmDeleteCargoId}
        title="Remover cargo?"
        description="Esta ação removerá o cargo. Verifique se não há funcionários utilizando-o."
        onConfirm={executeRemove}
        onCancel={() => setConfirmDeleteCargoId(null)}
        confirmText="Sim, remover"
      />
    </>
  );
}
