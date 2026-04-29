import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function NotificationsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Buscar notificações globais e específicas para este usuário
  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { userId: null },
        { userId: userId || "" }
      ]
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">Notificações</h2>
        <Badge variant="secondary">{notifications.length} mensagens</Badge>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="border-none bg-muted/30 p-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground text-sm">Você ainda não recebeu nenhuma notificação.</p>
          </Card>
        ) : (
          notifications.map((notif) => (
            <Link key={notif.id} href={notif.url || "/dashboard"}>
              <Card className="border-none shadow-sm hover:bg-accent transition-colors cursor-pointer group mb-4">
                <CardContent className="p-4 flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-sm truncate">{notif.title}</h3>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {new Date(notif.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {notif.body}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver detalhes <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
