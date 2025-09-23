"use client";

import { useState, useEffect } from "react";

export function useObjectUrl(file) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);

      // Função de limpeza para revogar o URL quando o componente for desmontado
      // ou quando o arquivo mudar.
      return () => URL.revokeObjectURL(objectUrl);
    }
    // Se não for um arquivo, reseta a URL
    setUrl(null);
  }, [file]);

  return url;
}
