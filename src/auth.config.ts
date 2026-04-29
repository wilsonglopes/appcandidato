import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // This will be overridden or implemented in auth.ts
        // because it needs Prisma which isn't Edge-safe
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
