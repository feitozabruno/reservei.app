"use client";

import { useState, useEffect } from "react";

export function useTimezoneClock(timezone) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      try {
        const formattedTime = new Intl.DateTimeFormat("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: timezone,
        }).format(new Date());
        setTime(formattedTime);
      } catch (e) {
        setTime("Fuso inválido");
      }
    };

    updateClock(); // Primeira execução imediata
    const intervalId = setInterval(updateClock, 1000);

    // Função de limpeza para remover o intervalo
    return () => clearInterval(intervalId);
  }, [timezone]); // Roda novamente se o timezone mudar

  return time;
}
