"use client";
import { useState } from "react";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignUpForm() {
  // const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
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
      await signup(formData.name, formData.email, formData.password);

      toast.success("Conta criada com sucesso.");

      // router.push(
      //   `/confirmar-email?email=${encodeURIComponent(formData.email)}`,
      // );
    } catch (err) {
      toast.error(err.detail);
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

const signup = async (email, password) => {
  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw { ...errorData };
  }

  return;
};
