import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { sendNotificationToAll } from "@/lib/push";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
    }

    const formData = await request.formData();
    const content = (formData.get("content") as string)?.trim() || "";
    const imageFile = formData.get("image") as File | null;
    const videoFile = formData.get("video") as File | null;

    if (!content && !imageFile && !videoFile) {
      return NextResponse.json({ success: false, error: "A postagem precisa ter texto ou mídia." });
    }

    let imageUrl: string | null = null;
    let videoUrl: string | null = null;

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

    const post = await prisma.post.create({
      data: {
        content: content || null,
        imageUrl,
        videoUrl,
        authorId: session.user.id!,
      },
      include: { author: { select: { name: true } } },
    });

    const notifBody = content
      ? content.slice(0, 100) + (content.length > 100 ? '...' : '')
      : imageUrl ? 'Nova foto publicada' : 'Novo vídeo publicado';

    sendNotificationToAll(
      `📢 Nova publicação de ${post.author.name}`,
      notifBody,
      '/dashboard'
    ).catch(err => console.error('Erro ao enviar push:', err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao criar post via API:", error);
    return NextResponse.json({ success: false, error: "Falha ao publicar postagem." }, { status: 500 });
  }
}
