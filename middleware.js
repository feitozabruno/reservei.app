import { NotFoundError, MethodNotAllowedError } from "infra/errors.js";
import { NextResponse } from "next/server";

const routes = [
  { pattern: /^\/api\/v1\/status$/, methods: ["GET"] },
  { pattern: /^\/api\/v1\/migrations$/, methods: ["GET", "POST"] },
  { pattern: /^\/api\/v1\/subscribe$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/users$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/users\/[^/]+$/, methods: ["GET", "PATCH"] },
  { pattern: /^\/api\/v1\/activation$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/resend-activation$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/sessions$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/professionals$/, methods: ["POST", "PATCH"] },
  { pattern: /^\/api\/v1\/upload$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/sessions\/me$/, methods: ["GET"] },
];

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  const matchedRoute = routes.find((route) => route.pattern.test(pathname));

  if (!matchedRoute) {
    const error = new NotFoundError({
      message: `Endpoint não encontrado: ${pathname}`,
      action: "Verifique se o endpoint existe e está correto.",
    });
    return NextResponse.json(error, { status: error.statusCode });
  }

  if (!matchedRoute.methods.includes(method)) {
    const error = new MethodNotAllowedError({
      message: `Método ${method} não permitido para o endpoint: ${pathname}`,
    });
    return NextResponse.json(error, { status: error.statusCode });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
