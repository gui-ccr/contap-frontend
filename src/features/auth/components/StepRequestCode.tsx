import { FormEvent } from "react";
import { TextInput } from "@/ui/TextInput";
import { Button } from "@/ui/forms";

interface StepRequestCodeProps {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function StepRequestCode({ email, onEmailChange, onSubmit }: StepRequestCodeProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextInput
        label="E-mail cadastrado"
        name="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        iconName="fi-rr-envelope"
        type="email"
        placeholder="seunome@empresa.com"
        required
        autoComplete="email"
      />
      <div className="pt-2">
        <Button
          variant="primary"
          type="submit"
          className="w-full py-3 shadow-lg shadow-primary/20"
        >
          Gerar Código de Verificação
          <i className="fi fi-rr-arrow-right text-[18px]"></i>
        </Button>
      </div>
    </form>
  );
}
