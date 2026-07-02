"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthBackground } from "./components/AuthBackground";
import { StepRequestCode } from "./components/StepRequestCode";
import { StepResetPassword } from "./components/StepResetPassword";
import { StepSuccess } from "./components/StepSuccess";

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

  function handleRequestCode(e: FormEvent) {
    e.preventDefault();
    setStep("reset");
  }

  function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas introduzidas não coincidem.");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres e incluir uma letra maiúscula, uma minúscula, um número e um caractere especial.");
      return;
    }
    setPasswordError("");
    setStep("success");
    setTimeout(() => router.push("/login"), 3000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-surface">
      <AuthBackground />

      <div className="w-full max-w-[440px] bg-surface-container-high/40 backdrop-blur-md border border-outline-variant/20 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 relative z-10">
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

        {step === "request" && (
          <StepRequestCode
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleRequestCode}
          />
        )}

        {step === "reset" && (
          <StepResetPassword
            code={code}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            passwordError={passwordError}
            onCodeChange={setCode}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
            onSubmit={handleResetPassword}
          />
        )}

        {step === "success" && <StepSuccess />}

        {step !== "success" && (
          <div className="text-center border-t border-outline-variant/10 pt-4">
            <button
              type="button"
              onClick={() => step === "reset" ? setStep("request") : router.push("/login")}
              className="inline-flex items-center gap-2 text-label-sm text-primary hover:text-primary-fixed transition-colors font-medium cursor-pointer"
            >
              <i className="fi fi-rr-arrow-left text-[16px]"></i>
              {step === "reset" ? "Voltar para o passo anterior" : "Voltar para o Login"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
