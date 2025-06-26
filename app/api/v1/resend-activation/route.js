import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import activation from "models/activation.js";
import {
  parseRequestBody,
  validator,
  CheckEmailSchema,
} from "models/validator.js";
import user from "models/user.js";
import firewall from "models/firewall.js";

async function postHandler(request) {
  await firewall.checkRateLimit(
    request.ip ?? "127.0.0.1",
    "RESEND_VERIFICATION_EMAIL",
  );

  const insecureEmail = await parseRequestBody(request);
  const { email: secureEmail } = validator(insecureEmail, CheckEmailSchema);
  const userFound = await user.findOneByEmail(secureEmail);

  if (!userFound.email_verified_at) {
    await activation.resendEmailVerification(userFound);
  }

  return NextResponse.json({
    message:
      "Se uma conta com este e-mail existir e não estiver verificada, um novo link foi enviado.",
  });
}

export const POST = controller(postHandler);
