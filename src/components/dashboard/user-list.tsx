"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  ShieldOff, 
  UserX, 
  UserCheck, 
  Trash2, 
  MoreVertical,
  Loader2
} from "lucide-react";
import { 
  changeUserRoleAction, 
  deleteUserAction, 
  toggleUserBlockAction 
} from "@/lib/actions";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked?: boolean;
  avatarUrl: string | null;
  createdAt: Date;
}

export function UserList({ users, currentUserId }: { users: User[], currentUserId: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (userId: string, action: () => Promise<any>, successMessage: string) => {
    setLoadingId(userId);
    try {
      const result = await action();
      if (result.success) {
        toast.success(successMessage);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao processar a ação.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <div className="col-span-5">Colaborador</div>
        <div className="col-span-2">Cargo</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-center">Cadastro</div>
        <div className="col-span-1"></div>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div 
            key={user.id} 
            className={`grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 rounded-xl border transition-all ${user.isBlocked ? 'bg-muted/30 opacity-75' : 'bg-card hover:border-primary/20 shadow-sm'}`}
          >
            {/* User Info */}
            <div className="col-span-1 md:col-span-5 flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-background">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                {user.id === currentUserId && (
                  <Badge variant="outline" className="mt-1 text-[8px] h-4">VOCÊ</Badge>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="col-span-1 md:col-span-2">
              <Badge 
                variant={user.role === "ADMIN" ? "default" : "secondary"}
                className="uppercase text-[10px]"
              >
                {user.role}
              </Badge>
            </div>

            {/* Status */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-destructive' : 'bg-green-500'}`} />
                <span className="text-xs font-medium">
                  {user.isBlocked ? 'Bloqueado' : 'Ativo'}
                </span>
              </div>
            </div>

            {/* Created At */}
            <div className="col-span-1 md:col-span-2 text-xs text-muted-foreground text-center hidden md:block">
              {new Date(user.createdAt).toLocaleDateString('pt-BR')}
            </div>

            {/* Actions */}
            <div className="col-span-1 md:col-span-1 flex justify-end">
              {user.id !== currentUserId ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={loadingId === user.id}>
                      {loadingId === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MoreVertical className="w-4 h-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Ações de Gestão</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Toggle Role */}
                    <DropdownMenuItem 
                      onClick={() => handleAction(
                        user.id, 
                        () => changeUserRoleAction(user.id, user.role === "ADMIN" ? "SUPPORTER" : "ADMIN" as any),
                        `Cargo de ${user.name} alterado.`
                      )}
                    >
                      {user.role === "ADMIN" ? (
                        <><ShieldOff className="w-4 h-4 mr-2" /> Rebaixar a Apoiador</>
                      ) : (
                        <><Shield className="w-4 h-4 mr-2" /> Promover a Admin</>
                      )}
                    </DropdownMenuItem>

                    {/* Toggle Block */}
                    <DropdownMenuItem 
                      onClick={() => handleAction(
                        user.id, 
                        () => toggleUserBlockAction(user.id),
                        user.isBlocked ? `${user.name} desbloqueado.` : `${user.name} bloqueado.`
                      )}
                      className={user.isBlocked ? "" : "text-destructive focus:text-destructive"}
                    >
                      {user.isBlocked ? (
                        <><UserCheck className="w-4 h-4 mr-2" /> Desbloquear Acesso</>
                      ) : (
                        <><UserX className="w-4 h-4 mr-2" /> Bloquear Acesso</>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    
                    {/* Delete User */}
                    <DropdownMenuItem 
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir ${user.name}? Esta ação é irreversível.`)) {
                          handleAction(
                            user.id, 
                            () => deleteUserAction(user.id),
                            "Colaborador excluído com sucesso."
                          );
                        }
                      }}
                      className="text-destructive focus:text-destructive font-bold"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Excluir permanentemente
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span className="text-[10px] text-muted-foreground uppercase font-bold px-2">Eu</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
