import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Video, FileText, Link as LinkIcon, Building, BookOpen } from "lucide-react";
import Link from "next/link";
import { AssignmentFileDownloadButton } from "./AssignmentFileDownloadButton";

export const metadata = {
  title: "My School | PNT Academy",
  description: "View your personalized school portal.",
};

export default async function SchoolPortalPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch the full user to check school association
  const user = await (prisma.user as any).findUnique({
    where: { id: session.user.id },
    include: {
      school: true,
      schoolGrade: {
        include: {
          materials: {
            orderBy: { createdAt: "desc" }
          }
        }
      },
    }
  });

  if (!user) {
    redirect("/login");
  }

  // If student is not part of a school, show a generic message
  if (!user.school || !user.schoolGrade) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <Building className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Not Enrolled in a School Program</h1>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            You currently are not registered under any specific school partner program. Please check the public courses or contact your school coordinator.
          </p>
        </div>
        <Link 
          href="/dashboard/courses" 
          className="bg-gradient-to-br from-orange-300 to-amber-400 px-6 py-3 border border-slate-200 rounded-xl font-bold uppercase tracking-wider shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
        >
          Browse Public Courses
        </Link>
      </div>
    );
  }

  const { school, schoolGrade } = user;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-500 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        <div className="px-8 pb-8 relative -mt-12 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="w-24 h-24 bg-white rounded-2xl border border-slate-200 p-2 shadow-xl flex items-center justify-center shrink-0">
            <Building className="w-12 h-12 text-indigo-500" />
          </div>
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
              {schoolGrade.gradeName}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{school.name}</h1>
            <p className="text-slate-500 font-medium">Your personalized school portal.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Video / Class Content */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 hover:border-purple-200 transition-colors">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Class Video</h2>
          </div>
          
          {schoolGrade.videoUrl ? (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">Watch the latest recorded session or access the drive link below.</p>
              <a 
                href={schoolGrade.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                Watch Video Content
              </a>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500 text-sm">
              No video has been uploaded for your grade yet.
            </div>
          )}
        </div>

        {/* Assignments */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Assignments</h2>
          </div>
          
          {(schoolGrade.assignmentLink || schoolGrade.assignmentFileUrl) ? (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">Complete your required grade assignment.</p>
              
              <div className="flex flex-col gap-3">
                {schoolGrade.assignmentLink && (
                  <a 
                    href={schoolGrade.assignmentLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    Open Assignment Link
                  </a>
                )}
                
                {schoolGrade.assignmentFileUrl && (
                  <AssignmentFileDownloadButton objectKey={schoolGrade.assignmentFileUrl} />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500 text-sm">
              No active assignments for your grade.
            </div>
          )}
        </div>

        {/* Teacher Notes */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 hover:border-emerald-200 transition-colors">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Teacher Notes & Instructions</h2>
          </div>
          
          {schoolGrade.notes ? (
            <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
              {schoolGrade.notes}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500 text-sm">
              No notes have been posted for your class yet.
            </div>
          )}
        </div>
      </div>

      {/* Daily Sessions & Materials */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mt-8">
        <div className="p-8 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Daily Sessions & Materials</h2>
            <p className="text-slate-500 text-sm mt-0.5">Notes, videos, and assignments from your latest classes</p>
          </div>
        </div>

        {schoolGrade.materials.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center bg-slate-50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm">
              <BookOpen className="w-8 h-8" />
            </div>
            <p className="text-slate-500 text-sm max-w-md">Your teachers have not uploaded any daily materials yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {schoolGrade.materials.map((material: any) => (
              <div key={material.id} className="p-8 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-bold text-xl text-slate-900">{material.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Posted on {new Date(material.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    {material.description && (
                      <p className="text-slate-600 whitespace-pre-wrap bg-white border border-slate-200 p-4 rounded-2xl">
                        {material.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-3">
                      {material.videoUrl && (
                        <a href={material.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-sm font-bold shadow-sm transition-colors">
                          <Video className="w-4 h-4" /> Watch Video
                        </a>
                      )}
                      {material.linkUrl && (
                        <a href={material.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-bold shadow-sm transition-colors">
                          <LinkIcon className="w-4 h-4" /> Open Assignment Link
                        </a>
                      )}
                      {material.fileUrl && (
                        <div className="w-auto">
                           <AssignmentFileDownloadButton objectKey={material.fileUrl} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
