// Forçando recompilação da página para reconhecer novos campos do Prisma
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreatePostForm } from "@/components/dashboard/create-post-form";
import { PushNotificationManager } from "@/components/dashboard/push-manager";
import { Card } from "@/components/ui/card";
import { PostCard } from "@/components/dashboard/post-card";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const userName = session?.user?.name || "Apoiador";
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  // Buscar posts reais do banco de dados com contagem de likes e se o usuário curtiu
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
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
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">Feed da Campanha</h2>
      </div>

      <PushNotificationManager />

      <div className="space-y-6">
        {isAdmin && <CreatePostForm userName={userName} />}

        {posts.length === 0 ? (
          <Card className="border-none bg-muted/30 p-10 text-center">
            <p className="text-muted-foreground text-sm">Ainda não há postagens no feed.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post: any) => (
              <PostCard 
                key={post.id} 
                post={post}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
