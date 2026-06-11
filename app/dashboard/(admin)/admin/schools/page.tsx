import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Building, MapPin, User, Plus, GraduationCap } from "lucide-react";
import Link from "next/link";
import { CreateSchoolModal } from "./CreateSchoolModal";

export const metadata = {
  title: "School Management | PNT Academy Admin",
};

export default async function AdminSchoolsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin-login");
  }

  // Fetch all schools
  const schools = await prisma.school.findMany({
    include: {
      grades: true,
      _count: {
        select: { students: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Partner Schools</h1>
          <p className="text-slate-500 mt-1">Manage onboarded schools, specific grades, and bulk-upload students.</p>
        </div>
        
        <CreateSchoolModal />
      </div>

      {schools.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-4">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Schools Added Yet</h3>
          <p className="text-slate-500 mt-1 max-w-md">Get started by creating a new school. Once added, you can configure grades and bulk upload students using CSV.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <Link 
              href={`/dashboard/admin/schools/${school.id}`} 
              key={school.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building className="w-6 h-6" />
                </div>
                <div className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {school._count.students} Students
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-1">{school.name}</h2>
              
              <div className="space-y-2 mt-4 flex-1">
                {school.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{school.location}</span>
                  </div>
                )}
                {school.coordinatorName && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{school.coordinatorName}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900">{school.grades.length} Grades configured</span>
                <span className="text-indigo-600 font-semibold group-hover:underline">Manage &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
