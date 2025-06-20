"use client";
import { useState } from "react";
import Image from "next/image";

const logo = "/icon.png";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="mb-6">
          <Image src={logo} alt="reservei.app" width={100} height={100} />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-3xl dark:text-white">
          Uma nova experiência que conecta profissionais a clientes.
        </h1>

        <p className="mb-8 max-w-xl text-gray-600 dark:text-gray-300">
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
        <p className="mt-4 text-center text-lg font-semibold text-green-600 dark:text-green-500">
          ✅ {message}
        </p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="meu.melhor@email.com"
              required
              disabled={status === "loading"}
              className="flex-grow rounded-md border-2 border-gray-300 bg-white px-4 py-3 text-gray-800 transition-colors focus:border-blue-500 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="cursor-pointer rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-400 dark:focus:ring-offset-gray-900"
            >
              {status === "loading" ? "Enviando..." : "Quero ser avisado!"}
            </button>
          </form>

          {status === "error" && (
            <p className="mt-2 text-center text-base text-red-600 dark:text-red-500">
              ❌ {message}
            </p>
          )}
        </>
      )}
    </div>
  );
}
