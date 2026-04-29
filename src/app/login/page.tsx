"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loginAction } from "@/lib/actions";

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(loginAction, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      {/* Decorative blobs */}
      <div className="fixed top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="fixed bottom-0 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-sm glass border-none shadow-2xl shadow-primary/10 relative z-10 animate-in">
        <form action={dispatch}>
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-primary rounded-xl mb-4 flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white font-heading font-bold text-xl">A</span>
            </div>
            <CardTitle className="text-3xl font-heading font-bold tracking-tight">Bem-vindo</CardTitle>
            <CardDescription className="text-muted-foreground">
              Acesse a rede exclusiva da nossa campanha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium ml-1">E-mail</Label>
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
              <Label htmlFor="password" title="password" className="text-sm font-medium ml-1">Senha</Label>
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
              className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" 
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : "Entrar na Rede"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm pb-8">
            <div className="text-muted-foreground">
              Ainda não tem acesso?{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Use seu convite
              </Link>
            </div>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Voltar ao início
            </Link>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
