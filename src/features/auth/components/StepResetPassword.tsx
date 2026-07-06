import { FormEvent } from "react";
import { TextInput } from "@/ui/TextInput";
import { PasswordStrengthIndicator } from "@/ui/PasswordStrengthIndicator";
import { Button } from "@/ui/forms";

interface StepResetPasswordProps {
  code: string;
  newPassword: string;
  confirmPassword: string;
  showPassword: boolean;
  passwordError: string;
  onCodeChange: (v: string) => void;
  onNewPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: FormEvent) => void;
}

export function StepResetPassword({
  code, newPassword, confirmPassword,
  showPassword, passwordError,
  onCodeChange, onNewPasswordChange, onConfirmPasswordChange,
  onTogglePassword, onSubmit,
}: StepResetPasswordProps) {
  const passwordToggle = (
    <Button
      variant="ghost"
      type="button"
      onClick={onTogglePassword}
      className="!px-2 !py-2 pt-1.5 text-on-surface-variant/50 hover:text-on-surface-variant"
      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
    >
      <i className={`fi fi-rr-${showPassword ? "eye" : "eye-crossed"} text-[20px]`}></i>
    </Button>
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextInput
        label="Código de Verificação"
        name="code"
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        iconName="fi-rr-key"
        type="text"
        placeholder="Digite o código de 6 dígitos"
        required
      />

      <TextInput
        label="Nova Senha"
        name="newPassword"
        value={newPassword}
        onChange={(e) => onNewPasswordChange(e.target.value)}
        iconName="fi-rr-lock"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        rightElement={passwordToggle}
        required
        autoComplete="new-password"
      />
      <PasswordStrengthIndicator password={newPassword} />

      <TextInput
        label="Confirmar Nova Senha"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        iconName="fi-rr-rotate-right"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        rightElement={passwordToggle}
        required
        autoComplete="new-password"
        error={passwordError}
      />

      {passwordError && (
        <span className="text-label-sm text-error -mt-2 px-1">{passwordError}</span>
      )}

      <div className="pt-2">
        <Button
          variant="primary"
          type="submit"
          className="w-full py-3 shadow-lg shadow-primary/20"
        >
          Redefinir Senha e Entrar
          <i className="fi fi-rr-check-circle text-[18px]"></i>
        </Button>
      </div>
    </form>
  );
}
