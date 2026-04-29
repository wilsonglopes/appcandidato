import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users as UsersIcon, Shield, UserX, Trash2, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { UserList } from "@/components/dashboard/user-list";

export default async function UsersPage() {
  const session = await auth();
  
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBlocked: true,
      avatarUrl: true,
      createdAt: true,
    }
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <UsersIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Gestão de Colaboradores</h1>
          <p className="text-sm text-muted-foreground">Administre quem tem acesso à plataforma e seus níveis de permissão.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Colaboradores Cadastrados</CardTitle>
          <CardDescription>
            Atualmente existem {users.length} usuários no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserList users={users} currentUserId={session.user.id!} />
        </CardContent>
      </Card>
    </div>
  );
}
