import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Megaphone, Clock, CheckSquare, Trophy, FileText, ChevronRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { getEvents } from "@/app/actions/calendar";
import { UpcomingEventsWidget } from "@/components/calendar/UpcomingEventsWidget";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch all data in parallel
  const [student, submissions, enrollments, events] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, studentId: true, className: true }
    }),
    prisma.assignmentSubmission.findMany({
      where: { userId: session.user.id },
      include: { assignment: { select: { title: true, dueDate: true } } },
      orderBy: { submittedAt: "desc" }
    }),
    prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: { course: { select: { id: true, title: true } } }
    }),
    getEvents()
  ]);

  const name = student?.name || "Student";
  const firstName = name.split(" ")[0];

  // Compute assignment stats
  const gradedSubmissions = submissions.filter(s => s.score !== null);
  const avgScore = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.score ?? 0), 0) / gradedSubmissions.length)
    : null;

  const pendingCount = submissions.filter(s => s.status === "SUBMITTED").length;

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-red-400 to-rose-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-orange-300 to-amber-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight">
            Welcome back, <span className="text-red-500">{firstName}</span>
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
            {student?.studentId && <span className="font-mono text-indigo-600">{student.studentId}</span>}
            {student?.studentId && " · "}
            Let's continue learning
          </p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Avg Grade", value: avgScore !== null ? `${avgScore}` : "—", sub: avgScore !== null ? "out of 100" : "No grades yet", color: "bg-indigo-50 border-indigo-100", valueColor: "text-indigo-600" },
            { label: "Submitted", value: String(submissions.length), sub: "Total assignments", color: "bg-amber-50 border-amber-100", valueColor: "text-amber-600" },
            { label: "Awaiting", value: String(pendingCount), sub: "Pending review", color: "bg-red-50 border-red-100", valueColor: "text-red-500" },
          ].map(stat => (
            <div key={stat.label} className={`rounded-xl border-2 ${stat.color} p-4 text-center`}>
              <div className={`text-3xl font-black ${stat.valueColor}`}>{stat.value}</div>
              <div className="text-xs font-black uppercase text-slate-500 tracking-widest mt-1">{stat.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Column 1 */}
          <div className="space-y-6">

            {/* Enrolled Courses */}
            {/* 
            <Card className="pt-0 gap-0 border-0 ring-0 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
              <CardHeader className="pt-4 pb-3 bg-gradient-to-br from-red-400 to-rose-500 border-b-0">
                <CardTitle className="text-sm font-black uppercase flex items-center gap-2 text-white">
                  <BookOpen size={20} /> Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                {enrollments.length === 0 ? (
                  <p className="text-sm text-slate-400 font-medium py-2">Not enrolled in any courses yet.</p>
                ) : enrollments.map(e => (
                  <div key={e.id} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm font-bold text-slate-700 truncate">{e.course.title}</span>
                  </div>
                ))}
                <Link href="/dashboard/courses" className="flex items-center justify-between px-4 py-2 bg-black text-white rounded-lg text-xs font-black uppercase mt-2 hover:bg-red-500 transition-colors">
                  <span>View All Courses</span><ChevronRight size={14} strokeWidth={3} />
                </Link>
              </CardContent>
            </Card>
            */}
          </div>

          {/* Column 2: Events */}
          <div className="space-y-4">
            <UpcomingEventsWidget events={events as any} role="STUDENT" />
          </div>

        </div>
      </div>
    </div>
  );
}
