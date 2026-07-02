"use client";

import { Camera, Trash2 } from "lucide-react";

interface AvatarPickerProps {
  nome: string;
  fotoUrl?: string;
  onFile: (file: File) => void;
  onRemove: () => void;
}

/** Avatar circular com troca/remoção de foto, usado nos formulários de pessoas. */
export function AvatarPicker({ nome, fotoUrl, onFile, onRemove }: AvatarPickerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative group">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center bg-cover bg-center border-2 border-surface-container-high"
          style={
            fotoUrl
              ? { background: `url(${fotoUrl}) center/cover no-repeat` }
              : { background: "linear-gradient(135deg, var(--color-primary), var(--color-inverse-primary))" }
          }
        >
          {!fotoUrl && (
            <span className="text-xl font-bold text-on-primary">
              {nome ? nome.charAt(0).toUpperCase() : "?"}
            </span>
          )}
        </div>
        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity rounded-full cursor-pointer">
          <Camera size={16} className="mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Alterar</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
            }}
          />
        </label>
        {fotoUrl && (
          <button
            type="button"
            onClick={onRemove}
            title="Remover foto"
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-error-container rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-lg border-2 border-surface-container cursor-pointer"
          >
            <Trash2 size={12} className="text-on-error-container" />
          </button>
        )}
      </div>
    </div>
  );
}
