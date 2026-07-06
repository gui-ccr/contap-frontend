"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthBackground } from "./components/AuthBackground";
import { AuthHeader } from "./components/AuthHeader";
import { AuthForm } from "./components/AuthForm";
import { apiClient } from "@/shared/api";
import { setSessionCookie } from "@/shared/sessionCookie";

export function AuthPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("@contaup:remember_me_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    setLoading(true);

    try {
      if (!isLoginMode) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{6,}$/;
        if (!passwordRegex.test(password)) {
          setApiError("A senha deve ter pelo menos 6 caracteres e incluir uma letra maiúscula, uma minúscula, um número e um caractere especial.");
          setLoading(false);
          return;
        }
      }

      if (isLoginMode) {
        // Efetua login
        const response = await apiClient.post<{ token: string; refresh_token: string; empresa_id?: string }>("/auth/login", {
          email,
          senha: password,
        });

        if (response.token) {
          // Entrega a sessão ao SDK do Supabase, que passa a persistir e
          // renovar os tokens sozinho (ver shared/supabaseClient.ts).
          const { getSupabaseClient } = await import("@/shared/supabaseClient");
          await getSupabaseClient().auth.setSession({
            access_token: response.token,
            refresh_token: response.refresh_token,
          });
          setSessionCookie();

          if (rememberMe) {
            localStorage.setItem("@contaup:remember_me_email", email);
          } else {
            localStorage.removeItem("@contaup:remember_me_email");
          }

          router.push("/dashboard" as never);
        } else {
          throw new Error("Token não recebido na resposta do servidor.");
        }
      } else {
        // Registra o dono
        await apiClient.post("/auth/registrar-dono", {
          nome: name,
          email,
          senha: password,
        });

        // Login automático após registrar
        const loginResponse = await apiClient.post<{ token: string; refresh_token: string; empresa_id?: string }>("/auth/login", {
          email,
          senha: password,
        });

        if (loginResponse.token) {
          const { getSupabaseClient } = await import("@/shared/supabaseClient");
          await getSupabaseClient().auth.setSession({
            access_token: loginResponse.token,
            refresh_token: loginResponse.refresh_token,
          });
          setSessionCookie();
          router.push("/cadastro-empresa" as never);
        } else {
          setIsLoginMode(true);
          setApiError("Conta criada! Faça login com suas credenciais.");
        }
      }
    } catch (err: any) {
      setApiError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-surface">
      <AuthBackground />

      <main className="w-full max-w-105 px-margin-mobile md:px-0 relative z-10">
        <div className="bg-surface-container/70 glass-panel border border-white/5 rim-light rounded-3xl p-lg shadow-2xl flex flex-col gap-xl">
          <AuthHeader isLoginMode={isLoginMode} />

          {apiError && (
            <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-xl border border-red-500/20 text-center">
              {apiError}
            </div>
          )}

          <AuthForm
            isLoginMode={isLoginMode}
            name={name}
            email={email}
            password={password}
            showPassword={showPassword}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            rememberMe={rememberMe}
            onRememberMeChange={setRememberMe}
            onTogglePassword={() => setShowPassword((v) => !v)}
            onToggleMode={() => setIsLoginMode((v) => !v)}
            onForgotPassword={() => router.push("/recuperar-senha" as never)}
            onSubmit={handleSubmit}
            isLoading={loading}
          />

          <div className="text-center">
            <p className="text-label-sm text-on-surface-variant/50">
              Ambiente seguro e criptografado.
            </p>
            <p className="text-label-sm text-on-surface-variant/40 mt-1">
              Ao continuar, você concorda com nossa{" "}
              <Link
                href={"/lgpd" as never}
                className="underline underline-offset-2 transition-opacity hover:opacity-70"
              >
                Política de Privacidade e Termos de Serviço
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
