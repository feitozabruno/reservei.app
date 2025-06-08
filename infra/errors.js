export class ServiceError extends Error {
  constructor({ message, cause }) {
    super();
    this.name = "ServiceError";
    this.message = message || "Serviço indisponível no momento";
    this.action = "Verifique se o serviço está disponível.";
    this.statusCode = 503;
    if (cause) this.cause = cause;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class InternalServerError extends Error {
  constructor({ message, statusCode, cause }) {
    super();
    this.name = "InternalServerError";
    this.message = message || "Um erro interno não esperado aconteceu.";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = statusCode || 500;
    if (cause) this.cause = cause;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  constructor({ message, action, cause }) {
    super();
    this.name = "NotFoundError";
    this.message = message || "O recurso solicitado não foi encontrado.";
    this.action = action || "Verifique se o recurso existe.";
    this.statusCode = 404;
    if (cause) this.cause = cause;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor({ message }) {
    super();
    this.name = "MethodNotAllowedError";
    this.message = message || "Método não permitido para este endpoint.";
    this.action =
      "Verifique se o método HTTP enviado é válido para este endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
