import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Security: prevent path traversal
  const safeFilename = path.basename(filename);
  
  // No VPS, o process.cwd() pode variar. Vamos garantir um caminho absoluto.
  const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadsDir, safeFilename);

  console.log(`[Uploads API] Tentando ler arquivo: ${filePath}`);

  try {
    const fileBuffer = await readFile(filePath);
    console.log(`[Uploads API] Arquivo encontrado e lido: ${safeFilename}`);

    const ext = safeFilename.split(".").pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      mp4: "video/mp4",
      webm: "video/webm",
      ogg: "video/ogg",
      mov: "video/quicktime",
    };
    const contentType = contentTypeMap[ext ?? ""] ?? "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
