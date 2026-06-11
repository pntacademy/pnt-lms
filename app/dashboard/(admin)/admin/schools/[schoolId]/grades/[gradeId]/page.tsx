import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ArrowLeft, Users, GraduationCap } from "lucide-react";
import Link from "next/link";
import { ManageGradeForm } from "./ManageGradeForm";
import { BulkUploadStudents } from "./BulkUploadStudents";
import { DeleteStudentButton } from "./DeleteStudentButton";

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

  if (!grade) {
    redirect(`/dashboard/admin/schools/${resolvedParams.schoolId}`);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/dashboard/admin/schools/${resolvedParams.schoolId}`}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            {grade.school.name} <span className="text-slate-300">/</span> {grade.gradeName}
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {grade.students.length} Total Students Configured</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Grade Content Management */}
        <div className="space-y-8">
          <ManageGradeForm 
            gradeId={grade.id} 
            schoolId={grade.schoolId} 
            initialData={{
              videoUrl: grade.videoUrl,
              notes: grade.notes,
              assignmentLink: grade.assignmentLink,
              assignmentFileUrl: grade.assignmentFileUrl
            }} 
          />
        </div>

        {/* Right Column: Student Management & Upload */}
        <div className="space-y-8">
          <BulkUploadStudents 
            schoolId={grade.schoolId} 
            gradeId={grade.id} 
            gradeName={grade.gradeName} 
          />

          {/* Student List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" /> Enrolled Students
              </h2>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {grade.students.length} Total
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {grade.students.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <GraduationCap className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-slate-500 text-sm">No students added yet. Use the bulk upload tool above.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {grade.students.map(student => (
                    <div key={student.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center rounded-xl group">
                      <div>
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{student.studentId}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                          Password Hidden
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DeleteStudentButton 
                            studentId={student.id}
                            schoolId={grade.schoolId}
                            gradeId={grade.id}
                            studentName={student.name!}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
