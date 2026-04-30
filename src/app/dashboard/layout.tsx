import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  MessageSquare, 
  Bell, 
  User as UserIcon, 
  Plus,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MobileNavItem } from "@/components/layout/mobile-nav-item";
import { QuickActionButton } from "@/components/layout/quick-action-button";

import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userId = session?.user?.id;

  // Buscar dados reais do usuário (para ter avatarUrl atualizado)
  const user = await prisma.user.findUnique({
    where: { id: userId || "" }
  });

  const isAdmin = user?.role === "ADMIN";
  const userName = user?.name || "Apoiador";
  const userInitial = userName.charAt(0).toUpperCase();
  const avatarUrl = user?.avatarUrl || null;

  // Buscar eventos para a sidebar direita



  // Buscar eventos para a sidebar direita
  const upcomingEvents = await prisma.event.findMany({
    orderBy: { date: "asc" },
    take: 3,
    where: { date: { gte: new Date() } }
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        userName={userName} 
        userRole={user?.role || "SUPPORTER"} 
        isAdmin={isAdmin} 
        avatarUrl={avatarUrl}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 lg:max-w-2xl lg:border-r mx-auto w-full">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 flex items-center justify-between p-4 glass lg:hidden">
            <h1 className="text-xl font-heading font-bold text-primary">App Candidato</h1>
            <Avatar className="h-8 w-8">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">{userInitial}</AvatarFallback>
              )}
            </Avatar>
          </header>

          <div className="pb-20 lg:pb-0">
            {children}
          </div>
        </main>

        {/* Right Sidebar (Desktop only) */}
        <aside className="hidden xl:block w-80 p-6 sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Sem eventos próximos.</p>
                ) : (
                  upcomingEvents.map((event: any) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm font-semibold">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass border-t flex items-center justify-around p-2 pb-safe">
        <MobileNavItem href="/dashboard" icon={<Home className="w-6 h-6" />} />
        <MobileNavItem href="/dashboard/messages" icon={<MessageSquare className="w-6 h-6" />} />
        {isAdmin && <QuickActionButton />}
        <MobileNavItem href="/dashboard/notifications" icon={<Bell className="w-6 h-6" />} />
        <MobileNavItem href="/dashboard/profile" icon={<UserIcon className="w-6 h-6" />} />
      </nav>
    </div>
  );
}
