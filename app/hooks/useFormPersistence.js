import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";

export function useFormPersistence(form, storageKey, debounceMs = 500) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        parsedData.profileImage = null;
        parsedData.coverImage = null;
        form.reset(parsedData);
      } catch (e) {
        console.error("Failed to parse saved form data:", e);
      }
    }
  }, [form, storageKey]);

  const watchedValues = form.watch();
  const debouncedWatchedValues = useDebounce(watchedValues, debounceMs);

  useEffect(() => {
    if (isMounted) {
      const dataToSave = JSON.stringify(debouncedWatchedValues);
      localStorage.setItem(storageKey, dataToSave);
    }
  }, [debouncedWatchedValues, isMounted, storageKey]);
}
