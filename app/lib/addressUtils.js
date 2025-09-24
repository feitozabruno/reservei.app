"use client";

import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

// Lista de UFs do Brasil, ordenada alfabeticamente
export const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
].sort();

// Mapeamento de UF para timezone representativo da lista reduzida (baseado em offsets IANA 2025)
const UF_TO_TIMEZONE = {
  AC: "America/Rio_Branco", // -05:00
  AM: "America/Manaus", // -04:00
  MS: "America/Manaus", // -04:00
  MT: "America/Manaus", // -04:00
  RO: "America/Manaus", // -04:00
  RR: "America/Manaus", // -04:00
  AP: "America/Sao_Paulo", // -03:00
  AL: "America/Sao_Paulo", // -03:00
  BA: "America/Sao_Paulo", // -03:00
  CE: "America/Sao_Paulo", // -03:00
  DF: "America/Sao_Paulo", // -03:00
  ES: "America/Sao_Paulo", // -03:00
  GO: "America/Sao_Paulo", // -03:00
  MA: "America/Sao_Paulo", // -03:00
  MG: "America/Sao_Paulo", // -03:00
  PA: "America/Sao_Paulo", // -03:00
  PB: "America/Sao_Paulo", // -03:00
  PE: "America/Sao_Paulo", // -03:00 (default, exceto Noronha)
  PI: "America/Sao_Paulo", // -03:00
  PR: "America/Sao_Paulo", // -03:00
  RJ: "America/Sao_Paulo", // -03:00
  RN: "America/Sao_Paulo", // -03:00
  RS: "America/Sao_Paulo", // -03:00
  SC: "America/Sao_Paulo", // -03:00
  SE: "America/Sao_Paulo", // -03:00
  SP: "America/Sao_Paulo", // -03:00
  TO: "America/Sao_Paulo", // -03:00
};

// Lista reduzida para dropdown (offsets únicos)
export const BRAZILIAN_TIMEZONES = [
  "America/Noronha", // -02:00
  "America/Sao_Paulo", // -03:00
  "America/Manaus", // -04:00
  "America/Rio_Branco", // -05:00
].sort();

// Função para buscar dados ViaCEP
export const fetchViaCEP = async (cep) => {
  const cleanCep = cep.replace(/\D/g, ""); // Remove não-dígitos
  if (cleanCep.length !== 8) return null;
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (response.ok) {
      const data = await response.json();
      return data.erro ? null : data;
    }
    return null;
  } catch (error) {
    console.error("Falha ao buscar dados do ViaCEP:", error);
    return null;
  }
};

// Função para calcular timezone baseado no endereço
export const calculateTimezoneFromAddress = (uf, localidade) => {
  // Especial para Fernando de Noronha
  if (
    uf === "PE" &&
    localidade &&
    localidade.toLowerCase().includes("fernando de noronha")
  ) {
    return "America/Noronha";
  }
  // Mapeamento geral
  const tz = UF_TO_TIMEZONE[uf?.toUpperCase()];
  return tz || "America/Sao_Paulo"; // Default
};

// Função para formatar nome amigável do timezone
export const formatTimezoneName = (tz) => {
  if (!tz) return "Não definido";
  const city = tz.replace("America/", "").replace("_", " ");
  const offset = formatInTimeZone(new Date(), tz, "xxx", { locale: ptBR });
  return `${city} (UTC${offset})`;
};

// Função para formatar data/hora abreviada no timezone
export const formatDateTime = (tz) => {
  if (!tz) return "Aguardando fuso horário";
  return formatInTimeZone(new Date(), tz, "dd/MM HH:mm:ss", { locale: ptBR });
};
