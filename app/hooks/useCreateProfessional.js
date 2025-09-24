import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormCreateProfessionalSchema } from "models/validator";
import { calculateTimezoneFromAddress, fetchViaCEP } from "@/lib/addressUtils";
import { useState } from "react";
import { toast } from "sonner";
import { useFormPersistence } from "./useFormPersistence";
import { useRouter } from "next/navigation";

async function apiCreateBasicProfile(data) {
  const response = await fetch("/api/v1/professionals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw responseBody;
  }

  return responseBody;
}

async function apiUploadImage(professionalId, imageType, imageFile) {
  if (!imageFile) return { success: true };

  const formData = new FormData();
  formData.append(imageType, imageFile);

  const response = await fetch(`/api/v1/professionals/${professionalId}`, {
    method: "PATCH",
    body: formData,
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw responseBody;
  }

  return responseBody;
}

async function apiUpdateAvailability(workingDays) {
  const payload = workingDays
    .filter((day) => day.enabled && day.blocks.length > 0)
    .flatMap((day) =>
      day.blocks.map((block) => ({
        dayOfWeek: day.day % 7,
        startTime: block.start,
        endTime: block.end,
      })),
    );

  if (payload.length === 0) {
    return { success: true };
  }

  const response = await fetch("/api/v1/availability", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw responseBody;
  }

  return responseBody;
}

const FORM_STORAGE_KEY = "professional-form-data";

const initialDefaultValues = {
  username: "",
  fullName: "",
  specialty: "",
  phoneNumber: "",
  businessName: "",
  bio: "",
  profileImage: null,
  coverImage: null,
  address: {
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
  },
  appointmentDuration: 60,
  timezone: "America/Sao_Paulo",
  workingDays: [
    {
      day: 1,
      enabled: true,
      blocks: [
        { id: crypto.randomUUID(), start: "09:00", end: "13:00" },
        { id: crypto.randomUUID(), start: "15:00", end: "19:00" },
      ],
    },
    { day: 2, enabled: false, blocks: [] },
    { day: 3, enabled: false, blocks: [] },
    { day: 4, enabled: false, blocks: [] },
    { day: 5, enabled: false, blocks: [] },
    { day: 6, enabled: false, blocks: [] },
    { day: 7, enabled: false, blocks: [] },
  ],
};

export function useCreateProfessional() {
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormCreateProfessionalSchema, {
      reValidateMode: "onChange",
    }),
    defaultValues: initialDefaultValues,
    mode: "onChange",
  });

  useFormPersistence(form, FORM_STORAGE_KEY);

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    form.setValue("address.cep", cep, { shouldValidate: true });

    if (cep.length === 8) {
      setIsLoadingCep(true);
      form.clearErrors("address.cep");
      const addressData = await fetchViaCEP(cep);
      setIsLoadingCep(false);

      if (addressData) {
        const timezone = calculateTimezoneFromAddress(
          addressData.uf,
          addressData.localidade,
        );

        const currentValues = form.getValues();

        form.reset({
          ...currentValues,
          address: {
            cep: cep,
            street: addressData.logradouro || "",
            neighborhood: addressData.bairro || "",
            city: addressData.localidade || "",
            state: addressData.uf || "",
            timezone: timezone,
          },
        });
      } else {
        form.setError("address.cep", {
          type: "manual",
          message: "CEP não encontrado ou inválido.",
        });
      }
    }
  };

  const createProfessionalProfile = async (data) => {
    let newProfessional;
    try {
      newProfessional = await apiCreateBasicProfile(data);
    } catch (error) {
      form.setError("root.serverError", {
        message: error.message || "Não foi possível criar o perfil.",
      });

      toast.error(error.message || "Não foi possível criar o perfil.", {
        description: error.action || "Contate o suporte para mais informações.",
      });
      return;
    }

    try {
      await apiUploadImage(
        newProfessional.id,
        "profilePhoto",
        data.profileImage,
      );

      await apiUploadImage(newProfessional.id, "coverPicture", data.coverImage);
    } catch (error) {
      toast.warning(
        error.message || "Não foi possível salvar suas fotos de perfil.",
        {
          description:
            error.action ||
            "Você pode tentar novamente mais tarde em seu perfil.",
        },
      );
    }

    try {
      await apiUpdateAvailability(data.workingDays);
    } catch (error) {
      toast.warning(error.message || "Aviso: Falha nos Horários", {
        description:
          error.action ||
          "Não foi possível salvar sua disponibilidade. Por favor, verifique seus horários no seu perfil.",
      });
    }

    toast.success("Perfil criado com sucesso!");
    router.push(`/@${newProfessional.username}`);
    localStorage.removeItem(FORM_STORAGE_KEY);
    form.reset(initialDefaultValues);
  };

  const onSubmit = (data) => {
    return createProfessionalProfile(data);
  };

  return {
    form,
    isLoadingCep,
    handleCepChange,
    onSubmit,
  };
}
