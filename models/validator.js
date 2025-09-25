import { z, ZodError } from "zod";
import { ValidationError } from "infra/errors.js";

export function validator(data, schema) {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0];
      const errorPath = firstIssue.path;

      const friendlyFieldNames = {
        dayOfWeek: "o dia da semana",
        startTime: "o horário de início",
        endTime: "o horário de término",
        // username: "o nome de usuário",
        // email: "o e-mail",
        // password: "a senha",
        // fullName: "o nome completo",
        // phoneNumber: "o número de telefone",
        // specialty: "a especialidade",
        // cep: "o CEP",
        // street: "a rua",
        // number: "o número",
        // neighborhood: "o bairro",
        // city: "a cidade",
        // state: "o estado",
        // appointmentDuration: "a duração da consulta",
        // timezone: "o fuso horário",
      };

      let actionMessage = null;

      if (errorPath.length > 0) {
        const fieldKey = errorPath[errorPath.length - 1];
        const friendlyName =
          friendlyFieldNames[fieldKey] || `o campo '${errorPath.join(".")}'`;
        actionMessage = `Verifique ${friendlyName} e tente novamente.`;
      }

      throw new ValidationError({
        message: firstIssue.message,
        action: actionMessage,
        cause: err,
      });
    }

    throw err;
  }
}

export async function parseRequestBody(request) {
  let body;
  try {
    body = await request.json();
    if (!body || Object.keys(body).length === 0) {
      throw new ValidationError({
        message: "O corpo da requisição está vazio ou não é um JSON válido.",
        action: "Verifique o formato dos dados enviados e tente novamente.",
      });
    }
    return body;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError({
      message: "O corpo da requisição não é um JSON válido.",
      action: "Verifique o formato dos dados enviados e tente novamente.",
      cause: error,
    });
  }
}

export async function parseMultipartFormData(request, options = {}) {
  const { jsonKey = "data", fileKeys = [] } = options;

  try {
    const formData = await request.formData();

    let jsonData = {};
    const jsonDataString = formData.get(jsonKey);

    if (jsonDataString) {
      try {
        jsonData = JSON.parse(jsonDataString);
      } catch (error) {
        throw new ValidationError({
          message: `O campo '${jsonKey}' não contém um JSON válido.`,
          cause: error,
        });
      }
    }

    const files = {};
    if (fileKeys.length > 0) {
      for (const key of fileKeys) {
        const file = formData.get(key);
        if (file && file instanceof File && file.size > 0) {
          files[key] = file;
        }
      }
    }

    return { jsonData, files };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    console.error("Falha ao processar o formulário:", error);

    throw new ValidationError({
      message: "Não foi possível processar o corpo da requisição.",
      action:
        "Verifique se o formato enviado é um 'multipart/form-data' válido.",
      cause: error,
    });
  }
}

const usernameSchema = z
  .string({
    required_error: "O nome de usuário é obrigatório.",
    invalid_type_error: "O nome de usuário deve ser um texto.",
  })
  .trim()
  .min(3, { message: "O nome de usuário deve ter no mínimo 3 caracteres." })
  .max(30, { message: "O nome de usuário deve ter no máximo 30 caracteres." })
  .regex(/^[a-z0-9]+$/i, {
    message: "O nome de usuário pode conter apenas letras e números.",
  });

const emailSchema = z
  .string({
    required_error: "O email é obrigatório.",
    invalid_type_error: "O email deve ser um texto.",
  })
  .trim()
  .min(8, { message: "O email deve ter no mínimo 8 caracteres." })
  .max(254, { message: "O email deve ter no máximo 254 caracteres." })
  .email({ message: "Formato de email inválido." });

const passwordSchema = z
  .string({
    required_error: "A senha é obrigatória.",
    invalid_type_error: "A senha deve ser um texto.",
  })
  .trim()
  .min(6, { message: "A senha deve ter no mínimo 6 caracteres." })
  .max(72, { message: "A senha deve ter no máximo 72 caracteres." });

const tokenSchema = z
  .string({
    invalid_type_error: "O token enviado deve ser um texto.",
  })
  .trim()
  .min(1, { message: "O token não pode estar vazio." })
  .regex(/^[a-f0-9]+$/i, {
    message: "O formato do token é inválido.",
  });

const userIdSchema = z
  .string({
    required_error: "O ID do usuário é obrigatório.",
    invalid_type_error: "O ID do usuário deve ser um texto.",
  })
  .trim()
  .length(36, { message: "O ID do usuário deve ter 36 caracteres." })
  .regex(/^[a-f0-9-]+$/i, {
    message: "O ID do usuário deve ser um UUID válido.",
  });

const fullNameSchema = z
  .string({
    required_error: "O nome é obrigatório.",
    invalid_type_error: "O nome deve ser um texto.",
  })
  .trim()
  .min(3, { message: "O nome deve ter no mínimo 3 caracteres." })
  .max(50, { message: "O nome deve ter no máximo 50 caracteres." });

