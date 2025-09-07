import * as cookie from "cookie";
import session from "models/session.js";
import user from "models/user.js";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "infra/errors.js";

export function authenticate(handler) {
  return async function (request, context) {
    try {
      const cookies = cookie.parse(request.headers.get("cookie") || "");
      const sessionId = cookies.session_id;

      if (!sessionId) {
        throw new ValidationError({
          message: "Cookie 'session_id' não encontrado",
          action: "Faça login novamente",
        });
      }

      const userId = await session.validate(sessionId);

      if (!userId) {
        throw new UnauthorizedError({
          message: "Sessão inválida/expirada ou usuário não encontrado",
          action: "Faça login novamente",
        });
      }

      const userFound = await user.findOneById(userId);
      if (!userFound) {
        throw new NotFoundError({
          message: "Usuário não encontrado",
          action: "Faça login novamente",
        });
      }

      request.user = userFound;

      return handler(request, context);
    } catch (err) {
      throw new UnauthorizedError({
        message: "Você não está autorizado a acessar este recurso.",
        action: "Por favor, realize o login e tente novamente.",
        cause: err,
      });
    }
  };
}
