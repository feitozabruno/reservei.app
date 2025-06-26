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

export const CreateUserSchema = z.object({
  username: usernameSchema,
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