const phoneNumberSchema = z
  .string({
    required_error: "O número do whatsapp é obrigatório.",
    invalid_type_error: "O número do whatsapp deve ser um texto.",
  })
  .trim()
  .min(10, {
    message: "O número do whatsapp deve ter no mínimo 10 caracteres.",
  })
  .max(15, {
    message: "O número do whatsapp deve ter no máximo 15 caracteres.",
  })
  .regex(/^\+?[0-9\s-]+$/, {
    message:
      "O número do whatsapp deve conter apenas números, espaços e traços.",
  });

const businessNameSchema = z
  .string({
    invalid_type_error: "O nome da empresa deve ser um texto.",
  })
  .trim()
  .max(50, { message: "O nome da empresa deve ter no máximo 50 caracteres." });

const bioSchema = z
  .string({
    invalid_type_error: "A biografia deve ser um texto.",
  })
  .trim()
  .max(200, { message: "A biografia deve ter no máximo 200 caracteres." });

const specialtySchema = z
  .string({
    required_error: "A especialidade é obrigatória.",
    invalid_type_error: "O especialidade deve ser um texto.",
  })
  .trim()
  .min(3, { message: "A especialidade deve ter no mínimo 3 caracteres." })
  .max(100, { message: "A especialidade deve ter no máximo 100 caracteres." });

const profilePhotoSchema = z
  .string({
    invalid_type_error: "A foto de perfil deve ser um texto.",
  })
  .trim()
  .url({ message: "A foto de perfil deve ser uma URL válida." })
  .regex(/^https:\/\/.*\.public\.blob\.vercel-storage\.com\/.*/, {
    message: "A URL da foto de perfil não é válida.",
  });

const coverPictureSchema = z
  .string({
    invalid_type_error: "A imagem de capa deve ser um texto.",
  })
  .trim()
  .url({ message: "O imagem de capa deve ser uma URL válida." })
  .regex(/^https:\/\/.*\.public\.blob\.vercel-storage\.com\/.*/, {
    message: "A URL da imagem de capa não é válida.",
  });

const addressCepSchema = z
  .string({
    required_error: "O CEP é obrigatório.",
    invalid_type_error: "O CEP deve ser um texto.",
  })
  .trim()
  .length(8, { message: "O CEP deve ter 8 dígitos." });

const addressStreetSchema = z
  .string({
    required_error: "O nome da rua é obrigatório.",
    invalid_type_error: "O nome da rua deve ser um texto.",
  })
  .trim()
  .min(1, { message: "O nome da rua é obrigatório." });

const addressNumberSchema = z
  .string({
    required_error: "O número do endereço é obrigatório.",
    invalid_type_error: "O número do endereço deve ser um texto.",
  })
  .trim()
  .min(1, { message: "O número do endereço é obrigatório." });

const addressNeighborhoodSchema = z
  .string({
    required_error: "O nome do bairro é obrigatório.",
    invalid_type_error: "O nome do bairro deve ser um texto.",
  })
  .trim()
  .min(1, { message: "O nome do bairro é obrigatório." });

const addressCitySchema = z
  .string({
    required_error: "O nome da cidade é obrigatório.",
    invalid_type_error: "O nome da cidade deve ser um texto.",
  })
  .trim()
  .min(1, { message: "O nome da cidade é obrigatório." });

const addressStateSchema = z
  .string({
    required_error: "O estado (UF) é obrigatório.",
    invalid_type_error: "O estado (UF) deve ser um texto.",
  })
  .trim()
  .min(2, { message: "O estado (UF) é obrigatório." });

const addressComplementSchema = z.string().optional();

const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido. Use HH:mm.");

const appointmentDurationSchema = z.coerce
  .number({
    required_error: "A duração do agendamento é obrigatória.",
    invalid_type_error: "A duração do agendamento deve ser um texto.",
  })
  .min(10, {
    message: "A duração do agendamento deve ser no mínimo 10 minutos.",
  })
  .max(120, {
    message: "A duração do agendamento deve ser no máximo 120 minutos.",
  });

const timezoneSchema = z
  .string({
    required_error: "O fuso horário é obrigatório.",
    invalid_type_error: "O fuso horário deve ser um texto.",
  })
  .trim()
  .min(1, { message: "O fuso horário é obrigatório." });

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const imageSchema = z
  .any()
  .transform((value) => (value instanceof FileList ? value[0] : value))
  .refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    "O tamanho máximo é 5MB.",
  )
  .refine(
    (file) => !file || file.type.startsWith("image/"),
    "O arquivo deve ser uma imagem.",
  )
  .optional()
  .nullable();

const timeBlockSchema = z
  .object({
    id: z.string(),
    start: timeStringSchema,
    end: timeStringSchema,
  })
  .refine((data) => data.end > data.start, {
    message: "O horário final deve ser maior que o inicial.",
    path: ["end"],
  });

const workingDaySchema = z
  .object({
    day: z.number().min(1).max(7),
    enabled: z.boolean(),
    blocks: z.array(timeBlockSchema),
  })
  .refine(
    (day) => {
      if (!day.enabled || day.blocks.length < 2) {
        return true;
      }
      const sortedBlocks = [...day.blocks].sort((a, b) =>
        a.start.localeCompare(b.start),
      );
      for (let i = 0; i < sortedBlocks.length - 1; i++) {
        const currentBlock = sortedBlocks[i];
        const nextBlock = sortedBlocks[i + 1];
        if (nextBlock.start < currentBlock.end) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Os blocos de horário não podem se sobrepor.",
      path: ["blocks"],
    },
  );

export const CreateUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const UpdateUserSchema = z
  .object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: "Informe ao menos um campo válido para atualização.",
    },
  );

