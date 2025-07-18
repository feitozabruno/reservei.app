"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useProfessionalProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    specialty: "",
    phoneNumber: "",
    businessName: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/professionals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw { ...errorData };
      }

      router.push("/escolher-perfil/profissional/etapa-1");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
}
