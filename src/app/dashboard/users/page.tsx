import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserList } from "@/components/dashboard/user-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default async function UsersPage() {
  const session = await auth();

  // Proteção de rota
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Buscar todos os usuários
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    }
  });

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
          <Users className="w-6 h-6" /> Gestão de Colaboradores
        </h1>
        <p className="text-muted-foreground text-sm">
          Visualize, promova ou remova usuários cadastrados no sistema.
        </p>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Colaboradores Cadastrados</CardTitle>
          <CardDescription>
            Atualmente existem {users.length} usuários no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserList users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
