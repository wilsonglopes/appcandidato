import { NextRequest, NextResponse } from "next/server";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import path from "path";

const CONTENT_TYPE_MAP: Record<string, string> = {
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safeFilename = path.basename(filename);
  const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadsDir, safeFilename);

  const ext = safeFilename.split(".").pop()?.toLowerCase() ?? "";
  const contentType = CONTENT_TYPE_MAP[ext] ?? "application/octet-stream";

  try {
    const fileStat = await stat(filePath);
    const fileSize = fileStat.size;
    const rangeHeader = request.headers.get("range");

    if (rangeHeader) {
      const [rawStart, rawEnd] = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(rawStart, 10);
      const end = rawEnd ? parseInt(rawEnd, 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = createReadStream(filePath, { start, end });
      const readableStream = new ReadableStream({
        start(controller) {
          stream.on("data", (chunk) => controller.enqueue(chunk));
          stream.on("end", () => controller.close());
          stream.on("error", (err) => controller.error(err));
        },
        cancel() {
          stream.destroy();
        },
      });

      return new NextResponse(readableStream, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const stream = createReadStream(filePath);
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
      cancel() {
        stream.destroy();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Content-Length": fileSize.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
