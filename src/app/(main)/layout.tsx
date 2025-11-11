'use client';

import { BottomNav } from "@/components/layout/bottom-nav";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="p-4 md:hidden">
          <Skeleton className="h-14 w-full" />
        </header>
        <main className="flex-1 container mx-auto p-4 md:p-6">
           <div className="space-y-6">
            <div className="hidden md:block">
              <Skeleton className="h-[150px] w-full" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
            <Skeleton className="h-[200px] w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DesktopNav />
      <main className="flex-1 pb-24 md:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
