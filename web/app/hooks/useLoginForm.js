"use client";
import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function useLoginForm() {
  // const router = useRouter();
  // const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (error) {
      setError(null);
    }

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
      await login(formData.email, formData.password);

      toast.success("Usuário logado com sucesso.");

      // const redirectTo = searchParams.get("redirect_to");
      // router.push(redirectTo || "/inicio");
      // router.refresh();
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    formData,
    isLoading,
    error,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword,
  };
}

const login = async (email, password) => {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw { ...errorData };
  }

  return;
};
