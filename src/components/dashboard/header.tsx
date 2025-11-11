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

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const avatarData = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const xpForNextLevel = (user.level || 1) * 1000;
  const xpPercentage = user.xp ? (user.xp / xpForNextLevel) * 100 : 0;
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-lg border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/50">
            {avatarData && (
              <AvatarImage
                src={avatarData.imageUrl}
                alt={avatarData.description}
                data-ai-hint={avatarData.imageHint}
              />
            )}
            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold font-headline uppercase">{user.displayName}</h1>
            <div className="text-sm text-muted-foreground">
              Level {user.level || 1} • {user.xp?.toLocaleString() || 0} XP
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
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
        <Progress value={xpPercentage} className="h-2 bg-primary/20" />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {xpForNextLevel - (user.xp || 0)} XP to next level
        </p>
      </div>
       <p className="text-center text-muted-foreground text-sm mt-4 font-headline tracking-wider opacity-80">
          Play. Save. Grow.
        </p>
    </Card>
  );
}
