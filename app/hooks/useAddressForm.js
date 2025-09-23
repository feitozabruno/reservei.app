import { useState, useEffect, useCallback } from "react";
import {
  fetchViaCEP,
  calculateTimezoneFromAddress,
  formatDateTime,
} from "@/lib/addressUtils";

const INITIAL_FORM_DATA = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  localidade: "",
  uf: "",
  timezone: "",
};

// Validação simples sem Zod
const validateForm = (data) => {
  const errors = {};

  if (!data.cep || data.cep.length !== 8) {
    errors.cep = "CEP é obrigatório e deve ter 8 dígitos";
  }
  if (!data.logradouro?.trim()) {
    errors.logradouro = "Rua é obrigatória";
  }
  if (!data.numero?.trim()) {
    errors.numero = "Número é obrigatório";
  }
  if (!data.bairro?.trim()) {
    errors.bairro = "Bairro é obrigatório";
  }
  if (!data.localidade?.trim()) {
    errors.localidade = "Cidade é obrigatória";
  }
  if (!data.uf) {
    errors.uf = "Estado é obrigatório";
  }
  if (!data.timezone) {
    errors.timezone = "Fuso horário é obrigatório";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Sanitização simples
const sanitizeInput = (fieldName, value) => {
  if (typeof value !== "string") return value;

  switch (fieldName) {
    case "cep":
      return value.replace(/\D/g, "").slice(0, 8);
    case "numero":
      return value
        .replace(/[^0-9a-zA-Z\s\-\/]/g, "")
        .slice(0, 20)
        .toUpperCase();
    case "uf":
      return value
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
    default:
      return value.replace(/[<>{}]/g, "").slice(0, 255);
  }
};

export const useAddressForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState("Aguardando fuso horário");

  // Atualiza timezone em tempo real (funcionalidade crítica para agendamentos)
  useEffect(() => {
    if (formData.timezone) {
      setCurrentTime(formatDateTime(formData.timezone));
      const interval = setInterval(() => {
        setCurrentTime(formatDateTime(formData.timezone));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCurrentTime("Aguardando fuso horário");
    }
  }, [formData.timezone]);

  // Limpa erros quando o usuário digita (exceto durante submit)
  useEffect(() => {
    if (submitStatus !== "error") {
      setErrors({});
    }
  }, [formData, submitStatus]);

  // Reset status após sucesso
  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => setSubmitStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  // Auto-preenchimento ao digitar CEP
  const handleCepChange = useCallback(async (e) => {
    const value = e.target.value;
    const sanitizedValue = sanitizeInput("cep", value);

    setFormData((prev) => ({ ...prev, cep: sanitizedValue }));

    if (sanitizedValue.length === 8) {
      setLoading(true);
      try {
        const data = await fetchViaCEP(sanitizedValue);
        if (data) {
          const calculatedTz = calculateTimezoneFromAddress(
            data.uf,
            data.localidade,
          );
          setFormData((prev) => ({
            ...prev,
            cep: sanitizedValue,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            localidade: data.localidade || "",
            uf: data.uf || "",
            timezone: calculatedTz,
          }));
          setErrors({}); // Limpa erros quando CEP é válido
        } else {
          setErrors({ cep: "CEP não encontrado" });
        }
      } catch (error) {
        setErrors({ cep: "Erro ao buscar CEP" });
      } finally {
        setLoading(false);
      }
    } else if (sanitizedValue.length === 0) {
      // Limpa campos quando CEP é apagado
      setFormData((prev) => ({
        ...prev,
        cep: "",
        logradouro: "",
        bairro: "",
        localidade: "",
        uf: "",
        timezone: "",
      }));
    }
  }, []);

  // Manipula mudanças nos inputs de texto
  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    const sanitizedValue = sanitizeInput(id, value);
    setFormData((prev) => ({ ...prev, [id]: sanitizedValue }));
  }, []);

  const handleUfChange = useCallback(
    (value) => {
      const newTz = calculateTimezoneFromAddress(value, formData.localidade);
      setFormData((prev) => ({
        ...prev,
        uf: value,
        timezone: newTz,
      }));
    },
    [formData.localidade],
  );

  const handleTimezoneChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, timezone: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmitStatus(null);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const validation = validateForm(formData);

      if (!validation.isValid) {
        setErrors(validation.errors);
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");

      try {
        // Aqui você faria a chamada para o backend
        // const response = await fetch('/api/professional-address', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });

        console.log("Dados do endereço:", formData);

        // Simula reset após sucesso (opcional)
        // setTimeout(() => resetForm(), 2000);
      } catch (error) {
        setErrors({ general: "Erro ao salvar endereço" });
        setSubmitStatus("error");
      }
    },
    [formData],
  );

  return {
    // Estados
    formData,
    loading,
    errors,
    currentTime,
    submitStatus,
    // Handlers
    handleCepChange,
    handleInputChange,
    handleUfChange,
    handleTimezoneChange,
    handleSubmit,
    // Utilitários
    resetForm,
  };
};
