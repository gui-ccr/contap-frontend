/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { User, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/shared/AuthContext";
import { apiClient } from "@/shared/api";
import { PasswordStrengthIndicator } from "@/ui/forms/PasswordStrengthIndicator";
import { Field, SettingsCard, SectionHeader, SaveButton, type SaveState } from "./settingsUi";

export function ProfileSettings() {
  const { usuario, refreshUserData } = useAuth();
  
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<SaveState>("idle");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (usuario) {
      setName(usuario.nome || "");
      setRole(usuario.cargo || "");
      setEmail(usuario.email || "");
    }
  }, [usuario]);

  const save = async () => {
    if (!usuario) return;
    if (password || confirm) {
      if (password !== confirm) {
        toast.error("As senhas não coincidem.");
        return;
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{6,}$/;
      if (!passwordRegex.test(password)) {
        toast.error("A senha deve ter pelo menos 6 caracteres e incluir uma letra maiúscula, uma minúscula, um número e um caractere especial.");
        return;
      }
    }

    setState("loading");
    try {
      if (password) {
        const { getSupabaseClient } = await import("@/shared/supabaseClient");
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw new Error(error.message);
      }

      await apiClient.put(`/auth/usuarios/${usuario.id}`, {
        nome: name,
        cargo: role,
      });
      await refreshUserData();
      setPassword("");
      setConfirm("");
      setState("saved");
      setTimeout(() => setState("idle"), 2000);
      toast.success("Perfil atualizado com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao atualizar perfil.");
      setState("idle");
    }
  };

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !usuario) return;
    const file = e.target.files[0];
    try {
      setIsUploading(true);
      const { usuariosService } = await import("@/features/usuarios/usuariosService");
      const fotoUrl = await usuariosService.uploadFotoPerfil(file, usuario.id);
      
      await apiClient.put(`/auth/usuarios/${usuario.id}`, { foto_url: fotoUrl });
      await refreshUserData();
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch(err: any) {
      toast.error(err.message || "Erro ao atualizar foto.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SettingsCard>
      <SectionHeader
        icon={User}
        title="Perfil do Usuário"
        subtitle="Suas informações pessoais e credenciais de acesso"
      />

      <div
        className="flex items-center gap-5 mb-6 pb-6"
        style={{ borderBottom: "1px solid #2a2a2a" }}
      >
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleUploadFoto}
            className="hidden"
          />
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold cursor-pointer bg-cover bg-center bg-no-repeat"
            style={
              usuario?.foto_url
                ? { backgroundImage: `url(${usuario.foto_url})`, color: "#fff" }
                : { background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff" }
            }
            onClick={() => fileInputRef.current?.click()}
          >
            {!usuario?.foto_url && (usuario?.nome || "JD").substring(0, 2).toUpperCase()}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: "#10b981" }}
          >
            {isUploading ? <Loader2 size={11} color="#fff" className="animate-spin" /> : <Camera size={11} color="#fff" />}
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Foto de Perfil</p>
          <p className="text-xs text-gray-500 mt-0.5">
            PNG, JPG ou WEBP. Máx. 2MB.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs mt-2 font-medium transition-opacity hover:opacity-70 cursor-pointer"
            style={{ color: "#10b981" }}
            disabled={isUploading}
          >
            {isUploading ? "Enviando..." : "Fazer upload →"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field
          label="Nome completo"
          value={name}
          onChange={setName}
          placeholder="Seu nome"
        />
        <Field
          label="Cargo / Função"
          value={role}
          onChange={setRole}
          placeholder="Ex: Financeiro"
        />
        <Field
          label="E-mail"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
          type="email"
        />
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 mt-5">
        Alterar Senha
      </p>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Nova senha"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="••••••••"
          />
          <Field
            label="Confirmar senha"
            value={confirm}
            onChange={setConfirm}
            type="password"
            placeholder="••••••••"
          />
        </div>
        {password && <PasswordStrengthIndicator password={password} />}
      </div>

      <SaveButton state={state} onClick={save} />
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// SEÇÃO 2 — CONTA / EMPRESA
