"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  ShieldCheck, 
  UserMinus
} from "lucide-react";
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
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b pb-4">
        <div className="col-span-4">Colaborador</div>
        <div className="col-span-2 text-center">Cargo</div>
        <div className="col-span-2 text-center">Cadastro</div>
        <div className="col-span-4 text-right">Ações</div>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div 
            key={user.id} 
            className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl border bg-card transition-all hover:shadow-sm ${loading === user.id ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {/* User Info */}
            <div className="col-span-1 md:col-span-4 flex items-center gap-3">
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
            <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold">
                {user.role}
              </Badge>
            </div>

            {/* Date */}
            <div className="col-span-1 md:col-span-2 text-left md:text-center">
              <p className="text-xs text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Actions (Direct Buttons instead of Dropdown) */}
            <div className="col-span-1 md:col-span-4 flex justify-end gap-2">
              {user.role === 'ADMIN' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[10px]" 
                  onClick={() => handleRoleChange(user.id, 'SUPPORTER')}
                >
                  <UserMinus className="w-3 h-3 mr-1" /> Rebaixar
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[10px]" 
                  onClick={() => handleRoleChange(user.id, 'ADMIN')}
                >
                  <ShieldCheck className="w-3 h-3 mr-1" /> Promover
                </Button>
              )}
              
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-8 text-[10px]" 
                onClick={() => handleDelete(user.id)}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
