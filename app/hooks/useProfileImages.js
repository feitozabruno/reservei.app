"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useProfileImages() {
  const router = useRouter();

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (file, type) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    if (type === "profile") {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
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
    setIsUploading(true);
    const formData = new FormData();

    if (profileImageFile) {
      formData.append("profilePhoto", profileImageFile);
    }

    if (coverImageFile) {
      formData.append("coverPicture", coverImageFile);
    }

    try {
      const response = await fetch("/api/v1/professionals", {
        method: "PATCH",
        body: formData,
      });

      const result = await response.json();

      if (response.status !== 200) {
        throw new Error(
          result.error?.message || "Ocorreu um erro no servidor.",
        );
      }

      router.push("/escolher-perfil/profissional/passo-2");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    router.push("/escolher-perfil/profissional/passo-2");
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
    profileImagePreview,
    coverImagePreview,
    isUploading,
    handleFileSelect,
    handleContinue,
    handleSkip,
  };
}
