import { TextInput } from "@/ui/TextInput";

interface AuthFormProps {
  isLoginMode: boolean;
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onTogglePassword: () => void;
  onToggleMode: () => void;
  onForgotPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthForm({
  isLoginMode,
  name, email, password, showPassword,
  onNameChange, onEmailChange, onPasswordChange,
  onTogglePassword, onToggleMode, onForgotPassword,
  onSubmit,
}: AuthFormProps) {
  const passwordToggle = (
    <button
      type="button"
      onClick={onTogglePassword}
      className="text-on-surface-variant/50 hover:text-on-surface-variant transition-colors focus:outline-none pt-1.5 cursor-pointer"
      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
    >
      <i className={`fi ${showPassword ? "visibility" : "visibility_off"} text-[20px]`}></i>
    </button>
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
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-label-sm text-primary hover:text-primary-fixed transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
            >
              Esqueci minha senha
            </button>
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
      </div>

      <div className="pt-sm flex flex-col gap-base">
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-fixed active:scale-[0.98] text-on-primary text-label-md py-3 px-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-base shadow-lg shadow-primary/20 cursor-pointer"
        >
          {isLoginMode ? "Entrar no Sistema" : "Criar Conta"}
          <span className="material-symbols-outlined text-[18px]" />
        </button>

        <button
          type="button"
          onClick={onToggleMode}
          className="text-label-sm text-primary hover:text-primary-fixed transition-colors cursor-pointer"
        >
          {isLoginMode ? "Não tem uma conta? Cadastre-se" : "Já possui conta? Fazer Login"}
        </button>
      </div>
    </form>
  );
}
