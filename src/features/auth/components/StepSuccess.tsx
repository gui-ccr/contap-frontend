export function StepSuccess() {
  return (
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
  );
}
