"use client";

import { useState, useEffect } from "react";

export function useResendActivation(email) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(90);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao reenviar e-mail.");
      }

      setStatus("success");
      setMessage(data.message);
      setCountdown(90);
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
      setCountdown(10);
    }
  }

  return { status, message, countdown, handleResendEmail };
}
