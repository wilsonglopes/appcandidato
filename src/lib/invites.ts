"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function generateInviteCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No O, 0, I, 1
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function createInviteAction() {
  console.log("createInviteAction iniciada...");
  try {
    const code = await generateInviteCode();
    console.log("Código gerado:", code);
    await prisma.invite.create({
      data: { code }
    });
    console.log("Convite salvo no banco.");
    revalidatePath("/dashboard/invites");
    return { success: true, code };
  } catch (error) {
    console.error("Erro ao criar convite:", error);
    return { success: false, error: "Não foi possível gerar o código." };
  }
}

export async function validateInviteCode(code: string) {
  const invite = await prisma.invite.findUnique({
    where: { code }
  });

  if (!invite) return { valid: false, error: "Código de convite inválido." };
  if (invite.used) return { valid: false, error: "Este código já foi utilizado." };

  return { valid: true, invite };
}
