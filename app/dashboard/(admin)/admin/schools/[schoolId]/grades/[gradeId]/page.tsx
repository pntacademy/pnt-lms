import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ArrowLeft, Users, GraduationCap, BookOpen } from "lucide-react";
import Link from "next/link";

import { BulkUploadStudents } from "./BulkUploadStudents";
import { DeleteStudentButton } from "./DeleteStudentButton";
import { PasswordVisibilityToggle } from "./PasswordVisibilityToggle";
import { DownloadRosterButton } from "./DownloadRosterButton";
import { EnrolledStudentList } from "./EnrolledStudentList";

export default async function GradeDetailsPage({ params }: { params: Promise<{ schoolId: string; gradeId: string }> }) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/admin-login");
  }

  const resolvedParams = await params;

  const grade = await prisma.schoolGrade.findUnique({
    where: { id: resolvedParams.gradeId, schoolId: resolvedParams.schoolId },
    include: {
      school: true,
      students: {
        orderBy: { name: 'asc' }
      }
    }
  });

  const allSchoolGrades = await prisma.schoolGrade.findMany({
    where: { schoolId: resolvedParams.schoolId },
    select: { id: true, gradeName: true, schoolId: true },
    orderBy: { gradeName: 'asc' }
  });

  if (!grade) {
    redirect(`/dashboard/admin/schools/${resolvedParams.schoolId}`);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/dashboard/admin/schools/${grade.schoolId}`} 
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              Manage Grade
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <span className="font-medium text-slate-700">{grade.gradeName}</span> • <span>{grade.school.name}</span>
            </p>
          </div>
        </div>

        <Link 
          href={`/dashboard/admin/schools/${grade.schoolId}/grades/${grade.id}/materials`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <BookOpen className="w-5 h-5" />
          Daily Materials
        </Link>
      </div>

      <div className="space-y-8">
        <BulkUploadStudents 
          schoolId={grade.schoolId} 
          gradeId={grade.id} 
          gradeName={grade.gradeName} 
        />

        <EnrolledStudentList 
          students={grade.students} 
          gradeName={grade.gradeName} 
          schoolId={grade.schoolId} 
          gradeId={grade.id} 
          allSchoolGrades={allSchoolGrades} 
        />
      </div>
    </div>
  );
}
