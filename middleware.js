import { NotFoundError, MethodNotAllowedError } from "infra/errors.js";
import { NextResponse } from "next/server";

const apiRoutes = [
  { pattern: /^\/api\/v1\/status$/, methods: ["GET"] },
  { pattern: /^\/api\/v1\/migrations$/, methods: ["GET", "POST"] },
  { pattern: /^\/api\/v1\/subscribe$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/users$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/users\/[^/]+$/, methods: ["GET", "PATCH"] },
  { pattern: /^\/api\/v1\/activation$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/resend-activation$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/sessions$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/sessions\/me$/, methods: ["GET"] },
  { pattern: /^\/api\/v1\/sessions\/verify$/, methods: ["GET"] },
  { pattern: /^\/api\/v1\/upload$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/clients$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/clients\/[^/]+$/, methods: ["GET", "PATCH"] },
  { pattern: /^\/api\/v1\/professionals$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/professionals\/[^/]+$/, methods: ["GET", "PATCH"] },
  { pattern: /^\/api\/v1\/professionals\/profile\/[^/]+$/, methods: ["GET"] },
  {
    pattern: /^\/api\/v1\/professionals\/[^/]+\/appointments$/,
    methods: ["GET"],
  },
  {
    pattern: /^\/api\/v1\/professionals\/[^/]+\/available-slots$/,
    methods: ["GET"],
  },
  { pattern: /^\/api\/v1\/availability$/, methods: ["GET", "POST", "DELETE"] },
  { pattern: /^\/api\/v1\/appointments$/, methods: ["POST"] },
  { pattern: /^\/api\/v1\/appointments\/[^/]+$/, methods: ["DELETE"] },
];

function handleApiValidation(request) {
  const { pathname } = request.nextUrl;
  const { method } = request;

  const matchedRoute = apiRoutes.find((route) => route.pattern.test(pathname));

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

  return null;
}

async function handlePageProtection(request) {
  const token = request.cookies.get("session_id")?.value;
  const { pathname, origin } = request.nextUrl;

  const protectedPages = [
    "/completar-perfil/profissional",
    "/completar-perfil/cliente",
    "/escolher-perfil",
  ];

  const publicOnlyPages = [
    "/entrar",
    "/criar-conta",
    "/ativar-conta",
    "/confirmar-email",
  ];

  const isProtectedPage = protectedPages.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicOnlyPage = publicOnlyPages.some((route) =>
    pathname.startsWith(route),
  );

  const redirectToLogin = () => {
    const loginUrl = new URL("/entrar", request.url);
    loginUrl.searchParams.set("redirect_to", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("session_id");
    return response;
  };

  if (isProtectedPage) {
    if (!token) {
      return redirectToLogin();
    }

    try {
      const response = await fetch(`${origin}/api/v1/sessions/verify`, {
        headers: {
          Cookie: `session_id=${token}`,
        },
      });

      if (!response.ok) {
        return redirectToLogin();
      }

      const sessionData = await response.json();
      const userRole = sessionData.role;

      if (pathname === "/escolher-perfil" && userRole) {
        return NextResponse.redirect(new URL("/inicio", request.url));
      }
    } catch (error) {
      console.error("Falha ao verificar a sessão no middleware:", error);
      return redirectToLogin();
    }
  }

  if (isPublicOnlyPage && token) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }

  return null;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const response = handleApiValidation(request);
    if (response) return response;
  } else {
    const response = await handlePageProtection(request);
    if (response) return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/completar-perfil/:path*",
    "/escolher-perfil",
    "/entrar",
    "/criar-conta",
    "/ativar-conta",
    "/confirmar-email",
    "/inicio",
  ],
};
