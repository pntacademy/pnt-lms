import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { StudentMobileNav } from "@/components/layout/StudentMobileNav";
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

  if (role === "ADMIN" || role === "TEACHER") {
    redirect("/dashboard/admin");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <StudentSidebar />
      <main className="flex-1 pb-20 md:pb-0 relative overflow-x-hidden">
        {children}
      </main>
      <StudentMobileNav />
    </div>
  );
}
