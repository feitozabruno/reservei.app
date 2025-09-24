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

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, [timezone]);

  return time;
}
