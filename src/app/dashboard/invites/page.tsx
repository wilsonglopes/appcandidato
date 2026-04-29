import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateInviteButton } from "@/components/invites/create-invite-button";
import { Plus, Ticket, CheckCircle2, Circle, Copy, Share2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function InvitesPage() {
  const session = await auth();
  
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const invites = await prisma.invite.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Convites</h1>
          <p className="text-muted-foreground">Gerencie quem pode acessar a rede exclusiva.</p>
        </div>
        
        <CreateInviteButton />
      </div>

      <div className="grid gap-4">
        {invites.length === 0 ? (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Ticket className="w-12 h-12 mx-auto mb-4 opacity-20" />
              Nenhum convite gerado ainda.
            </CardContent>
          </Card>
        ) : (
          invites.map((invite) => (
            <Card key={invite.id} className="overflow-hidden border-none shadow-sm group hover:shadow-md transition-all">
              <div className="flex items-center p-4 sm:p-6 gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${invite.used ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                  {invite.used ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-lg tracking-wider uppercase">{invite.code}</span>
                    <Badge variant={invite.used ? "secondary" : "default"}>
                      {invite.used ? "Usado" : "Disponível"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gerado em {new Date(invite.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!invite.used && (
                    <Button size="icon" variant="outline" className="rounded-lg h-9 w-9">
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="rounded-lg h-9 w-9">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {invite.used && (
                <div className="px-6 pb-4 pt-0 text-[10px] text-muted-foreground border-t bg-muted/5">
                  ID do Usuário: {invite.usedById}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
