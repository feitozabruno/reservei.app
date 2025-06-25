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
          router.push("/inicio");
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
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg">Ativando sua conta, por favor aguarde...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-600">Ocorreu um erro</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <Link
          href="/criar-conta"
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
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
        <p className="mt-2 text-gray-600">Você já pode acessar sua conta.</p>
        <div className="mt-6 flex items-center gap-2 text-lg text-gray-700">
          <Loader2 className="animate-spin" />
          <span>Redirecionando...</span>
        </div>
      </div>
    );
  }
}
