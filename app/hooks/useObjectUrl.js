"use client";

import { useEffect, useState } from "react";

export function useObjectUrl(object) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (typeof object === "string") {
      setUrl(object);
      return;
    }

    if (object instanceof File) {
      const newUrl = URL.createObjectURL(object);
      setUrl(newUrl);
      return () => URL.revokeObjectURL(newUrl);
    }

    setUrl(null);
  }, [object]);

  return url;
}
