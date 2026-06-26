import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Video, FileText, Link as LinkIcon, Building, BookOpen, PlaySquare, FileCheck2 } from "lucide-react";
import Link from "next/link";
import { AssignmentFileDownloadButton } from "./AssignmentFileDownloadButton";
import { RecentUploadsFeed } from "./RecentUploadsFeed";
import { formatDistanceToNow } from "date-fns";
import { NotificationClearer } from "@/components/layout/NotificationClearer";

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
  const gradeId = schoolGrade.id;

  // Fetch recent activity
  const [recentTests, recentVideos, recentAssignments] = await Promise.all([
    prisma.test.findMany({
      where: { isPublished: true, OR: [{ schoolGradeId: gradeId }, { schoolGradeId: null }] },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.globalVideo.findMany({
      where: { OR: [{ schoolGradeId: gradeId }, { schoolGradeId: null }] },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.assignment.findMany({
      where: { OR: [{ schoolGradeId: gradeId }, { schoolGradeId: null }] },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  const activities = [
    ...(schoolGrade.materials || []).map((m: any) => ({
      id: `mat-${m.id}`,
      type: "Material",
      title: m.title,
      date: m.createdAt,
      color: "text-blue-500",
      bg: "bg-blue-50",
      link: m.videoUrl ? `/dashboard/videos?v=${m.id}` : "/dashboard/videos"
    })),
    ...recentTests.map((t: any) => ({
      id: `test-${t.id}`,
      type: "Test",
      title: t.title,
      date: t.createdAt,
      color: "text-rose-500",
      bg: "bg-rose-50",
      link: "/dashboard/tests"
    })),
    ...recentVideos.map((v: any) => ({
      id: `vid-${v.id}`,
      type: "Video",
      title: v.title,
      date: v.createdAt,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      link: `/dashboard/videos?v=${v.id}`
    })),
    ...recentAssignments.map((a: any) => ({
      id: `assn-${a.id}`,
      type: "Assignment",
      title: a.title,
      date: a.createdAt,
      color: "text-amber-500",
      bg: "bg-amber-50",
      link: "/dashboard/assignments"
    }))
  ]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 15);

  const safeDate = (d: any) => (d ? new Date(d).getTime() : 0);
  
  const hasNewTests = recentTests.length > 0 && (!(user as any).lastTestsVisit || safeDate(recentTests[0].createdAt) > safeDate((user as any).lastTestsVisit));
  const hasNewVideos = recentVideos.length > 0 && (!(user as any).lastVideosVisit || safeDate(recentVideos[0].createdAt) > safeDate((user as any).lastVideosVisit));
  const hasNewAssignments = recentAssignments.length > 0 && (!(user as any).lastAssignmentsVisit || safeDate(recentAssignments[0].createdAt) > safeDate((user as any).lastAssignmentsVisit));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <NotificationClearer type="school" />
      {/* Header */}
      <div className="rounded-3xl border border-indigo-500 shadow-sm overflow-hidden relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="px-8 py-8 relative flex flex-col sm:flex-row items-center sm:items-center gap-6">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2 shadow-xl flex items-center justify-center shrink-0">
            <Building className="w-12 h-12 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-widest mb-2 shadow-inner">
              {schoolGrade.gradeName}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">{school.name}</h1>
            <p className="text-indigo-100 font-medium">Your personalized school portal.</p>
          </div>
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

        {/* The 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 border-b border-slate-100 bg-slate-50/50">
          <Link href="/dashboard/tests" className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center text-center gap-3 group">
             {hasNewTests && (
               <span className="absolute top-3 right-3 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
               </span>
             )}
             <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText size={26} strokeWidth={2.5} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wide">Tests</h3>
                <p className="text-xs text-slate-500 mt-1">Take quizzes and tests</p>
             </div>
          </Link>
          <Link href="/dashboard/videos" className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center text-center gap-3 group">
             {hasNewVideos && (
               <span className="absolute top-3 right-3 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
               </span>
             )}
             <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlaySquare size={26} strokeWidth={2.5} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wide">Videos</h3>
                <p className="text-xs text-slate-500 mt-1">Watch recorded lessons</p>
             </div>
          </Link>
          <Link href="/dashboard/assignments" className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center text-center gap-3 group">
             {hasNewAssignments && (
               <span className="absolute top-3 right-3 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
               </span>
             )}
             <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck2 size={26} strokeWidth={2.5} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wide">Assignments</h3>
                <p className="text-xs text-slate-500 mt-1">Submit your homework</p>
             </div>
          </Link>
        </div>

        <RecentUploadsFeed activities={activities} />
      </div>

    </div>
  );
}
