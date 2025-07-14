"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { NotFoundError } from "infra/errors.js";

export default function AtivarConta() {
  const { token } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const activeAccount = async () => {
      if (!token) {
        setIsLoading(false);
        setError("Token não encontrado na URL.");
        return;
      }

      try {
        const response = await fetch("/api/v1/activation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenId: token }),
        });

        if (response.status !== 200) {
          const errorData = await response.json();
          throw new NotFoundError({
            message: errorData.message || "Erro ao ativar conta.",
            action: errorData.action || "Tente novamente mais tarde.",
          });
        }

        setSuccess(true);

        setTimeout(() => {
          router.push("/escolher-perfil");
        }, 3000);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    activeAccount();
  }, [token, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <p className="mt-4 text-lg">Ativando sua conta, por favor aguarde...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-destructive text-2xl font-bold">Ocorreu um erro</h1>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Link
          href="/criar-conta"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-block rounded-md px-6 py-2"
        >
          Tentar se cadastrar novamente
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Conta ativada com sucesso!
        </h1>
        <p className="text-muted-foreground mt-2">
          Você já pode acessar sua conta.
        </p>
        <div className="text-muted-foreground mt-6 flex items-center gap-2 text-lg">
          <Loader2 className="animate-spin" />
          <span>Redirecionando...</span>
        </div>
      </div>
    );
  }
}
