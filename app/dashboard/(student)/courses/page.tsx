import { BookOpen, PlayCircle, Clock, List, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  // Fetch enrolled courses with topics (server-side — instant, no loading state)
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          topics: { orderBy: { order: "asc" } },
          _count: { select: { topics: true, attendances: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const courses = enrollments.map((e) => e.course);

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <BookOpen size={30} className="text-orange-500" strokeWidth={2.5} />
          My Courses
        </h1>
        <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
          {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
        </p>
      </header>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center">
            <BookOpen size={36} className="text-slate-300" />
          </div>
          <p className="font-black text-slate-400 uppercase tracking-widest text-sm">
            No courses yet
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            Your teacher will enroll you in courses. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  const hasTopics = course.topics.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Top accent bar */}
      <div
        className={`h-1.5 w-full ${
          course.isInternship
            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
            : "bg-gradient-to-r from-orange-400 to-amber-500"
        }`}
      />

      <div className="p-4 md:p-5">
        {/* Course header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                course.isInternship
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              {course.isInternship ? "Internship" : "Course"}
            </span>
            <h2 className="font-black text-base md:text-lg text-slate-800 leading-tight">
              {course.title}
            </h2>
            {course.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {course.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-slate-400">
            <List size={13} />
            <span>{course._count.topics}</span>
          </div>
        </div>

        {/* Topics list */}
        {hasTopics ? (
          <div className="mt-3 space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Topics
            </p>
            {course.topics.map((topic: any, idx: number) => (
              <div
                key={topic.id}
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-orange-200 hover:bg-orange-50/50 transition-colors group"
              >
                {/* Number badge */}
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 flex-shrink-0 shadow-sm group-hover:border-orange-300 group-hover:text-orange-500 transition-colors">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800 leading-tight truncate">
                    {topic.title}
                  </p>
                  {topic.description && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {topic.description}
                    </p>
                  )}
                  {topic.duration && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-1">
                      <Clock size={9} /> {topic.duration}
                    </span>
                  )}
                </div>

                {topic.videoUrl ? (
                  <a
                    href={topic.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1 text-xs font-black text-orange-500 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2 py-1.5 rounded-lg transition-colors"
                  >
                    <PlayCircle size={14} />
                    <span className="hidden sm:inline">Watch</span>
                  </a>
                ) : (
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-300">
                    <Lock size={13} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 italic bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
            <List size={13} className="text-slate-300" />
            Topics coming soon — check back later
          </div>
        )}

        {/* Drive link for internships */}
        {course.driveLink && (
          <a
            href={course.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-between w-full px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-black uppercase hover:bg-emerald-100 transition-colors"
          >
            <span>Open Drive Materials</span>
            <ChevronRight size={14} strokeWidth={3} />
          </a>
        )}
      </div>
    </div>
  );
}
