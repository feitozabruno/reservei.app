import { ProfessionalForm } from "./components/ProfessionalForm";

export default function ProfessionalRegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Profissional
        </h1>
        <p className="text-muted-foreground">
          Insira os dados para concluir seu perfil
        </p>
      </div>
      <ProfessionalForm />
    </div>
  );
}
