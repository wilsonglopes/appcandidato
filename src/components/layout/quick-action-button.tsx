"use client";

import { useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Camera, Video, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPostWithMediaAction } from "@/lib/actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function QuickActionButton() {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Limpa o valor do input para permitir selecionar o mesmo arquivo duas vezes se necessário
    e.target.value = '';
    
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 50MB.");
        return;
      }

      startTransition(async () => {
        const formData = new FormData();
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
      {/* Input para Foto da Câmera */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      {/* Input para Vídeo da Câmera */}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      {/* Input para Galeria (Fotos ou Vídeos) */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full shadow-lg shadow-primary/40 border-4 border-background bg-primary hover:scale-105 active:scale-95 transition-all outline-none"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Plus className="w-8 h-8" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top" className="mb-2 p-2 rounded-2xl shadow-xl w-48">
          <DropdownMenuItem 
            onClick={() => photoInputRef.current?.click()}
            className="flex items-center gap-3 py-3 cursor-pointer text-base rounded-xl hover:bg-muted"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
              <Camera className="w-5 h-5" />
            </div>
            Tirar Foto
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => videoInputRef.current?.click()}
            className="flex items-center gap-3 py-3 cursor-pointer text-base rounded-xl hover:bg-muted"
          >
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600 dark:text-red-400">
              <Video className="w-5 h-5" />
            </div>
            Gravar Vídeo
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => galleryInputRef.current?.click()}
            className="flex items-center gap-3 py-3 cursor-pointer text-base rounded-xl hover:bg-muted"
          >
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            Abrir Galeria
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
