"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createInviteAction } from "@/lib/invites";
import { Plus } from "lucide-react";

export function CreateInviteButton() {
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createInviteAction();
      if (!result.success) {
        alert(result.error);
      }
    });
  };

  return (
    <Button 
      onClick={handleCreate}
      disabled={isPending}
      className="rounded-xl shadow-lg shadow-primary/20"
    >
      <Plus className={`w-5 h-5 mr-2 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? "Gerando..." : "Gerar Novo Convite"}
    </Button>
  );
}
