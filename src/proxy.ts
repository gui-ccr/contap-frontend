import { NextResponse, type NextRequest } from "next/server";
import { PUBLIC_ROUTES, SESSION_COOKIE } from "@/shared/publicRoutes";

// A validação real de token/cargo continua no backend (todo endpoint checa o
// JWT e o cargo via authMiddleware/requireCargo) e no AuthContext (que busca
// /auth/me). Este middleware só evita a navegação para páginas protegidas
// sem sessão — é uma camada de UX, não a fronteira de segurança.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isPublicRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|contauplogo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
