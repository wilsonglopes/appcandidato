"use client";

import { useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPostWithMediaAction } from "@/lib/actions";
import { toast } from "sonner";

export function QuickActionButton() {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 50MB.");
        return;
      }

      startTransition(async () => {
        const formData = new FormData();
        // Detecta se é imagem ou vídeo
        const isVideo = file.type.startsWith("video");
        formData.append(isVideo ? "video" : "image", file);

        const result = await createPostWithMediaAction(formData);
        if (result.success) {
          toast.success("Publicado com sucesso!");
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.error(result.error || "Erro ao publicar.");
        }
      });
    }
  };

  return (
    <div className="relative -top-5">
      <input
        ref={videoInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full shadow-lg shadow-primary/40 border-4 border-background bg-primary hover:scale-105 active:scale-95 transition-all"
        onClick={() => videoInputRef.current?.click()}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
          <Plus className="w-8 h-8" />
        )}
      </Button>
    </div>
  );
}
