import { FormEvent } from "react";
import { TextInput } from "@/ui/TextInput";

interface StepRequestCodeProps {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function StepRequestCode({ email, onEmailChange, onSubmit }: StepRequestCodeProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextInput
        label="E-mail Institucional"
        name="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
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
  );
}
