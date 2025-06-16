import nodemailer from "nodemailer";
import { ServiceError } from "./errors.js";

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
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
