"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthBackground } from "./components/AuthBackground";
import { AuthHeader } from "./components/AuthHeader";
import { AuthForm } from "./components/AuthForm";

export function AuthPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(isLoginMode ? ("/dashboard" as never) : ("/cadastro-empresa" as never));
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-surface">
      <AuthBackground />

      <main className="w-full max-w-105 px-margin-mobile md:px-0 relative z-10">
        <div className="bg-surface-container/70 glass-panel border border-white/5 rim-light rounded-3xl p-lg shadow-2xl flex flex-col gap-xl">
          <AuthHeader isLoginMode={isLoginMode} />

          <AuthForm
            isLoginMode={isLoginMode}
            name={name}
            email={email}
            password={password}
            showPassword={showPassword}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
            onToggleMode={() => setIsLoginMode((v) => !v)}
            onForgotPassword={() => router.push("/recuperar-senha" as never)}
            onSubmit={handleSubmit}
          />

          <div className="text-center">
            <p className="text-label-sm text-on-surface-variant/50">
              Ambiente seguro e criptografado.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
