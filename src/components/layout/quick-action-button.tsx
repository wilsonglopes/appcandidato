"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickActionButton() {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aqui poderíamos salvar temporariamente ou passar via estado
      // Por agora, vamos apenas rolar para o topo onde está o formulário
      // Em uma implementação real, poderíamos usar um Store (Zustand) para preencher o form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative -top-5">
      <input
        ref={videoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full shadow-lg shadow-primary/40 border-4 border-background bg-primary hover:scale-105 active:scale-95 transition-all"
        onClick={() => videoInputRef.current?.click()}
      >
        <Plus className="w-8 h-8" />
      </Button>
    </div>
  );
}
