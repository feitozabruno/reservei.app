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
import { useSearchParams } from "next/navigation";
import { useResendActivation } from "app/hooks/useResendActivation.js";

export default function ConfirmarEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { status, message, countdown, handleResendEmail } =
    useResendActivation(email);

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <MailCheck className="text-primary h-10 w-10" />
        </div>
        <CardTitle className="mt-4 text-2xl">Verifique seu e-mail</CardTitle>
        <CardDescription className="text-muted-foreground mt-2">
          Enviamos um link de confirmação para sua caixa de entrada. Por favor,
          clique no link para ativar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Não recebeu o e-mail? Verifique sua pasta de spam ou clique abaixo
          para reenviar.
        </p>
        <Button
          onClick={handleResendEmail}
          disabled={status === "loading" || countdown > 0}
        >
          {status === "loading"
            ? "Enviando..."
            : countdown > 0
              ? `Aguarde (${countdown}s) para reenviar o email`
              : "Reenviar e-mail"}
        </Button>
        {message && <p className="text-muted-foreground">{message}</p>}
      </CardContent>
    </Card>
  );
}
