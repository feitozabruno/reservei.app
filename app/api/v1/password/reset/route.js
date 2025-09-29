import { controller } from "infra/controller.js";
import { UnauthorizedError } from "infra/errors.js";
import password from "models/password.js";
import {
  parseRequestBody,
  validator,
  passwordSchema,
  tokenSchema,
} from "models/validator.js";

async function postHandler(request) {
  const { token, newPassword } = await parseRequestBody(request);

  const sanitizedToken = validator(token, tokenSchema);
  const sanitizedNewPassword = validator(newPassword, passwordSchema);

  const success = await password.reset({
    token: sanitizedToken,
    newPassword: sanitizedNewPassword,
  });

  if (!success) {
    throw new UnauthorizedError({
      message: "Token de redefinição de senha inválido ou expirado.",
    });
  }

  return new Response(null, {
    status: 204, // No Content
    headers: {
      "Set-Cookie":
        "session_id=; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    },
  });
}

export const POST = controller(postHandler);
