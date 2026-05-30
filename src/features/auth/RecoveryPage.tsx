"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/ui/TextInput"; // Garante que o caminho para o teu componente está correto

type RecoveryStep = "request" | "reset" | "success";

export function RecoveryPage() {
  const router = useRouter();
  const [step, setStep] = useState<RecoveryStep>("request");
  
 
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  
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

  // Etapa 1: Solicitar o código de recuperação
  const handleRequestCode = (e: FormEvent) => {
    e.preventDefault();
    // Aqui os teus colegas de BackEnd vão conectar a API de envio de e-mail
    // fetch("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) })
    
    setStep("reset");
  };

  // Etapa 2: Trocar a senha com o código em mãos
  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas introduzidas não coincidem.");
      return;
    }
    
    setPasswordError("");
    // Aqui será feita a chamada de API para atualizar a senha no Banco de Dados
    // fetch("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ email, code, newPassword }) })
    
    setStep("success");

    // Redireciona para a rota de login após 3 segundos
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-surface">
      {/* Luzes ambiente de fundo (Glow) herdadas do teu AuthPage */}
      <div className="absolute top-[10%] left-[10%] w-2/5 h-2/5 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Card Principal Glassmorphism */}
      <div className="w-full max-w-[440px] bg-surface-container-high/40 backdrop-blur-md border border-outline-variant/20 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 relative z-10">
        
        {/* Títulos dinâmicos conforme o passo atual */}
        {step !== "success" && (
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-headline-lg text-on-surface">
              {step === "request" ? "Recuperar Acesso" : "Definir Nova Senha"}
            </h1>
            <p className="text-body-sm text-on-surface-variant/70">
              {step === "request"
                ? "Introduza o seu e-mail institucional para receber o código de validação."
                : "Introduza o código enviado para o seu e-mail e escolha uma nova senha segura."}
            </p>
          </div>
        )}

        {/* Formulário Passo 1: Pedir Código */}
        {step === "request" && (
          <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
            <TextInput
              label="E-mail Institucional"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              iconName="mail"
              type="email"
              placeholder="exemplo@contaup.com"
              required
              autoComplete="email"
            />

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-fixed active:scale-[0.98] text-on-primary text-label-md py-3 px-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-base shadow-lg shadow-primary/20 cursor-pointer"
              >
                Gerar Código de Verificação
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>
        )}

        {/* Formulário Passo 2: Redefinir Senha */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <TextInput
              label="Código de Verificação"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              iconName="pin"
              type="text"
              placeholder="Digite o código de 6 dígitos"
              required
            />

            <TextInput
              label="Nova Senha"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              iconName="lock"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              rightElement={passwordToggle}
              required
              autoComplete="new-password"
            />

            <TextInput
              label="Confirmar Nova Senha"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              iconName="lock_reset"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              rightElement={passwordToggle}
              required
              autoComplete="new-password"
              error={passwordError}
            />

            {passwordError && (
              <span className="text-label-sm text-error -mt-2 px-1">
                {passwordError}
              </span>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-fixed active:scale-[0.98] text-on-primary text-label-md py-3 px-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-base shadow-lg shadow-primary/20 cursor-pointer"
              >
                Redefinir Senha e Entrar
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </button>
            </div>
          </form>
        )}

        {/* Estado Final: Sucesso */}
        {step === "success" && (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_25px_rgba(78,222,163,0.2)]">
              <span className="material-symbols-outlined text-[36px] font-bold">verified</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-headline-md text-on-surface">Senha Atualizada!</h2>
              <p className="text-body-sm text-on-surface-variant/60">
                As suas credenciais foram alteradas. A redirecionar para o login...
              </p>
            </div>
          </div>
        )}

        {/* Links de navegação inferiores */}
        {step !== "success" && (
          <div className="text-center border-t border-outline-variant/10 pt-4">
            <button
              type="button"
              onClick={() => {
                if (step === "reset") setStep("request");
                else router.push("/login"); // Caminho da tua página de login
              }}
              className="inline-flex items-center gap-2 text-label-sm text-primary hover:text-primary-fixed transition-colors font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              {step === "reset" ? "Voltar para o passo anterior" : "Voltar para o Login"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}