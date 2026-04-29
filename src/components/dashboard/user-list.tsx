"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Trash2, 
  ShieldCheck, 
  UserPlus, 
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { changeUserRoleAction, deleteUserAction } from "@/lib/actions";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  createdAt: Date;
}

export function UserList({ users }: { users: User[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(userId);
    const result = await changeUserRoleAction(userId, newRole);
    if (result.success) {
      toast.success("Cargo atualizado com sucesso!");
    } else {
      toast.error(result.error || "Erro ao mudar cargo.");
    }
    setLoading(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Tem certeza que deseja remover este colaborador permanentemente?")) return;
    
    setLoading(userId);
    const result = await deleteUserAction(userId);
    if (result.success) {
      toast.success("Usuário removido.");
    } else {
      toast.error(result.error || "Erro ao remover usuário.");
    }
    setLoading(null);
  };

  return (
    <div className="space-y-4">
      {/* Header (Desktop) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <div className="col-span-5">Colaborador</div>
        <div className="col-span-3 text-center">Cargo</div>
        <div className="col-span-3 text-center">Cadastro</div>
        <div className="col-span-1 text-right">Ação</div>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div 
            key={user.id} 
            className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl border bg-card transition-all hover:shadow-sm ${loading === user.id ? 'opacity-50' : ''}`}
          >
            {/* User Info */}
            <div className="col-span-1 md:col-span-5 flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={user.avatarUrl || ""} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center">
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold">
                {user.role}
              </Badge>
            </div>

            {/* Date */}
            <div className="col-span-1 md:col-span-3 text-left md:text-center">
              <p className="text-xs text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Actions */}
            <div className="col-span-1 md:col-span-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Ações Administrativas</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {user.role === 'ADMIN' ? (
                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'SUPPORTER')}>
                      <UserPlus className="w-4 h-4 mr-2" /> Rebaixar para Apoiador
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'ADMIN')}>
                      <ShieldCheck className="w-4 h-4 mr-2" /> Promover a Admin
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Excluir Conta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
