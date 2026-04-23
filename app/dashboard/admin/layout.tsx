import { auth } from "@/auth";
import { redirect } from "next/navigation";

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
    <div className="w-full">
      {children}
    </div>
  );
}
