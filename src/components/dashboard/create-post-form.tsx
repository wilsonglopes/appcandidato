"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createPostWithMediaAction } from "@/lib/actions";
import { Send, Image as ImageIcon, Video, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export function CreatePostForm({ userName, avatarUrl }: { userName: string; avatarUrl?: string | null }) {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [isPending, startTransition] = useTransition();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const userInitial = userName.charAt(0).toUpperCase();

  const handleFileSelect = (file: File, type: "image" | "video") => {
    if (type === "image" && file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 10MB.");
      return;
    }
    if (type === "video" && file.size > 50 * 1024 * 1024) {
      toast.error("Vídeo muito grande. Máximo 50MB.");
      return;
    }
    setMediaFile(file);
    setMediaType(type);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handlePost = () => {
    if (!content.trim() && !mediaFile) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("content", content.trim());
      if (mediaFile && mediaType) {
        formData.append(mediaType === "image" ? "image" : "video", mediaFile);
      }

      const result = await createPostWithMediaAction(formData);
      if (result.success) {
        setContent("");
        clearMedia();
        toast.success("Postagem publicada!");
      } else {
        toast.error(result.error || "Erro ao publicar.");
      }
    });
  };

  return (
    <Card className="border-none shadow-sm mb-6 overflow-hidden animate-in">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{userInitial}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder={`O que está acontecendo na campanha, ${userName}?`}
              className="min-h-[100px] bg-muted/30 border-none focus-visible:ring-primary/20 resize-none text-base p-3 rounded-xl"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
            />

            {/* Preview de mídia */}
            {mediaPreview && (
              <div className="relative rounded-xl overflow-hidden bg-muted/30">
                {mediaType === "image" ? (
                  <img src={mediaPreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
                ) : (
                  <video src={mediaPreview} controls className="w-full max-h-64 rounded-xl" />
                )}
                <button
                  onClick={clearMedia}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                  {mediaFile?.name}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-muted/50">
              <div className="flex gap-2">
                {/* Input de imagem */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, "image");
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-lg transition-colors ${mediaType === "image" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isPending}
                  title="Adicionar imagem"
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>

                {/* Input de vídeo */}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, "video");
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-lg transition-colors ${mediaType === "video" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isPending}
                  title="Adicionar vídeo"
                >
                  <Video className="w-5 h-5" />
                </Button>
              </div>

              <Button
                onClick={handlePost}
                disabled={isPending || (!content.trim() && !mediaFile)}
                className="rounded-xl px-6 shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Publicar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
