import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rotas públicas dentro do scope do matcher
  // - /admin/login (a própria tela de login)
  // - /api/admin/auth (endpoint de login/logout)
  // - POST /api/orders (formulário público de encomenda cria pedido)
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/auth")
  ) {
    return NextResponse.next();
  }
  if (pathname === "/api/orders" && req.method === "POST") {
    return NextResponse.next();
  }

  // Verifica sessão
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySession(token);

  if (ok) return NextResponse.next();

  // Sem sessão válida → API responde 401, navegação redireciona para login
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  // só preserva o "next" se ainda for dentro de /admin (evita open redirect)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    url.searchParams.set("next", pathname);
  } else {
    url.searchParams.delete("next");
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/orders",
    "/api/orders/:path*",
    "/api/site",
    "/api/site/:path*",
    "/api/encomenda-styles",
    "/api/encomenda-styles/:path*",
    "/api/admin/:path*", // /api/admin/auth é liberado no código abaixo
  ],
};
