"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/Auth";

export function useUpdateClientProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    if (!user || !user.id) {
      if (user && user.email) {
        setFormData((prev) => ({ ...prev, email: user.email }));
      }
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch(`/api/v1/clients/${user.id}`);

      if (response.status === 404) {
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: user.email || "",
          currentPassword: "",
          newPassword: "",
        });
        setProfileImagePreview(null);
        setIsFetching(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Falha ao carregar os dados do perfil.",
        );
      }

      const userProfile = await response.json();

      setFormData({
        fullName: userProfile.full_name || "",
        phoneNumber: userProfile.phone_number || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
      });
      setProfileImagePreview(userProfile.profile_photo_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setError("Usuário não autenticado.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dataToUpdate = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      };

      Object.keys(dataToUpdate).forEach(
        (key) =>
          (dataToUpdate[key] === "" || dataToUpdate[key] === undefined) &&
          delete dataToUpdate[key],
      );

      let response;

      if (profileImage) {
        const clientData = new FormData();
        clientData.append("json", JSON.stringify(dataToUpdate));
        clientData.append("profilePhoto", profileImage);

        response = await fetch(`/api/v1/clients/${user.id}`, {
          method: "PATCH",
          body: clientData,
        });
      } else {
        response = await fetch(`/api/v1/clients/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToUpdate),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Ocorreu um erro ao atualizar o perfil.",
        );
      }

      router.push("/meu-perfil");
      router.refresh();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isFetching,
    error,
    profileImagePreview,
    handleChange,
    handleFileSelect,
    handleSubmit,
  };
}
