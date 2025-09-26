"use client";

import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

export const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
].sort((a, b) => a.label.localeCompare(b.label));

const UF_TO_TIMEZONE_EXCEPTIONS = {
  AC: "America/Rio_Branco",
  AM: "America/Manaus",
  MS: "America/Manaus",
  MT: "America/Manaus",
  RO: "America/Manaus",
  RR: "America/Manaus",
};

export const BRAZILIAN_TIMEZONES = [
  "America/Noronha", // UTC-02:00
  "America/Sao_Paulo", // UTC-03:00
  "America/Manaus", // UTC-04:00
  "America/Rio_Branco", // UTC-05:00
].sort();

export const fetchViaCEP = async (cep) => {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.erro ? null : data;
  } catch (error) {
    console.error("Failed to fetch from ViaCEP:", error);
    return null;
  }
};

export const calculateTimezoneFromAddress = (uf) => {
  return UF_TO_TIMEZONE_EXCEPTIONS[uf] || "America/Sao_Paulo";
};

export const formatTimezoneName = (tz) => {
  if (!tz) return "Não definido";
  const city = tz.replace("America/", "").replace(/_/g, " ");
  const offset = formatInTimeZone(new Date(), tz, "xxx", { locale: ptBR });
  return `${city} (UTC${offset})`;
};
