import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLogged = !!req.auth;
  
  console.log(`[Proxy] Rota: ${nextUrl.pathname} | Logado: ${isLogged}`);

  const isPublicRoute = ["/", "/login", "/register"].includes(nextUrl.pathname);

  if (!isLogged && !isPublicRoute) {
    console.log(`[Proxy] Redirecionando não logado de ${nextUrl.pathname} para /login`);
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isLogged && isPublicRoute && nextUrl.pathname !== "/") {
    console.log(`[Proxy] Redirecionando logado de ${nextUrl.pathname} para /dashboard`);
    return Response.redirect(new URL("/dashboard", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
