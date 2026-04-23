import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role || "STUDENT";

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] selection:bg-gradient-to-br from-orange-300 to-amber-400 selection:text-slate-800">
      <DesktopSidebar role={role} />
      
      {/* 
        Main content area needs bottom padding on mobile to account for the fixed bottom nav.
        md:pb-0 removes this padding on desktop where the sidebar is used instead.
      */}
      <main className="flex-1 pb-20 md:pb-0 relative overflow-x-hidden">
        {children}
      </main>

      <MobileBottomNav role={role} />
    </div>
  );
}
