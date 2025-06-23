import nodemailer from "nodemailer";
import { ServiceError } from "./errors.js";

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: false,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

async function sendMail({ to, subject, text, html }) {
  const mailOptions = {
    from: '"reservei.app" <sistema@mg.reservei.app>',
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erro ao envial o email:", error);
    throw new ServiceError({
      message: "Erro no serviço de envio de email.",
      cause: error,
    });
  }
}

const mailer = {
  sendMail,
};

export default mailer;
