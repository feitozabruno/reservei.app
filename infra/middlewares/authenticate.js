import * as cookie from "cookie";
import session from "models/session.js";
import user from "models/user.js";
import { UnauthorizedError } from "infra/errors.js";

export function authenticate(handler) {
  return async function (request, context) {
    try {
      const cookies = cookie.parse(request.headers.get("cookie") || "");

      const sessionId = cookies.session_id;
      if (!sessionId) {
        throw new Error();
      }

      const userId = await session.validate(sessionId);

      if (!userId) {
        throw new Error();
      }

      const userFound = await user.findOneById(userId);
      if (!userFound) {
        throw new Error();
      }

      request.user = userFound;

      return handler(request, context);
    } catch (error) {
      throw new UnauthorizedError({
        message: "Você não está autorizado a acessar este recurso.",
        action: "Por favor, realize o login e tente novamente.",
      });
    }
  };
}
