import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { StudentMobileNav } from "@/components/layout/StudentMobileNav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

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

  if (role === "ADMIN" || role === "TEACHER") {
    redirect("/dashboard/admin");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <StudentSidebar />
      <main className="flex-1 pb-20 md:pb-0 relative overflow-x-hidden">
        {/* Mobile top header — logo only visible on small screens */}
        <header className="md:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
          <Image src="/logo.svg" alt="PNT Academy" width={36} height={36} className="rounded-lg" />
          <div>
            <p className="font-black text-sm uppercase tracking-tight text-slate-800 leading-none">PNT Academy</p>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Student Portal</p>
          </div>
        </header>
        {children}
      </main>
      <StudentMobileNav />
    </div>
  );
}
