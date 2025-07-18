"use client";

import { useState, useEffect } from "react";

export function useResendActivation(email) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;

    const intervalId = setInterval(() => {
      setCountdown((currentCountdown) => currentCountdown - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown]);

  async function handleResendEmail() {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/v1/resend-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const responseBody = await response.json();

      setStatus("success");
      setMessage(responseBody.message);
      setCountdown(90);
    } catch {
      setStatus("error");
      setMessage("Erro ao reenviar o e-mail. Tente novamente mais tarde.");
      setCountdown(10);
    }
  }

  return { status, message, countdown, handleResendEmail };
}
