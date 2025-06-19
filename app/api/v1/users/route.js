import { NextResponse } from "next/server";
import user from "models/user.js";
import token from "models/token.js";
import { controller } from "infra/controller.js";
import mailer from "infra/mailer.js";

async function postHandler(request) {
  const userInputValues = await request.json();
  const newUser = await user.create(userInputValues);

  const verificationToken = await token.createEmailVerificationToken(
    newUser.id,
  );

  const verificationUrl = `https://${process.env.VERCEL_URL}/api/v1/auth/verify-email?token=${verificationToken}`;
  await mailer.sendMail({
    to: newUser.email,
    subject: "Confirme seu e-mail no reservei.app",
    text: `Olá, ${newUser.username}! Utilize esse link para verificar sua conta: ${verificationUrl}`,
    html: `Olá, ${newUser.username}! Verifique sua conta clicando no link: <a href="${verificationUrl}">Clique aqui</a>`,
  });

  return NextResponse.json(newUser, { status: 201 });
}

export const POST = controller(postHandler);
