import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLogged = !!req.auth;
  
  const isPublicRoute = ["/", "/login", "/register"].includes(nextUrl.pathname);
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (!isLogged && isDashboardRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isLogged && isPublicRoute && nextUrl.pathname !== "/") {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
