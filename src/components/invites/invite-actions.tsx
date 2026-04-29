"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Check } from "lucide-react";
import { toast } from "sonner";

export function InviteActions({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Convite App Candidato',
      text: `Aqui está seu convite exclusivo para participar da rede de apoiadores oficial: ${code}`,
      url: window.location.origin + '/register?invite=' + code
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await handleCopy();
        toast.info("Link de registro copiado para compartilhar!");
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        size="icon" 
        variant="outline" 
        className="rounded-lg h-9 w-9 transition-all"
        onClick={handleCopy}
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </Button>
      <Button 
        size="icon" 
        variant="ghost" 
        className="rounded-lg h-9 w-9 text-muted-foreground hover:text-primary"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
