import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminMobileNav } from "@/components/layout/AdminMobileNav";

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
        {children}
      </main>
      <AdminMobileNav />
    </div>
  );
}
