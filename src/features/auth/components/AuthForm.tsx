import { TextInput } from "@/ui/forms/TextInput";
import { PasswordStrengthIndicator } from "@/ui/forms/PasswordStrengthIndicator";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/ui/forms";

interface AuthFormProps {
  isLoginMode: boolean;
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  rememberMe?: boolean;
  onRememberMeChange?: (v: boolean) => void;
  onTogglePassword: () => void;
  onToggleMode: () => void;
  onForgotPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function AuthForm({
  isLoginMode,
  name, email, password, showPassword,
  onNameChange, onEmailChange, onPasswordChange,
  rememberMe, onRememberMeChange,
  onTogglePassword, onToggleMode, onForgotPassword,
  onSubmit, isLoading,
}: AuthFormProps) {
  const passwordToggle = (
    <Button
      variant="ghost"
      type="button"
      onClick={onTogglePassword}
      className="!px-2 !py-2 mt-1 mr-1 text-on-surface-variant/50 hover:text-on-surface-variant"
      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </Button>
  );

  return (
    <form className="flex flex-col gap-gutter" onSubmit={onSubmit}>
      {!isLoginMode && (
        <TextInput
          label="Nome Completo"
          name="name"
          iconName="fi-rr-user"
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          autoComplete="name"
        />
      )}

      <TextInput
        label="Email Corporativo"
        name="email"
        iconName="fi-rr-envelope"
        type="email"
        placeholder="nome@empresa.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        autoComplete="email"
      />

      <div className="flex flex-col gap-base">
        <div className="flex justify-between items-center">
          <label className="text-label-md text-on-surface-variant" htmlFor="password">
            Senha
          </label>
          {isLoginMode && (
            <Button
              variant="ghost"
              type="button"
              onClick={onForgotPassword}
              className="!text-label-sm !text-primary hover:!text-primary-fixed !px-2 !py-1"
            >
              Esqueci minha senha
            </Button>
          )}
        </div>
        <TextInput
          label=""
          name="password"
          iconName="fi-rr-lock"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          rightElement={passwordToggle}
          required
          autoComplete={isLoginMode ? "current-password" : "new-password"}
        />
        {!isLoginMode && <PasswordStrengthIndicator password={password} />}
      </div>

      {isLoginMode && (
        <div className="flex items-center gap-2 mt-[-4px]">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange?.(e.target.checked)}
            className="w-4 h-4 rounded border-white/10 bg-surface-container-high text-primary focus:ring-primary/50 focus:ring-1 outline-none cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-label-sm text-on-surface-variant cursor-pointer select-none">
            Lembrar meu e-mail
          </label>
        </div>
      )}

      <div className="pt-sm flex flex-col gap-base">
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className="w-full py-3 shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
          ) : null}
          {isLoginMode ? (isLoading ? "Entrando..." : "Entrar no Sistema") : (isLoading ? "Criando Conta..." : "Criar Conta")}
          {!isLoading && <span className="material-symbols-outlined text-[18px]" />}
        </Button>

        <Button
          variant="ghost"
          type="button"
          onClick={onToggleMode}
          className="!text-primary hover:!text-primary-fixed"
        >
          {isLoginMode ? "Não tem uma conta? Cadastre-se" : "Já possui conta? Fazer Login"}
        </Button>
      </div>
    </form>
  );
}
