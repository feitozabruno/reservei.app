"use client";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useLoginForm } from "@/hooks/useLoginForm";

function LoginForm() {
  const {
    formData,
    isLoading,
    error,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword,
  } = useLoginForm();

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Entre</CardTitle>
          <CardDescription>
            Insira os dados para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/esqueci-minha-senha"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={toggleShowPassword}
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex h-0 items-center justify-center">
                {error && (
                  <p className="text-destructive text-center text-sm">
                    {error}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Continuar"
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Novo no reservei.app?{" "}
              <Link
                href="/criar-conta"
                className="underline underline-offset-4"
              >
                Crie uma conta
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
      <LoginForm />
    </Suspense>
  );
}
