import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminMobileNav } from "@/components/layout/AdminMobileNav";
import Image from "next/image";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  // Protect admin routes so only admins and teachers can access them
  if (role !== "ADMIN" && role !== "TEACHER") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 pb-20 md:pb-0 relative overflow-x-hidden">
        {/* Mobile top header — logo only on small screens */}
        <header className="md:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 shadow-md">
          <Image src="/logo.svg" alt="PNT Academy" width={36} height={36} className="rounded-lg" />
          <div>
            <p className="font-black text-sm uppercase tracking-tight text-white leading-none">PNT Academy</p>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Staff Portal</p>
          </div>
        </header>
        {children}
      </main>
      <AdminMobileNav />
    </div>
  );
}
