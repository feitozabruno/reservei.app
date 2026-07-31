import { useState, useMemo } from "react";

export function useCreateProfessionalProfile() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1
    usuario: "",
    nomeExibicao: "",
    especialidade: "",
    whatsapp: "",
    empresa: "",
    biografia: "",
    // Step 2
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const steps = useMemo(
    () => [
      {
        title: "Criar Perfil Profissional",
        subtitle: "Insira suas informações básicas.",
        fields: [
          {
            name: "usuario",
            label: "Usuário",
            placeholder: "n0mePublic0",
            icon: "AtSign",
            hint: `reservei.app/@${formData.usuario ? formData.usuario : "n0mePublic0"}`,
          },
          {
            name: "nomeExibicao",
            label: "Nome de Exibição",
            placeholder: "Dr. João Silva",
            icon: "User",
          },
          {
            name: "especialidade",
            label: "Especialidade",
            placeholder: "Barbeiro, Manicure, Psicólogo, etc.",
            icon: "Briefcase",
          },
          {
            name: "whatsapp",
            label: "Whatsapp",
            placeholder: "(10) 9.8765-4321",
            icon: "MessageCircle",
          },
          {
            name: "empresa",
            label: "Empresa",
            placeholder: "Nome do salão/clínica/negócio etc.",
            icon: "Building2",
            optional: true,
          },
          {
            name: "biografia",
            label: "Biografia",
            placeholder: "Fale um pouco sobre você e seu trabalho...",
            icon: "FileText",
            optional: true,
            type: "textarea",
          },
        ],
      },
      {
        title: "Criar Perfil Profissional",
        subtitle: "Insira o endereço de atendimento.",
        fields: [
          {
            name: "cep",
            label: "CEP",
            placeholder: "ex. 00000-000",
            hint: "Preenchimento automático do endereço ao digitar o CEP",
          },
          { name: "rua", label: "Rua", placeholder: "ex. Rua Fátima Franco" },
          { name: "numero", label: "Número", placeholder: "ex. 123" },
          {
            name: "complemento",
            label: "Complemento",
            placeholder: "Apto, sala, andar etc.",
            optional: true,
          },
          { name: "bairro", label: "Bairro", placeholder: "Centro" },
          { name: "cidade", label: "Cidade", placeholder: "ex. São Paulo" },
          { name: "estado", label: "Estado", placeholder: "ex. SP" },
        ],
      },
    ],
    [formData.usuario],
  );

  const totalSteps = steps.length;
  const progressPercentage = (currentStep / totalSteps) * 100;
  const currentStepData = steps[currentStep - 1];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError(null);
  };

  const validateStep = () => {
    const newErrors = {};
    const requiredFields = currentStepData.fields.filter((f) => !f.optional);

    requiredFields.forEach((field) => {
      if (!formData[field.name] || formData[field.name].trim() === "") {
        newErrors[field.name] = `${field.label} é obrigatório`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToAPI = async () => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("http://localhost:3000/api/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao realizar cadastro.");
      }

      const result = await response.json();
      console.log(result);
      alert("Perfil profissional criado com sucesso!");
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        submitToAPI();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  return {
    currentStep,
    totalSteps,
    formData,
    errors,
    currentStepData,
    progressPercentage,
    isSubmitting,
    apiError,
    handleInputChange,
    handleNext,
    handleBack,
  };
}
