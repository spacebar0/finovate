
'use client';

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Settings, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from '@/firebase/auth/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  user: User;
}

const getInitials = (name?: string | null) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const auth = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const xpForNextLevel = (user.level || 1) * 1000;
  const xpPercentage = user.xp ? (user.xp % 1000 / 1000) * 100 : 0;
  

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const avatarData = PlaceHolderImages.find((img) => img.id === user.avatarUrl);
  const currentAvatarUrl = avatarData ? avatarData.imageUrl : user.avatarUrl;

  return (
    <Card className="p-4" style={{ 
      background: "hsla(0, 0%, 100%, 0.05)",
      backdropFilter: "blur(12px)",
    }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/50">
            {currentAvatarUrl && (
              <AvatarImage
                src={currentAvatarUrl}
                alt={user.displayName || 'User Avatar'}
                data-ai-hint={avatarData?.imageHint}
              />
            )}
            <AvatarFallback className="text-xl font-bold">{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold font-headline uppercase">{user.displayName}</h1>
            <div className="text-sm text-muted-foreground">
              Level {user.level || 1} • {user.xp?.toLocaleString() || 0} XP
            </div>
          </div>
        </div>
        <DropdownMenu onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className={cn("h-5 w-5 transition-transform duration-300", isMenuOpen && "rotate-90")} />
              <span className="sr-only">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile" passHref>
               <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile & Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-4">
        <Progress value={xpPercentage} />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {1000 - (user.xp ? user.xp % 1000 : 0)} XP to next level
        </p>
      </div>
       <p className="text-center text-muted-foreground text-sm mt-4 font-headline tracking-wider opacity-80">
          Play. Save. Grow.
        </p>
    </Card>
  );
}
