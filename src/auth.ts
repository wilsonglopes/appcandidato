import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("Tentativa de login para:", credentials?.email);
        
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          try {
            const user = await prisma.user.findUnique({ where: { email } });
            
            if (!user) {
              console.log("Usuário não encontrado no banco:", email);
              return null;
            }

            const passwordsMatch = await bcrypt.compare(password, user.password);

            if (passwordsMatch) {
              console.log("Login bem-sucedido para:", email);
              return user;
            } else {
              console.log("Senha incorreta para:", email);
            }
          } catch (dbError) {
            console.error("Erro ao acessar o banco de dados durante o login:", dbError);
          }
        } else {
          console.log("Falha na validação dos campos (Zod):", parsedCredentials.error.format());
        }

        return null;
      },
    }),
  ],
});
