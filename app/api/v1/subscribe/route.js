import { NextResponse } from "next/server";
import { ValidationError, ServiceError } from "infra/errors.js";
import { controller } from "infra/controller.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const EMAIL_MAX_LENGTH = 254;

async function postHandler(request) {
  const body = await request.json();
  const { email: rawEmail, _forceServiceError } = body;
  const email = (rawEmail || "").trim();

  if (!email || !isValidEmail(email) || email.length > EMAIL_MAX_LENGTH) {
    throw new ValidationError({
      message: "O formato do e-mail fornecido é inválido ou muito longo.",
      action: "Por favor, insira um e-mail válido com até 254 caracteres.",
    });
  }

  const FORM_URL = _forceServiceError
    ? "https://systeme.io/embedded/30294535/invalid-url"
    : "https://systeme.io/embedded/30294535/subscription";

  const formData = new URLSearchParams();
  formData.append("email", email);

  const response = await fetch(FORM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!response.ok && response.status !== 302) {
    const errorBody = await response.text();
    throw new ServiceError({
      message: "O serviço de inscrição retornou um erro inesperado.",
      action: "Aguarde alguns instantes e tente novamente.",
      cause: {
        service: "systeme.io",
        statusCode: response.status,
        body: errorBody,
      },
    });
  }

  return NextResponse.json(
    { message: "Inscrição realizada com sucesso!" },
    { status: 200 },
  );
}

export const POST = controller(postHandler);
