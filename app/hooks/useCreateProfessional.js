import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormCreateProfessionalSchema } from "models/validator";
import { calculateTimezoneFromAddress, fetchViaCEP } from "@/lib/addressUtils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFormPersistence } from "./useFormPersistence";
import { useRouter } from "next/navigation";

async function apiCreateProfile(data) {
  const formData = new FormData();
  const jsonData = {};

  for (const key in data) {
    if (data[key] instanceof File) {
      if (key === "profileImage") {
        formData.append("profilePhoto", data[key]);
      } else if (key === "coverImage") {
        formData.append("coverPicture", data[key]);
      }
    } else {
      jsonData[key] = data[key];
    }
  }

  formData.append("json", JSON.stringify(jsonData));

  const response = await fetch("/api/v1/professionals", {
    method: "POST",
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

async function apiUpdateProfile(professionalId, data) {
  const formData = new FormData();
  const jsonData = {};

  for (const key in data) {
    if (data[key] instanceof File) {
      if (key === "profileImage") {
        formData.append("profilePhoto", data[key]);
      } else if (key === "coverImage") {
        formData.append("coverPicture", data[key]);
      }
    } else {
      jsonData[key] = data[key];
    }
  }

  formData.append("json", JSON.stringify(jsonData));

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
  appointmentDuration: "30",
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

export function useCreateProfessional({ initialData = null } = {}) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm({
    resolver: zodResolver(FormCreateProfessionalSchema, {
      reValidateMode: "onChange",
    }),
    defaultValues: initialDefaultValues,
    mode: "onChange",
  });

  useFormPersistence(form, FORM_STORAGE_KEY, !isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const formData = {
        ...initialDefaultValues,
        ...initialData,
      };
      form.reset(formData);
      localStorage.removeItem(FORM_STORAGE_KEY);
    }
  }, [isEditMode, initialData, form]);

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    form.setValue("address.cep", cep, { shouldValidate: true });

    if (cep.length === 8) {
      setIsLoadingCep(true);
      form.clearErrors("address.cep");
      const addressData = await fetchViaCEP(cep);
      setIsLoadingCep(false);

      if (addressData) {
        const timezone = calculateTimezoneFromAddress(addressData.uf);

        const currentValues = form.getValues();

        form.reset({
          ...currentValues,
          address: {
            cep: cep,
            street: addressData.logradouro || "",
            neighborhood: addressData.bairro || "",
            city: addressData.localidade || "",
            state: addressData.uf || "",
          },
          timezone: timezone || currentValues.timezone,
        });
      } else {
        form.setError("address.cep", {
          type: "manual",
          message: "CEP não encontrado ou inválido.",
        });
      }
    }
  };

  const saveProfile = async (data) => {
    try {
      let professional;
      if (isEditMode) {
        professional = await apiUpdateProfile(initialData.id, data);
      } else {
        professional = await apiCreateProfile(data);
      }

      await apiUpdateAvailability(data.workingDays);

      toast.success(
        isEditMode
          ? "Perfil atualizado com sucesso!"
          : "Perfil criado com sucesso!",
      );

      if (!isEditMode) {
        localStorage.removeItem(FORM_STORAGE_KEY);
        form.reset(initialDefaultValues);
      }

      router.push(`/@${professional.username}`);
    } catch (error) {
      form.setError("root.serverError", {
        message: error.message || "Ocorreu um erro.",
      });
      toast.error(error.message || "Ocorreu um erro.", {
        description: error.action || "Contate o suporte para mais informações.",
      });
    }
  };

  const onSubmit = (data) => {
    return saveProfile(data);
  };

  return {
    form,
    isLoadingCep,
    handleCepChange,
    onSubmit,
    isEditMode,
  };
}
