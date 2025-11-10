
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, AreaChart, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wallets", label: "Wallets", icon: Wallet },
  { href: "/simulator", label: "Simulator", icon: AreaChart },
  { href: "/quests", label: "Quests", icon: Target },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/70 backdrop-blur-lg border-t z-50 md:hidden">
      <div className="container mx-auto h-full">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative w-1/5",
                  isActive && "text-primary"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 w-12 h-1 bg-primary rounded-full shadow-[0_0_12px_theme(colors.primary.DEFAULT)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
