
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Wallet, AreaChart, Target, User, Gamepad2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wallets", label: "Wallets", icon: Wallet },
  { href: "/simulator", label: "Simulator", icon: AreaChart },
  { href: "/quests", label: "Quests", icon: Target },
  { href: "/profile", label: "Profile", icon: User },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <Sidebar className="hidden md:block" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <Gamepad2 />
            </Link>
          </Button>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={{
                    children: item.label,
                    className: "bg-primary text-primary-foreground",
                  }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
