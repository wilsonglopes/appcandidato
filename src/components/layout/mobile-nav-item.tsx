"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNavItem({ href, icon }: { href: string, icon: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`p-2 transition-all duration-300 flex flex-col items-center gap-1 ${
        isActive 
          ? "text-primary scale-110" 
          : "text-muted-foreground hover:text-primary/70"
      }`}
    >
      <div className={isActive ? "relative" : ""}>
        {icon}
        {isActive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
    </Link>
  );
}
