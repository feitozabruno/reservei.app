import { ForbiddenError } from "infra/errors.js";

export function authorize(allowedRoles = []) {
  return function (handler) {
    return async function (request, context) {
      const user = request.user;

      if (!user || !user.role) {
        throw new ForbiddenError();
      }

      const hasPermission = allowedRoles.includes(user.role);

      if (!hasPermission) {
        throw new ForbiddenError();
      }

      return handler(request, context);
    };
  };
}
