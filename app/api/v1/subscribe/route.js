import { NextResponse } from "next/server";
import { ValidationError, ServiceError } from "infra/errors.js";
import { controller } from "infra/controller.js";

async function postHandler(request) {
  const { email } = await request.json();

  if (!email || !email.includes("@")) {
    throw new ValidationError({
      message: "O formato do e-mail fornecido é inválido.",
      action: "Por favor, insira um e-mail válido.",
    });
  }

  const FORM_URL = "https://systeme.io/embedded/30294535/subscription";
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
