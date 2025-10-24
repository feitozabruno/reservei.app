"use client";
import { ProfessionalForm } from "../completar-perfil/profissional/components/ProfessionalForm";
import { useAuth } from "@/contexts/Auth";
import { Loader2 } from "lucide-react";
import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }
  return response.json();
};

function formatAvailabilityForFrontend(apiResponse) {
  const workingDays = Array.from({ length: 7 }, (_, index) => ({
    day: index + 1,
    enabled: false,
    blocks: [],
  }));

  for (const slot of apiResponse) {
    const apiDayOfWeek = slot.day_of_week;
    const targetIndex = apiDayOfWeek === 0 ? 6 : apiDayOfWeek - 1;

    if (targetIndex >= 0 && targetIndex < 7) {
      const dayObject = workingDays[targetIndex];
      dayObject.enabled = true;

      dayObject.blocks.push({
        id: slot.id,
        start: slot.start_time.slice(0, 5),
        end: slot.end_time.slice(0, 5),
      });
    }
  }

  return workingDays;
}

export default function ProfessionalProfile() {
  const { user, isLoading: isAuthLoading, error: authError } = useAuth();

  const {
    data: availabilityData,
    error: availabilityError,
    isLoading: isAvailabilityLoading,
  } = useSWR(user ? "/api/v1/availability" : null, fetcher);

  const isLoading = isAuthLoading || isAvailabilityLoading;
  const error = authError || availabilityError;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return <div>Perfil profissional não encontrado ou ocorreu um erro.</div>;
  }

  const workingDays = availabilityData
    ? formatAvailabilityForFrontend(availabilityData)
    : [];

  const professionalData = {
    id: user.id || null,
    username: user.username,
    fullName: user.full_name,
    specialty: user.specialty,
    phoneNumber: user.phone_number,
    businessName: user.business_name,
    bio: user.bio,
    profileImage: user.profile_photo_url || null,
    coverImage: user.cover_picture_url || null,
    address: {
      cep: user.address_cep,
      street: user.address_street,
      number: user.address_number,
      neighborhood: user.address_neighborhood,
      city: user.address_city,
      state: user.address_state,
      complement: user.address_complement,
    },
    appointmentDuration: user.appointment_duration_minutes.toString(),
    timezone: user.timezone,
    workingDays: workingDays,
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Editar Perfil
        </h1>
        <p className="text-muted-foreground">
          Atualize suas informações profissionais
        </p>
      </div>
      <ProfessionalForm initialData={professionalData} />
    </div>
  );
}
