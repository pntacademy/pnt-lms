import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Megaphone, Clock, CheckSquare, Trophy, ClipboardCheck, FileText, ChevronRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch all data in parallel
  const [student, attendances, submissions, enrollments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, studentId: true, className: true }
    }),
    prisma.attendance.findMany({
      where: { userId: session.user.id },
      include: { course: { select: { title: true } } },
      orderBy: { date: "desc" },
      take: 5
    }),
    prisma.assignmentSubmission.findMany({
      where: { userId: session.user.id },
      include: { assignment: { select: { title: true, dueDate: true } } },
      orderBy: { submittedAt: "desc" }
    }),
    prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: { course: { select: { id: true, title: true } } }
    })
  ]);

  const name = student?.name || "Student";
  const firstName = name.split(" ")[0];

  // Compute attendance stats
  const totalAttendance = await prisma.attendance.count({ where: { userId: session.user.id } });
  const presentCount = await prisma.attendance.count({ where: { userId: session.user.id, status: "PRESENT" } });
  const attendancePct = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Attendance", value: totalAttendance > 0 ? `${attendancePct}%` : "—", sub: `${presentCount}/${totalAttendance} classes`, color: "bg-green-50 border-green-100", valueColor: "text-green-600" },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">

          {/* Column 1 */}
          <div className="space-y-6">
            {/* Attendance Summary */}
            <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
              <CardHeader className="pb-2 bg-gradient-to-br from-orange-300 to-amber-400 border-b border-slate-200">
                <CardTitle className="text-sm font-black uppercase flex items-center gap-2 text-slate-800">
                  <Trophy size={20} /> Overall Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">All Courses</span>
                  <span className="text-2xl font-black text-slate-800">{attendancePct}%</span>
                </div>
                <Progress value={attendancePct} className="h-4 border border-slate-200 bg-slate-100" />
                {attendancePct < 75 && totalAttendance > 0 && (
                  <p className="text-xs text-red-500 font-bold mt-2 uppercase">⚠️ Below 75% — improve attendance</p>
                )}
              </CardContent>
            </Card>

            {/* Enrolled Courses */}
            <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
              <CardHeader className="pb-2 bg-gradient-to-br from-red-400 to-rose-500 border-b border-slate-200">
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
          </div>

          {/* Column 2: Recent Attendance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl shadow-slate-200/50 w-fit">
              <div className="bg-gradient-to-br from-orange-300 to-amber-400 p-2 rounded-lg border border-slate-200">
                <ClipboardCheck size={20} strokeWidth={2.5} className="text-slate-800" />
              </div>
              <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">Recent Attendance</h2>
            </div>

            {attendances.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                <ClipboardCheck size={32} className="text-slate-200 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-400 uppercase">No attendance records yet.</p>
              </div>
            ) : attendances.map(record => (
              <div key={record.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xl shadow-slate-200/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-800 truncate max-w-[160px]">{record.course.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(record.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
                <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-lg border-2 ${
                  record.status === "PRESENT" ? "bg-green-50 border-green-500 text-green-700" :
                  record.status === "LATE" ? "bg-amber-50 border-amber-500 text-amber-700" :
                  "bg-red-50 border-red-500 text-red-700"
                }`}>{record.status}</span>
              </div>
            ))}

            <Link href="/dashboard/attendance" className="flex items-center justify-between px-4 py-2 bg-black text-white rounded-xl text-xs font-black uppercase hover:bg-red-500 transition-colors">
              <span>Full Attendance Record</span><ChevronRight size={14} strokeWidth={3} />
            </Link>
          </div>

          {/* Column 3: Assignments */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl shadow-slate-200/50 w-fit">
              <div className="bg-[#43a047] p-2 rounded-lg border border-slate-200">
                <FileText size={20} strokeWidth={2.5} className="text-white" />
              </div>
              <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">Assignments</h2>
            </div>

            {submissions.length === 0 ? (
              <div className="bg-white border-4 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 border-4 border-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckSquare size={24} strokeWidth={2.5} className="text-green-600" />
                </div>
                <h3 className="text-base font-black text-slate-800 uppercase mb-2">All Caught Up!</h3>
                <p className="text-xs text-slate-500 font-medium max-w-[200px]">No submissions yet. Submit your first assignment!</p>
              </div>
            ) : submissions.slice(0, 4).map(sub => (
              <div key={sub.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xl shadow-slate-200/50">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-black text-sm text-slate-800 uppercase leading-tight max-w-[180px]">{sub.assignment.title}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border-2 ml-2 flex-shrink-0 ${
                    sub.status === "GRADED" ? "bg-green-50 border-green-500 text-green-700" :
                    "bg-blue-50 border-blue-500 text-blue-700"
                  }`}>{sub.status}</span>
                </div>
                {sub.score !== null && (
                  <div className="flex items-center gap-2 mt-2">
                    <Trophy size={14} className="text-amber-500" />
                    <span className="text-sm font-black text-slate-800">{sub.score}<span className="text-xs text-slate-400">/100</span></span>
                  </div>
                )}
              </div>
            ))}

            <Link href="/dashboard/assignments" className="flex items-center justify-between px-4 py-2 bg-black text-white rounded-xl text-xs font-black uppercase hover:bg-[#43a047] transition-colors">
              <span>Submit Assignment</span><ChevronRight size={14} strokeWidth={3} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
