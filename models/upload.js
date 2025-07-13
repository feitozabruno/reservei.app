import { put } from "@vercel/blob";
import sharp from "sharp";
import { ValidationError, ServiceError } from "infra/errors.js";

async function image(userId, imageBuffer) {
  const processedImageBuffer = await processImage(imageBuffer);

  const timestamp = Date.now();
  const filename = `img-${timestamp}.webp`;
  const pathname = `users/${userId}/profile/${filename}`;

  try {
    const blob = await put(pathname, processedImageBuffer, {
      access: "public",
      contentType: "image/webp",
    });

    return blob;
  } catch (error) {
    console.error("Erro no upload para o Blob:", error);
    throw new ServiceError({
      message: "Erro no serviço de imagens.",
      action: "Tente novamente mais tarde ou entre em contato com o suporte.",
      cause: error,
    });
  }
}

async function processImage(imageBuffer) {
  try {
    return await sharp(imageBuffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();
  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    throw new ValidationError({
      message: "Erro ao processar a imagem.",
      action: "Certifique-se de que o arquivo enviado é uma imagem válida.",
      cause: error,
    });
  }
}

const upload = {
  image,
};

export default upload;
