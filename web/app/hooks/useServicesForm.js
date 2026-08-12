import { useState } from "react";

export const initialForm = {
  name: "",
  description: "",
  price: "",
  duration: "30",
};

export const DURATION_OPTIONS = [
  { value: "15", label: "15 minutos" },
  { value: "30", label: "30 minutos" },
  { value: "45", label: "45 minutos" },
  { value: "60", label: "1 hora" },
  { value: "90", label: "1 hora e 30 minutos" },
  { value: "120", label: "2 horas" },
];

export function durationLabel(value) {
  return (
    DURATION_OPTIONS.find((option) => option.value === value)?.label ??
    `${value} min`
  );
}

/**
 * Encapsula todo o estado e as regras do cadastro de serviços:
 * formulário, lista, edição, validação e feedback de sucesso/erro.
 * O componente visual só chama esses valores/handlers, sem saber
 * como o estado é guardado ou atualizado.
 */
export function useServicesForm() {
  const [form, setForm] = useState(initialForm);
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const isEditing = editingId !== null;

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSaved(false);
  }

  function submitService(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.price || !form.duration) {
      setError("Preencha o nome, o preço e a duração do atendimento.");
      setSaved(false);
      return;
    }

    if (isEditing) {
      setServices((current) =>
        current.map((service) =>
          service.id === editingId
            ? { ...service, ...form, name: form.name.trim() }
            : service,
        ),
      );
      setEditingId(null);
    } else {
      setServices((current) => [
        ...current,
        { ...form, id: Date.now(), name: form.name.trim() },
      ]);
    }
    setForm(initialForm);
    setError("");
    setSaved(true);
  }

  function editService(service) {
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
    setEditingId(service.id);
    setSaved(false);
    setError("");
  }

  function cancelEditing() {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSaved(false);
  }

  function removeService(id) {
    setServices((current) => current.filter((service) => service.id !== id));
    if (editingId === id) cancelEditing();
  }

  return {
    form,
    services,
    isEditing,
    error,
    saved,
    updateField,
    submitService,
    editService,
    cancelEditing,
    removeService,
  };
}
