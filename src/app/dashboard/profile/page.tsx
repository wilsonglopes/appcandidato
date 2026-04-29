import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/dashboard/post-card";
import { Bookmark, User as UserIcon, Mail, ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/layout/logout-button";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Buscar dados completos do usuário para garantir que temos o avatarUrl atualizado
  const user = await prisma.user.findUnique({
    where: { id: userId || "" }
  });

  const userName = user?.name || "Apoiador";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole = user?.role || "SUPPORTER";
  const avatarUrl = user?.avatarUrl || null;

  // Buscar postagens salvas pelo usuário
  const savedPosts = await prisma.savedPost.findMany({
    where: { userId: userId || "" },
    include: {
      post: {
        include: {
          author: {
            select: {
              name: true,
              role: true,
              avatarUrl: true,
            }
          },
          _count: {
            select: { likes: true }
          },
          likes: {
            where: { userId: userId || "" },
            select: { userId: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-4 space-y-8">
      {/* User Info Header */}
      <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                  {userInitial}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{userName}</h2>
                <Badge className="w-fit mx-auto md:mx-0 uppercase text-[10px]">
                  {userRole}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{userEmail}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm">Membro da Campanha Oficial</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <LogoutButton />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Edit Form */}
      <ProfileForm initialName={userName} initialAvatar={avatarUrl} />

      {/* Saved Posts Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Bookmark className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Postagens Salvas</h3>
          <Badge variant="secondary" className="ml-auto">
            {savedPosts.length}
          </Badge>
        </div>

        {savedPosts.length === 0 ? (
          <Card className="border-none bg-muted/30 p-12 text-center">
            <Bookmark className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground text-sm">Você ainda não salvou nenhuma postagem.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Toque no ícone de marcador nas postagens para guardá-las aqui.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {savedPosts.map((saved: any) => (
              <PostCard 
                key={saved.id} 
                post={saved.post as any}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
