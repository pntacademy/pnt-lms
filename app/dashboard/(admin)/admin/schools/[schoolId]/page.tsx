import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ArrowLeft, Building, Users, GraduationCap } from "lucide-react";
import Link from "next/link";
import { CreateGradeModal } from "./CreateGradeModal";
import { DeleteGradeButton } from "./DeleteGradeButton";

export default async function SchoolDetailsPage({ params }: { params: Promise<{ schoolId: string }> }) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/admin-login");
  }

  const resolvedParams = await params;

  const school = await prisma.school.findUnique({
    where: { id: resolvedParams.schoolId },
    include: {
      grades: {
        include: {
          _count: {
            select: { students: true }
          }
        }
      },
      _count: {
        select: { students: true }
      }
    }
  });

  if (!school) {
    redirect("/dashboard/admin/schools");
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/admin/schools" 
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            {school.name}
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Building className="w-4 h-4" /> {school.location || "No location set"}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {school._count.students} Total Students</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Grades / Classes</h2>
          <CreateGradeModal schoolId={school.id} />
        </div>

        {school.grades.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Grades Added</h3>
            <p className="text-slate-500 mt-1 max-w-md">Add a grade or class to this school to start uploading students and assigning content.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {school.grades.map((grade) => (
              <div key={grade.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{grade.gradeName}</h3>
                    <p className="text-sm text-slate-500">{grade._count.students} Students enrolled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/dashboard/admin/schools/${school.id}/grades/${grade.id}`}
                    className="px-4 py-2 bg-white border border-slate-200 hover:border-purple-300 hover:text-purple-600 rounded-xl text-sm font-semibold shadow-sm transition-all"
                  >
                    Manage Grade
                  </Link>
                  <DeleteGradeButton gradeId={grade.id} schoolId={school.id} gradeName={grade.gradeName} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
