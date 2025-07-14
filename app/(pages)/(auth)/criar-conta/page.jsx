"use client";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useSignUpForm } from "@/hooks/useSignUpForm";

export default function SignUpPage() {
  const {
    formData,
    isLoading,
    error,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword,
  } = useSignUpForm();

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Inscreva-se</CardTitle>
            <CardDescription>
              Insira os dados para criar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
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
                <div className="flex items-center gap-3">
                  <Checkbox id="terms" checked required />
                  <Label htmlFor="terms">
                    Li e estou de acordo com os
                    <Link
                      href="/termos-de-uso"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Termos de Uso.
                    </Link>
                  </Label>
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
                    disabled={isLoading}
                    type="submit"
                    className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      "Continuar"
                    )}
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/entrar" className="underline underline-offset-4">
                  Entrar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
