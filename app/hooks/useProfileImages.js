"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useProfileImages(
  apiEndpoint,
  httpMethod = "POST",
  redirectUrl,
) {
  const router = useRouter();

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (file, type) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem não pode ter mais de 5MB.");
      return;
    }

    if (type === "profile") {
      if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }

    e.target.value = "";
  };

  const handleContinue = async () => {
    if (!profileImageFile && !coverImageFile) return;
    if (!apiEndpoint || !redirectUrl) {
      setError("apiEndpoint e redirectUrl são necessários para continuar.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();

    if (profileImageFile) {
      formData.append("profilePhoto", profileImageFile);
    }

    if (coverImageFile) {
      formData.append("coverPicture", coverImageFile);
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: httpMethod,
        body: formData,
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw { ...responseBody };
      }

      router.push(redirectUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [profileImagePreview, coverImagePreview]);

  return {
    profileImageFile,
    coverImageFile,
    profileImagePreview,
    coverImagePreview,
    isUploading,
    handleFileSelect,
    handleContinue,
    handleSkip,
    error,
  };
}
