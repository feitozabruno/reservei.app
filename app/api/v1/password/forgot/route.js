import { controller } from "infra/controller.js";
import { ValidationError } from "infra/errors";
import password from "models/password.js";
import { parseRequestBody, validator, emailSchema } from "models/validator.js";
import firewall from "models/firewall.js";

async function postHandler(request) {
  await firewall.checkRateLimit(
    request.ip ?? "127.0.0.1",
    "RESEND_VERIFICATION_EMAIL",
  );

  const { email } = await parseRequestBody(request);

  if (!email) {
    throw new ValidationError({
      message: "O email é obrigatório.",
      action: "Por favor, forneça um email válido.",
    });
  }

  const sanitizedEmail = validator(email, emailSchema);

  await password.requestReset(sanitizedEmail).catch((err) => {
    console.error("Password reset request error:", err);
  });

  return new Response(null, { status: 202 }); // Accepted
}

export const POST = controller(postHandler);
