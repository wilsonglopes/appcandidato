// Forçando refresh das ações
"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendNotificationToAll } from "@/lib/push";
import bcrypt from "bcryptjs";
import { validateInviteCode } from "./invites";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function createPostWithMediaAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Não autorizado." };
  }

  const content = (formData.get("content") as string)?.trim() || "";
  const imageFile = formData.get("image") as File | null;
  const videoFile = formData.get("video") as File | null;

  if (!content && !imageFile && !videoFile) {
    return { success: false, error: "A postagem precisa ter texto ou mídia." };
  }

  let imageUrl: string | null = null;
  let videoUrl: string | null = null;

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    if (imageFile && imageFile.size > 0) {
      const ext = path.extname(imageFile.name) || ".jpg";
      const filename = `post-img-${session.user.id}-${Date.now()}${ext}`;
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await writeFile(path.join(uploadsDir, filename), buffer);
      imageUrl = `/api/uploads/${filename}`;
    }

    if (videoFile && videoFile.size > 0) {
      const ext = path.extname(videoFile.name) || ".mp4";
      const filename = `post-vid-${session.user.id}-${Date.now()}${ext}`;
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      await writeFile(path.join(uploadsDir, filename), buffer);
      videoUrl = `/api/uploads/${filename}`;
    }

    await prisma.post.create({
      data: {
        content: content || null,
        imageUrl,
        videoUrl,
        authorId: session.user.id!,
      },
    });

    // Disparar notificação push
    const notifText = content
      ? content.substring(0, 100) + (content.length > 100 ? "..." : "")
      : imageUrl
      ? "📸 Nova imagem publicada!"
      : "🎥 Novo vídeo publicado!";

    await sendNotificationToAll("Nova Postagem do Candidato! 📢", notifText, "/dashboard");

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar post com mídia:", error);
    return { success: false, error: "Falha ao publicar postagem." };
  }
}



export async function createPostAction(content: string) {
  const session = await auth();
  
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Não autorizado.");
  }

  if (!content || content.trim().length === 0) {
    return { success: false, error: "O conteúdo não pode estar vazio." };
  }

  try {
    await prisma.post.create({
      data: {
        content,
        authorId: session.user.id!,
      },
    });

    // Disparar Notificação
    await sendNotificationToAll(
      "Nova Postagem do Candidato! 📢",
      content.substring(0, 100) + (content.length > 100 ? "..." : ""),
      "/dashboard"
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return { success: false, error: "Falha ao publicar postagem." };
  }
}

export async function toggleLikeAction(postId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");

  const userId = session.user.id!;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao curtir:", error);
    return { success: false };
  }
}

export async function createCommentAction(postId: string, content: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");
  const userId = session.user.id!;

  if (!content || content.trim().length === 0) {
    return { success: false, error: "Comentário vazio." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true }
    });

    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, userAvatar: user?.avatarUrl };
  } catch (error) {
    console.error("Erro ao comentar:", error);
    return { success: false, error: "Erro ao enviar comentário." };
  }
}

export async function toggleSaveAction(postId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");

  const userId = session.user.id!;

  try {
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingSave) {
      await prisma.savedPost.delete({
        where: { id: existingSave.id },
      });
    } else {
      await prisma.savedPost.create({
        data: {
          postId,
          userId,
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return { success: false };
  }
}

export async function createEventAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Não autorizado.");
  }

  const data = Object.fromEntries(formData);
  const { title, description, location, date, type } = data as Record<string, string>;

  try {
    await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        type,
        authorId: session.user.id!,
      },
    });

    // Disparar Notificação de Evento
    await sendNotificationToAll(
      `Novo Evento: ${title} 🗓️`,
      `Dia ${new Date(date).toLocaleDateString('pt-BR')} às ${new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} em ${location}`,
      "/dashboard/events"
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return { success: false, error: "Falha ao criar evento." };
  }
}

export async function registerPushAction(subscription: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId: session.user.id!,
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: session.user.id!,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao registrar push:", error);
    return { success: false };
  }
}

export async function loginAction(prevState: string | undefined, formData: FormData) {
  console.log("Server Action: loginAction iniciada");
  try {
    const data = Object.fromEntries(formData);
    console.log("Dados recebidos no server:", data.email);
    
    await signIn("credentials", {
      ...data,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("Erro de autenticação capturado:", error.type);
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciais inválidas.";
        default:
          return "Algo deu errado na autenticação.";
      }
    }
    // O Next.js usa erros para redirecionar, então precisamos relançar se não for AuthError
    console.log("Erro não-AuthError (possível redirecionamento):", error);
    throw error;
  }
}


export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  const name = formData.get("name") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const file = formData.get("avatarFile") as File;

  let finalAvatarUrl = avatarUrl;

  if (file && file.size > 0) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name);
      const filename = `avatar-${session.user.id}-${Date.now()}${ext}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      const uploadPath = path.join(uploadsDir, filename);

      // Garantir que o diretório existe
      await mkdir(uploadsDir, { recursive: true });

      await writeFile(uploadPath, buffer);
      finalAvatarUrl = `/api/uploads/${filename}`;
    } catch (error) {
      console.error("Erro ao salvar arquivo de avatar:", error);
      // Se falhar o upload, mantemos a URL anterior ou a informada via texto
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { 
      name,
      avatarUrl: finalAvatarUrl
    }
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard"); // Para atualizar a sidebar em todo lugar
  return { success: true };
}

export async function registerAction(prevState: string | undefined, formData: FormData) {
  console.log("registerAction iniciada...");
  const data = Object.fromEntries(formData);
  const { name, email, password, inviteCode } = data as Record<string, string>;

  // 1. Validar convite
  const inviteCheck = await validateInviteCode(inviteCode);
  if (!inviteCheck.valid) {
    return inviteCheck.error;
  }

  try {
    // 2. Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return "Este e-mail já está cadastrado.";

    // 3. Criar usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "SUPPORTER",
      }
    });

    // 4. Marcar convite como usado
    await prisma.invite.update({
      where: { id: inviteCheck.invite!.id },
      data: { 
        used: true,
        usedById: user.id
      }
    });

  } catch (error) {
    console.error("Erro no registro:", error);
    return "Erro ao criar conta. Tente novamente.";
  }

  redirect("/login?registered=true");
}
