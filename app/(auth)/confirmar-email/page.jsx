"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  const handleResendEmail = async () => {
    alert("Um novo e-mail de confirmação foi enviado!");
  };

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <MailCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="mt-4 text-2xl">Verifique seu e-mail</CardTitle>
        <CardDescription className="mt-2">
          Enviamos um link de confirmação para sua caixa de entrada. Por favor,
          clique no link para ativar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-gray-500">
          Não recebeu o e-mail? Verifique sua pasta de spam ou clique abaixo
          para reenviar.
        </p>
        <Button onClick={handleResendEmail}>Reenviar e-mail</Button>
      </CardContent>
    </Card>
  );
}
