import { AuthBackground } from "@/features/auth/components/AuthBackground";
import { CompanyForm } from "./components/CompanyForm";

export function CompanyRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-surface">
      <AuthBackground />

      <main className="w-full max-w-105 px-margin-mobile md:px-0 relative z-10">
        <div className="bg-surface-container/70 glass-panel border border-white/5 rim-light rounded-3xl p-lg shadow-2xl flex flex-col gap-xl">
          <header className="flex flex-col items-center gap-sm text-center">
            <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center border border-white/5 rim-light mb-1">
              <i className="fi fi-rr-bank text-primary text-[30px]" style={{ fontVariationSettings: '"FILL" 1' }}
              ></i>
            </div>
            <h1 className="text-headline-lg text-on-surface">ContaUp</h1>
            <p className="text-body-md text-on-surface-variant">Cadastre sua empresa para começar.</p>
          </header>

          <CompanyForm />
        </div>
      </main>
    </div>
  );
}
