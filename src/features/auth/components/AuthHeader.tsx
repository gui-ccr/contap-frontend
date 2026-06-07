interface AuthHeaderProps {
  isLoginMode: boolean;
}

export function AuthHeader({ isLoginMode }: AuthHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-sm text-center">
      <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center border border-white/5 rim-light mb-1">
        <img src="/contauplogo.png" alt="ContaUp" className="w-10 h-10" />
      </div>
      <h1 className="text-headline-lg text-on-surface">ContaUp</h1>
      <p className="text-body-md text-on-surface-variant">
        {isLoginMode ? "Acesse sua plataforma financeira." : "Crie sua conta agora."}
      </p>
    </header>
  );
}