export const CreateSessionSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const CheckTokenSchema = z.object({
  tokenId: tokenSchema,
});

export const CheckEmailSchema = z.object({
  email: emailSchema,
});

export const FormCreateProfessionalSchema = z.object({
  username: usernameSchema,
  fullName: fullNameSchema,
  specialty: specialtySchema,
  phoneNumber: phoneNumberSchema,
  businessName: businessNameSchema.optional(),
  bio: bioSchema.optional(),
  address: z.object({
    cep: addressCepSchema,
    street: addressStreetSchema,
    number: addressNumberSchema,
    complement: addressComplementSchema.optional(),
    neighborhood: addressNeighborhoodSchema,
    city: addressCitySchema,
    state: addressStateSchema,
  }),
  profileImage: imageSchema,
  coverImage: imageSchema,
  appointmentDuration: appointmentDurationSchema,
  timezone: timezoneSchema,
  workingDays: z.array(workingDaySchema),
});

export const CreateProfessionalSchema = z.object({
  userId: userIdSchema,
  username: usernameSchema,
  fullName: fullNameSchema,
  specialty: specialtySchema,
  phoneNumber: phoneNumberSchema,
  businessName: businessNameSchema.optional(),
  bio: bioSchema.optional(),
  address: z.object({
    cep: addressCepSchema,
    street: addressStreetSchema,
    number: addressNumberSchema,
    neighborhood: addressNeighborhoodSchema,
    city: addressCitySchema,
    state: addressStateSchema,
    complement: addressComplementSchema.optional(),
  }),
  appointmentDuration: appointmentDurationSchema,
  timezone: timezoneSchema,
});

export const UpdateProfessionalSchema = z
  .object({
    username: usernameSchema.optional(),
    fullName: fullNameSchema.optional(),
    specialty: specialtySchema.optional(),
    phoneNumber: phoneNumberSchema.optional(),
    businessName: businessNameSchema.optional(),
    bio: bioSchema.optional(),
    address: z
      .object({
        cep: addressCepSchema.optional(),
        street: addressStreetSchema.optional(),
        number: addressNumberSchema.optional(),
        complement: addressComplementSchema.optional(),
        neighborhood: addressNeighborhoodSchema.optional(),
        city: addressCitySchema.optional(),
        state: addressStateSchema.optional(),
      })
      .optional(),
    profilePhotoUrl: profilePhotoSchema.optional(),
    coverPictureUrl: coverPictureSchema.optional(),
    appointmentDuration: appointmentDurationSchema.optional(),
    timezone: timezoneSchema.optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: "Informe ao menos um dado válido para atualizar.",
    },
  );

export const CreateAvailabilitySchema = z
  .object({
    dayOfWeek: z
      .number({
        required_error: "O dia da semana é obrigatório.",
        invalid_type_error: "O dia da semana deve ser um número (0 a 6).",
      })
      .int({ message: "O dia da semana deve ser um número inteiro." })
      .min(0, {
        message:
          "O dia da semana deve ser um valor entre 0 (Domingo) e 6 (Sábado).",
      })
      .max(6, {
        message:
          "O dia da semana deve ser um valor entre 0 (Domingo) e 6 (Sábado).",
      }),
    startTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Formato de hora inválido. Use HH:mm.",
      ),
    endTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Formato de hora inválido. Use HH:mm.",
      ),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "O horário final deve ser posterior ao horário inicial.",
    path: ["endTime"],
  });

export const BulkCreateAvailabilitySchema = z.array(CreateAvailabilitySchema);

export const CreateAppointmentSchema = z.object({
  professionalProfileId: z.string().uuid(),
  startTime: z.string().datetime({
    message: "Formato de data e hora inválido. Use o formato ISO 8601.",
  }),
});

export const CreateClientSchema = z.object({
  userId: userIdSchema,
  fullName: fullNameSchema,
  phoneNumber: phoneNumberSchema,
  profilePhotoUrl: profilePhotoSchema.optional(),
});

export const UpdateClientSchema = z
  .object({
    fullName: fullNameSchema.optional(),
    phoneNumber: phoneNumberSchema.optional(),
    profilePhotoUrl: profilePhotoSchema.optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: "Informe ao menos um dado válido para atualizar.",
    },
  );

export const createProfessionalStepSchemas = [
  FormCreateProfessionalSchema.pick({
    username: true,
    fullName: true,
    specialty: true,
    phoneNumber: true,
    businessName: true,
    bio: true,
  }),
  FormCreateProfessionalSchema.pick({ profileImage: true, coverImage: true }),
  FormCreateProfessionalSchema.pick({
    address: true,
  }),
  FormCreateProfessionalSchema.pick({
    appointmentDuration: true,
    timezone: true,
    workingDays: true,
  }),
];
