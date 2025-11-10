
import { BottomNav } from "@/components/layout/bottom-nav";
import { DesktopNav } from "@/components/layout/desktop-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <DesktopNav />
      <main className="flex-1 pb-24 md:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
