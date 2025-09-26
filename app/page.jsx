"use client";
import { useState } from "react";
import { Logo } from "@/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="mb-6">
          <Logo width={48} height={62} />
        </div>

        <h1 className="text-foreground mb-4 text-3xl font-bold md:text-3xl">
          Uma nova experiência que conecta profissionais a clientes.
        </h1>

        <p className="text-muted-foreground mb-8 max-w-xl">
          Nosso aplicativo de agendamento online está sendo preparado com muito
          carinho. Deixe seu e-mail abaixo e seja o primeiro a saber quando
          estivermos no ar!
        </p>
      </div>

      <SubscribeWaitlistForm />
    </main>
  );
}

function SubscribeWaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/v1/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.action || "Algo deu errado.");
      }

      setStatus("success");
      setMessage(data.message || "Inscrição realizada com sucesso!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <div className="w-full max-w-md">
      {status === "success" ? (
        <p className="mt-4 text-center text-lg font-semibold text-green-600">
          ✅ {message}
        </p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:gap-2"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="meu.melhor@email.com"
              required
              disabled={status === "loading"}
              className="h-14 flex-grow bg-white"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="h-14 px-6 py-3"
            >
              {status === "loading" ? "Enviando..." : "Quero ser avisado!"}
            </Button>
          </form>

          {status === "error" && (
            <p className="text-destructive mt-2 text-center text-base">
              ❌ {message}
            </p>
          )}
        </>
      )}
    </div>
  );
}
