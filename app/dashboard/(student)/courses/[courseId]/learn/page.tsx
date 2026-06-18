import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { ChevronLeft, PlayCircle, Lock, Clock, FileText, CheckCircle } from "lucide-react";

export default async function CoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ topicId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { courseId } = resolvedParams;
  const selectedTopicId = resolvedSearchParams.topicId;

  // Ensure user is enrolled
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, courseId },
  });

  if (!enrollment) {
    redirect("/dashboard/courses");
  }

  // Fetch course and topics
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      topics: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) notFound();

  // Determine active topic
  const activeTopic =
    course.topics.find((t) => t.id === selectedTopicId) ||
    course.topics[0];

  const driveFileId = activeTopic?.driveFileId;

  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen flex flex-col font-sans text-slate-800 bg-slate-50">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/courses"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </Link>
          <div className="hidden sm:block">
            <h1 className="font-black text-sm uppercase tracking-widest text-slate-800">
              {course.title}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {course.topics.length} Lessons
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane: Video Player */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
          <div className="w-full aspect-video bg-black relative shadow-2xl flex items-center justify-center">
            {driveFileId ? (
               /*
               * NOTE: Google Drive Embedded Player Analytics Limitation
               * 
               * We are embedding the Google Drive video using an iframe preview URL.
               * Due to cross-origin resource sharing (CORS) security policies enforced by Google,
               * and the lack of a supported public Player API (unlike YouTube), we CANNOT track
               * playback events.
               * 
               * SECURITY NOTE: 
               * Students may still discover the iframe source through browser developer tools. This is acceptable.
               * Security and access control must depend entirely on Google Drive's native email-based permissions, 
               * not URL obfuscation. Do not attempt to provide custom DRM or anti-piracy protection.
               * 
               * Course progress must rely on LMS-controlled actions (e.g. marking as complete, quizzes).
               */
              <iframe
                src={`https://drive.google.com/file/d/${driveFileId}/preview`}
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen
                allow="autoplay; fullscreen"
              />
            ) : (
              <div className="text-center text-slate-400 flex flex-col items-center p-6">
                <PlayCircle size={64} className="mb-4 text-slate-700" strokeWidth={1.5} />
                <p className="font-bold text-lg text-slate-300 mb-1">
                  {activeTopic ? "No video available" : "Select a lesson"}
                </p>
                <p className="text-sm max-w-md">
                  This lesson does not have an embedded video. Please review the notes or materials below.
                </p>
              </div>
            )}
          </div>

          {/* Lesson Details & Modern Workspace */}
          <div className="flex-1 bg-white p-6 md:p-8 lg:p-10 border-t border-slate-200">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight mb-2">
                    {activeTopic?.title || "Course Overview"}
                  </h2>
                  {activeTopic?.description && (
                    <p className="text-base text-slate-600 font-medium leading-relaxed max-w-3xl">
                      {activeTopic.description}
                    </p>
                  )}
                </div>
                {/* Future: Mark Complete Button */}
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold shadow-sm transition-colors shrink-0">
                  <CheckCircle size={18} />
                  Mark Complete
                </button>
              </div>

              {/* Enhanced Tab Layout */}
              <div className="flex gap-6 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-hide">
                <button className="pb-3 px-1 border-b-2 border-indigo-600 font-black text-sm uppercase tracking-wider text-indigo-600 whitespace-nowrap">
                  Overview
                </button>
                <button className="pb-3 px-1 border-b-2 border-transparent hover:border-slate-300 font-black text-sm uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap">
                  Notes
                </button>
                <button className="pb-3 px-1 border-b-2 border-transparent hover:border-slate-300 font-black text-sm uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap">
                  Resources
                </button>
                <button className="pb-3 px-1 border-b-2 border-transparent hover:border-slate-300 font-black text-sm uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap">
                  Quiz / Test
                </button>
              </div>

              {/* Dynamic Workspace Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Notes Section Placeholder */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 blur-2xl rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                      <h3 className="font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2 text-slate-800">
                        <FileText size={16} className="text-indigo-500" />
                        Lesson Notes
                      </h3>
                      <div className="prose prose-slate prose-sm font-medium opacity-80">
                        <p>Detailed notes for this lesson will appear here. Teachers can add markdown-formatted notes, code snippets, and diagrams to accompany the video lecture.</p>
                      </div>
                    </div>
                  </div>

                  {/* Quiz Section Placeholder */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center text-center py-6">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-indigo-100 flex items-center justify-center mb-4">
                        <CheckCircle size={24} className="text-indigo-600" />
                      </div>
                      <h3 className="font-black text-base text-indigo-900 mb-1">Knowledge Check</h3>
                      <p className="text-sm font-medium text-indigo-700/70 max-w-sm mb-4">
                        A short quiz will be available here after you complete the video to test your understanding.
                      </p>
                      <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md opacity-50 cursor-not-allowed">
                        Take Quiz (Coming Soon)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar Resources */}
                <div className="space-y-4">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-2">Attached Resources</h3>
                  
                  {/* Mock Resource Items */}
                  <div className="flex items-center p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-50 transition-colors">
                      <FileText size={20} className="text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-700 truncate">Slide Deck (PDF)</p>
                      <p className="text-[10px] font-medium text-slate-400">2.4 MB</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-50 transition-colors">
                      <FileText size={20} className="text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-700 truncate">Code Snippets</p>
                      <p className="text-[10px] font-medium text-slate-400">ZIP Archive</p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Sidebar Curriculum */}
        <div className="w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 lg:h-full shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">
              Course Content
            </h3>
            <p className="text-xs font-bold text-slate-400 mt-1">
              {course.topics.length} Lessons
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {course.topics.length === 0 ? (
              <div className="text-center p-6 text-slate-400 text-sm font-bold">
                No lessons available yet.
              </div>
            ) : (
              course.topics.map((topic, idx) => {
                const isActive = topic.id === activeTopic?.id;
                return (
                  <Link
                    key={topic.id}
                    href={`/dashboard/courses/${courseId}/learn?topicId=${topic.id}`}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                      isActive
                        ? "bg-indigo-50 border border-indigo-200 shadow-sm"
                        : "bg-white border border-transparent hover:bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p
                        className={`text-sm font-bold leading-tight mb-1 truncate ${
                          isActive ? "text-indigo-900" : "text-slate-700"
                        }`}
                      >
                        {topic.title}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                        {topic.duration && (
                          <span className={isActive ? "text-indigo-500/70" : "text-slate-400"}>
                            <Clock size={10} className="inline mr-1" />
                            {topic.duration}
                          </span>
                        )}
                        {topic.driveFileId ? (
                          <span className="text-emerald-500">
                            <PlayCircle size={10} className="inline mr-1" />
                            Video
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            <Lock size={10} className="inline mr-1" />
                            No Video
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
