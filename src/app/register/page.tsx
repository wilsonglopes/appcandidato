"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { registerAction } from "@/lib/actions";
import { ShieldCheck, UserPlus, Mail, Lock, Ticket } from "lucide-react";

export default function RegisterPage() {
  const [errorMessage, dispatch, isPending] = useActionState(registerAction, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      {/* Decorative blobs */}
      <div className="fixed top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="fixed bottom-0 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md glass border-none shadow-2xl shadow-primary/10 relative z-10 animate-in">
        <form action={dispatch}>
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-xl mb-4 flex items-center justify-center shadow-sm">
              <UserPlus className="w-6 h-6" />
            </div>
            <CardTitle className="text-3xl font-heading font-bold tracking-tight">Criar Conta</CardTitle>
            <CardDescription className="text-muted-foreground">
              Insira seus dados e o código de convite recebido.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode" className="text-sm font-medium ml-1 flex items-center gap-2">
                <Ticket className="w-3.5 h-3.5" /> Código de Convite
              </Label>
              <Input 
                id="inviteCode" 
                name="inviteCode" 
                placeholder="Ex: ABCDEFGH" 
                required 
                className="bg-background/50 border-muted-foreground/20 h-11 px-4 focus:ring-primary/50 uppercase font-mono tracking-widest"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium ml-1">Nome Completo</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Seu nome aqui" 
                required 
                className="bg-background/50 border-muted-foreground/20 h-11 px-4 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium ml-1 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> E-mail
              </Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="exemplo@email.com" 
                required 
                className="bg-background/50 border-muted-foreground/20 h-11 px-4 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" title="password" className="text-sm font-medium ml-1 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Senha
              </Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-background/50 border-muted-foreground/20 h-11 px-4 focus:ring-primary/50"
              />
            </div>

            {errorMessage && (
              <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 animate-in">
                {errorMessage}
              </p>
            )}

            <Button 
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4" 
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </span>
              ) : "Registrar na Rede"}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 text-center text-sm pb-8">
            <div className="text-muted-foreground">
              Já possui uma conta?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline transition-all">
                Fazer login
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              Ambiente Seguro
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
