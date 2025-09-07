"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useCreateClientProfile() {
  const router = useRouter();

  const [formData, setFormData] = useState({ fullName: "", phoneNumber: "" });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem não pode ter mais de 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    setProfileImageFile(file);
    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
    }
    setProfileImagePreview(URL.createObjectURL(file));
    setError(null);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formDataWithImage = new FormData();
    formDataWithImage.append("json", JSON.stringify(formData));

    if (profileImageFile) {
      formDataWithImage.append("profilePhoto", profileImageFile);
    }

    try {
      const response = await fetch("/api/v1/clients", {
        method: "POST",
        body: formDataWithImage,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw { ...errorData };
      }

      router.push("/inicio");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  return {
    formData,
    isLoading,
    error,
    profileImagePreview,
    handleChange,
    handleFileSelect,
    handleSubmit,
  };
}
