
import { BottomNav } from "@/components/layout/bottom-nav";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <DesktopNav />
        <SidebarInset>
          <main className="flex-1 pb-24 md:pb-8">{children}</main>
        </SidebarInset>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
