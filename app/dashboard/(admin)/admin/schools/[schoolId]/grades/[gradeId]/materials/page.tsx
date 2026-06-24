import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ArrowLeft, BookOpen, Video, FileText, Link as LinkIcon, Calendar, Film } from "lucide-react";
import Link from "next/link";
import { CreateMaterialForm } from "./CreateMaterialForm";
import { DeleteMaterialButton } from "./DeleteMaterialButton";
import { AdminVideosTab } from "./AdminVideosTab";
import { AdminTestsTab } from "./AdminTestsTab";

export default async function GradeMaterialsPage({ params, searchParams }: { params: Promise<{ schoolId: string; gradeId: string }>, searchParams: Promise<{ tab?: string }> }) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/admin-login");
  }

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams.tab || "materials";

  const grade = await (prisma.schoolGrade as any).findUnique({
    where: { id: resolvedParams.gradeId },
    include: {
      school: true,
      materials: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!grade || grade.schoolId !== resolvedParams.schoolId) {
    redirect(`/dashboard/admin/schools/${resolvedParams.schoolId}`);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/dashboard/admin/schools/${grade.schoolId}/grades/${grade.id}`} 
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              Daily Materials & Sessions
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <span className="font-medium text-slate-700">{grade.gradeName}</span> • <span>{grade.school.name}</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm mt-4 sm:mt-0 overflow-x-auto">
          <Link 
            href={`?tab=materials`} 
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${tab === 'materials' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <Video className="w-4 h-4" /> Materials & Videos
          </Link>
          <Link 
            href={`?tab=tests`} 
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${tab === 'tests' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <FileText className="w-4 h-4" /> Tests
          </Link>
        </div>
      </div>

      {tab === "materials" ? (
        <div className="space-y-12">
          {/* DAILY MATERIALS EXISTING LOGIC */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: List of Materials */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Uploaded Materials</h2>
                </div>
                
                {grade.materials.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Materials Yet</h3>
                    <p className="text-slate-500 mt-1 max-w-md">Add daily sessions, notes, or assignments using the form.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {grade.materials.map((material: any) => (
                      <div key={material.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-slate-50 transition-colors">
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">{material.title}</h3>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <Calendar className="w-3.5 h-3.5" /> 
                              {new Date(material.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>

                          {material.description && (
                            <p className="text-sm text-slate-600 whitespace-pre-wrap bg-white border border-slate-100 p-3 rounded-xl">
                              {material.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 pt-2">
                            {material.videoUrl && (
                              <a href={material.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors">
                                <Video className="w-4 h-4" /> Video Link
                              </a>
                            )}
                            {material.linkUrl && (
                              <a href={material.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
                                <LinkIcon className="w-4 h-4" /> External Link
                              </a>
                            )}
                            {material.fileUrl && (
                              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                                <FileText className="w-4 h-4" /> File Attached
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                          <DeleteMaterialButton materialId={material.id} gradeId={grade.id} schoolId={grade.schoolId} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Add Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CreateMaterialForm gradeId={grade.id} />
              </div>
            </div>
          </div>

          {/* ADMIN VIDEOS LOGIC */}
          <div className="border-t-2 border-dashed border-slate-200 pt-10">
            <AdminVideosTab schoolId={grade.schoolId} gradeId={grade.id} gradeName={grade.gradeName} schoolName={grade.school.name} />
          </div>
        </div>
      ) : (
        <AdminTestsTab schoolId={grade.schoolId} gradeId={grade.id} />
      )}
    </div>
  );
}
