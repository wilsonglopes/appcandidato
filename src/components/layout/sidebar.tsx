"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  MessageSquare, 
  Bell, 
  Calendar, 
  User as UserIcon, 
  Ticket,
  Users as UsersIcon
} from "lucide-react";
import { LogoutButton } from "./logout-button";

export function Sidebar({ 
  userName, 
  userRole, 
  isAdmin,
  avatarUrl
}: { 
  userName: string, 
  userRole: string, 
  isAdmin: boolean,
  avatarUrl: string | null
}) {
  const pathname = usePathname();
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside className="hidden lg:flex w-72 border-r flex-col p-6 sticky top-0 h-screen glass">
      <div className="flex flex-col h-full">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">Z</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-primary">{process.env.NEXT_PUBLIC_APP_NAME || "Zé Milton"}</h1>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Privado & Seguro</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <MenuLink href="/dashboard" icon={<Home className="w-5 h-5" />} label="Início" active={pathname === "/dashboard"} />
          <MenuLink href="/dashboard/messages" icon={<MessageSquare className="w-5 h-5" />} label="Mensagens" active={pathname === "/dashboard/messages"} />
          <MenuLink href="/dashboard/notifications" icon={<Bell className="w-5 h-5" />} label="Notificações" active={pathname === "/dashboard/notifications"} />
          <MenuLink href="/dashboard/events" icon={<Calendar className="w-5 h-5" />} label="Agenda" active={pathname === "/dashboard/events"} />
          <MenuLink href="/dashboard/profile" icon={<UserIcon className="w-5 h-5" />} label="Perfil" active={pathname === "/dashboard/profile"} />
          {isAdmin && (
            <>
              <MenuLink href="/dashboard/users" icon={<UsersIcon className="w-5 h-5" />} label="Colaboradores" active={pathname === "/dashboard/users"} />
              <MenuLink href="/dashboard/invites" icon={<Ticket className="w-5 h-5" />} label="Convites" active={pathname === "/dashboard/invites"} />
            </>
          )}
        </nav>

        <div className="pt-6 border-t">
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">{userInitial}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{userName}</p>
              <Badge variant="secondary" className="text-[10px] uppercase px-1 py-0 h-4">
                {userRole}
              </Badge>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

function MenuLink({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${active ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}>
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
}
