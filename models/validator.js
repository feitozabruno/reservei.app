import { z, ZodError } from "zod";
import { ValidationError } from "infra/errors.js";

export function validator(data, schema) {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0];
      const errorPath = firstIssue.path.join(".");

      const actionMessage = errorPath
        ? `Verifique o campo '${errorPath}' e tente novamente.`
        : null;

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
    if (Object.keys(body).length === 0) {
      throw new Error();
    }
    return body;
  } catch (error) {
    throw new ValidationError({
      message: "O corpo da requisição está vazio ou não é um JSON válido.",
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
    required_error: "O campo 'username' é obrigatório.",
    invalid_type_error: "O campo 'username' deve ser uma string.",
  })
  .trim()
  .min(3, { message: "O 'username' deve ter no mínimo 3 caracteres." })
  .max(30, { message: "O 'username' deve ter no máximo 30 caracteres." })
  .regex(/^[a-z0-9]+$/i, {
    message: "O 'username' pode conter apenas letras e números.",
  });

const emailSchema = z
  .string({
    required_error: "O campo 'email' é obrigatório.",
    invalid_type_error: "O campo 'email' deve ser uma string.",
  })
  .trim()
  .min(8, { message: "O 'email' deve ter no mínimo 8 caracteres." })
  .max(254, { message: "O 'email' deve ter no máximo 254 caracteres." })
  .email({ message: "Formato de e-mail inválido." });

const passwordSchema = z
  .string({
    required_error: "O campo 'password' é obrigatório.",
    invalid_type_error: "O campo 'password' deve ser uma string.",
  })
  .trim()
  .min(6, { message: "A senha deve ter no mínimo 6 caracteres." })
  .max(72, { message: "A senha deve ter no máximo 72 caracteres." });

const tokenSchema = z
  .string({
    invalid_type_error: "O 'token' enviado deve ser uma string.",
  })
  .trim()
  .min(1, { message: "O 'token' não pode estar vazio." })
  .regex(/^[a-f0-9]+$/i, {
    message: "O formato do 'token' é inválido.",
  });

const userIdSchema = z
  .string({
    required_error: "O campo 'user_id' é obrigatório.",
    invalid_type_error: "O campo 'user_id' deve ser uma string.",
  })
  .trim()
  .min(36, { message: "O 'user_id' deve ter 36 caracteres." })
  .max(36, { message: "O 'user_id' deve ter 36 caracteres." })
  .regex(/^[a-f0-9-]+$/i, {
    message: "O 'user_id' deve ser um UUID válido.",
  });

const fullNameSchema = z
  .string({
    required_error: "O campo 'full_name' é obrigatório.",
    invalid_type_error: "O campo 'full_name' deve ser uma string.",
  })
  .trim()
  .min(3, { message: "O 'full_name' deve ter no mínimo 3 caracteres." })
  .max(50, { message: "O 'full_name' deve ter no máximo 50 caracteres." });

const phoneNumberSchema = z
  .string({
    required_error: "O campo 'phone_number' é obrigatório.",
    invalid_type_error: "O campo 'phone_number' deve ser uma string.",
  })
  .trim()
  .min(10, { message: "O 'phone_number' deve ter no mínimo 10 caracteres." })
  .max(15, { message: "O 'phone_number' deve ter no máximo 15 caracteres." })
  .regex(/^\+?[0-9\s-]+$/, {
    message: "O 'phone_number' deve conter apenas números, espaços e traços.",
  });

const businessNameSchema = z
  .string({
    invalid_type_error: "O campo 'business_name' deve ser uma string.",
  })
  .trim()
  .max(50, { message: "O 'business_name' deve ter no máximo 50 caracteres." });

const bioSchema = z
  .string({
    invalid_type_error: "O campo 'bio' deve ser uma string.",
  })
  .trim()
  .max(200, { message: "A 'bio' deve ter no máximo 200 caracteres." });

const specialtySchema = z
  .string({
    required_error: "O campo 'specialty' é obrigatório.",
    invalid_type_error: "O campo 'specialty' deve ser uma string.",
  })
  .trim()
  .min(3, { message: "A 'specialty' deve ter no mínimo 3 caracteres." })
  .max(100, { message: "A 'specialty' deve ter no máximo 100 caracteres." });

const profilePhotoSchema = z
  .string({
    invalid_type_error: "O campo 'profile_picture' deve ser uma string.",
  })
  .trim()
  .url({ message: "O 'profile_picture' deve ser uma URL válida." })
  .regex(/^https:\/\/.*\.public\.blob\.vercel-storage\.com\/.*/, {
    message: "A URL da imagem de perfil não é válida.",
  });

const coverPictureSchema = z
  .string({
    invalid_type_error: "O campo 'cover_picture' deve ser uma string.",
  })
  .trim()
  .url({ message: "O 'cover_picture' deve ser uma URL válida." })
  .regex(/^https:\/\/.*\.public\.blob\.vercel-storage\.com\/.*/, {
    message: "A URL da imagem de capa não é válida.",
  });

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

export const CreateProfessionalSchema = z.object({
  userId: userIdSchema,
  username: usernameSchema,
  fullName: fullNameSchema,
  phoneNumber: phoneNumberSchema,
  businessName: businessNameSchema.optional(),
  bio: bioSchema.optional(),
  specialty: specialtySchema,
});

export const UpdateProfessionalSchema = z
  .object({
    username: usernameSchema.optional(),
    fullName: fullNameSchema.optional(),
    phoneNumber: phoneNumberSchema.optional(),
    businessName: businessNameSchema.optional(),
    bio: bioSchema.optional(),
    specialty: specialtySchema.optional(),
    profilePhotoUrl: profilePhotoSchema.optional(),
    coverPictureUrl: coverPictureSchema.optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: "Informe ao menos um campo válido para atualização.",
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
      message: "Informe ao menos um campo válido para atualização.",
    },
  );
