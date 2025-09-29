"use client";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EsqueciMinhaSenhaPage() {
  const { requestPasswordReset, isLoading, error, isSuccess } =
    useForgotPassword();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    await requestPasswordReset(email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">Redefinir sua senha</h1>
          <p className="text-center text-sm">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              disabled={isLoading}
            />
          </div>
          {isSuccess && (
            <p className="text-sm font-semibold text-green-600">
              Se um usuário com este e-mail existir em nosso sistema, um link
              para redefinição de senha foi enviado.
            </p>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Continuar"}
          </Button>
        </div>
      </div>
    </form>
  );
}
