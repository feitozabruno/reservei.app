import { cn } from "@/lib/utils";
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
import { Checkbox } from "./ui/checkbox";

export function SignUpForm({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Inscreva-se</CardTitle>
          <CardDescription>
            Insira os dados para criar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <p className="ml-auto inline-block text-sm text-gray-400">
                    reservei.app/@n0mePubl1c0
                  </p>
                </div>

                <Input
                  id="username"
                  type="text"
                  placeholder="n0mePubl1c0"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" checked required />
                <Label htmlFor="terms">
                  Li e estou de acordo com os
                  <Link
                    href="/termos-de-uso"
                    className="text-blue-500 hover:underline"
                    target="_blank"
                  >
                    Termos de Uso.
                  </Link>
                </Label>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Continuar
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Fazer login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
