"use client";

import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] selection:bg-gradient-to-br from-amber-400 to-orange-500 selection:text-slate-800">
      <DesktopSidebar />
      
      {/* 
        Main content area needs bottom padding on mobile to account for the fixed bottom nav.
        md:pb-0 removes this padding on desktop where the sidebar is used instead.
      */}
      <main className="flex-1 pb-20 md:pb-0 relative overflow-x-hidden">
        {children}
      </main>

      <MobileBottomNav />
    </div>
  );
}
