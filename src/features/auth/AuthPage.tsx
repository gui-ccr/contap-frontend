"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/ui/TextInput";

export function AuthPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      router.push("/dashboard" as never);
    } else {
      router.push("/cadastro-empresa" as never);
    }
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="text-on-surface-variant/50 hover:text-on-surface-variant transition-colors focus:outline-none pt-1.5"
      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
    >
      <span className="material-symbols-outlined text-[20px]">
        {showPassword ? "visibility" : "visibility_off"}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-surface">
      {/* Ambient glow */}
      <div className="absolute top-[10%] left-[10%] w-2/5 h-2/5 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-tertiary-container/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="w-full max-w-105 px-margin-mobile md:px-0 relative z-10">
        <div className="bg-surface-container/70 glass-panel border border-white/5 rim-light rounded-3xl p-lg shadow-2xl flex flex-col gap-xl">

          {/* Header */}
          <header className="flex flex-col items-center gap-sm text-center">
            <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center border border-white/5 rim-light mb-1">
              <img src="/contauplogo.png" alt="ContaUp" className="w-10 h-10" />
            </div>
            <h1 className="text-headline-lg text-on-surface">ContaUp</h1>
            <p className="text-body-md text-on-surface-variant">
              {isLoginMode
                ? "Acesse sua plataforma financeira."
                : "Crie sua conta agora."}
            </p>
          </header>

          {/* Form */}
          <form
            className="flex flex-col gap-gutter"
            onSubmit={handleSubmit}
          >
            {!isLoginMode && (
              <TextInput
                label="Nome Completo"
                name="name"
                iconName="person"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            )}

            <TextInput
              label="Email Corporativo"
              name="email"
              iconName="mail"
              type="email"
              placeholder="nome@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="flex flex-col gap-base">
              <div className="flex justify-between items-center">
                <label
                  className="text-label-md text-on-surface-variant"
                  htmlFor="password"
                >
                  Senha
                </label>
                {isLoginMode && (
                  <button
                    type="button"
                    onClick={() => router.push("/recuperar-senha" as never)}
                    className="text-label-sm text-primary hover:text-primary-fixed transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                  >
                    Esqueci minha senha
                  </button>
                )}
              </div>
              <TextInput
                label=""
                name="password"
                iconName="lock"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                rightElement={passwordToggle}
                required
                autoComplete={isLoginMode ? "current-password" : "new-password"}
              />
            </div>

            {/* Actions */}
            <div className="pt-sm flex flex-col gap-base">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-fixed active:scale-[0.98] text-on-primary text-label-md py-3 px-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-base shadow-lg shadow-primary/20 cursor-pointer"
              >
                {isLoginMode ? "Entrar no Sistema" : "Criar Conta"}
                <span className="material-symbols-outlined text-[18px]"/>
              </button>

              <button
                type="button"
                onClick={() => setIsLoginMode((prev) => !prev)}
                className="text-label-sm text-primary hover:text-primary-fixed transition-colors"
              >
                {isLoginMode
                  ? "Não tem uma conta? Cadastre-se"
                  : "Já possui conta? Fazer Login"}
              </button>
            </div>
          </form>

          {/* Footer */}
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
