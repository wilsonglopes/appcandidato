"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="w-5 h-5 mr-3" />
      Sair
    </Button>
  );
}
