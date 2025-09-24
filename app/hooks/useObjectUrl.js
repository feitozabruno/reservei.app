"use client";

import { useState, useEffect } from "react";

export function useObjectUrl(file) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setUrl(null);
  }, [file]);

  return url;
}
