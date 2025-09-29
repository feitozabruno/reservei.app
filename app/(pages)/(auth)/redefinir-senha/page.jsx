"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/useResetPassword";
import { Suspense } from "react";

function RedefinirSenhaForm() {
  const { isLoading, error, success, handleSubmit } = useResetPassword();

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">Redefina sua senha</h1>
          <p className="text-center text-sm">
            Insira e confirme a nova senha para sua conta.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="password">Nova Senha *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="confirm-password">
              Confirmação da Nova Senha *
            </Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="********"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          {success && (
            <p className="text-sm font-semibold text-green-600">
              Senha redefinida com sucesso! Redirecionando para o login...
            </p>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedefinirSenhaForm />
    </Suspense>
  );
}
