import { FormEvent } from "react";
import { TextInput } from "@/ui/TextInput";

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
    <button
      type="button"
      onClick={onTogglePassword}
      className="text-on-surface-variant/50 hover:text-on-surface-variant transition-colors focus:outline-none pt-1.5"
      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
    >
      <span className="material-symbols-outlined text-[20px]">
        {showPassword ? "visibility" : "visibility_off"}
      </span>
    </button>
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextInput
        label="Código de Verificação"
        name="code"
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        iconName="pin"
        type="text"
        placeholder="Digite o código de 6 dígitos"
        required
      />

      <TextInput
        label="Nova Senha"
        name="newPassword"
        value={newPassword}
        onChange={(e) => onNewPasswordChange(e.target.value)}
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
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        iconName="lock_reset"
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
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-fixed active:scale-[0.98] text-on-primary text-label-md py-3 px-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-base shadow-lg shadow-primary/20 cursor-pointer"
        >
          Redefinir Senha e Entrar
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
        </button>
      </div>
    </form>
  );
}
