import { ArrowLeft, Film, PlayCircle, Calendar, Info, Link as LinkIcon, FileText, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { NotificationClearer } from "@/components/layout/NotificationClearer";
import { VideoNotes } from "@/components/ui/VideoNotes";

export default async function StudentVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const session = await auth();

  const resolvedParams = await searchParams;
  const selectedVideoId = resolvedParams.v;

  const schoolGradeId = (session?.user as any)?.schoolGradeId;

  const globalVideos = await prisma.globalVideo.findMany({
    where: {
      OR: [
        { schoolGradeId: schoolGradeId || "NO_GRADE_MATCH" },
        { schoolGradeId: null }
      ]
    },
    orderBy: { createdAt: "desc" }
  });

  const materials = schoolGradeId ? await prisma.gradeMaterial.findMany({
    where: { 
      gradeId: schoolGradeId,
      videoUrl: { not: null }
    },
    orderBy: { createdAt: "desc" }
  }) : [];

  const extractDriveId = (url: string) => {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : url;
  };

  const videos = [
    ...globalVideos.map(v => ({
      id: v.id,
      title: v.title,
      description: v.description,
      driveFileId: v.driveFileId,
      createdAt: v.createdAt,
      type: "Global",
      linkUrl: null,
      fileUrl: null
    })),
    ...materials.filter(m => m.videoUrl).map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      driveFileId: extractDriveId(m.videoUrl!),
      createdAt: m.createdAt,
      type: "Material",
      linkUrl: m.linkUrl,
      fileUrl: m.fileUrl
    }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const activeVideo = selectedVideoId ? videos.find(v => v.id === selectedVideoId) : null;

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
      <NotificationClearer type="videos" />
      <header className="sticky top-[61px] md:top-0 z-30 bg-slate-50 pt-4 md:pt-8 pb-4 -mx-4 md:-mx-8 px-4 md:px-8 -mt-4 md:-mt-8 mb-6 shrink-0 border-b border-slate-200 shadow-sm">
        {!activeVideo && (
          <Link href="/dashboard/school" className="inline-flex items-center gap-2 mb-4 px-4 py-2 w-fit bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all">
            <ArrowLeft size={16} /> Back to My School
          </Link>
        )}
        <h1 className="text-2xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <Film size={30} className="text-indigo-500" strokeWidth={2.5} />
          Videos
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
          {videos.length} video{videos.length !== 1 ? "s" : ""} available
        </p>
      </header>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white border border-slate-200 rounded-2xl flex-1">
          <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center">
            <Film size={36} className="text-slate-300" />
          </div>
          <p className="font-black text-slate-400 uppercase tracking-widest text-sm">
            No videos yet
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            Administrators have not uploaded any global videos. Check back soon!
          </p>
        </div>
      ) : !activeVideo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 items-start">
          {videos.map((video) => (
            <div key={video.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-800 line-clamp-2">{video.title}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 mb-4">
                  <Calendar size={14} />
                  {new Date(video.createdAt).toLocaleDateString()}
                </div>
                {video.description ? (
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {video.description}
                  </p>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Info size={14} /> No description provided.
                  </div>
                )}
              </div>
              <Link
                href={`/dashboard/videos?v=${video.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-indigo-700 transition-colors"
              >
                <PlayCircle size={18} />
                Watch Video
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/dashboard/videos"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <ArrowLeft size={16} /> Back to Videos
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Main Video Player & Details (Left Column) */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">

              <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-200 relative">
                {activeVideo ? (
                  <iframe
                    src={`https://drive.google.com/file/d/${activeVideo.driveFileId}/preview`}
                    className="w-full h-full border-0 absolute inset-0"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <p className="font-bold">Video unavailable</p>
                  </div>
                )}
              </div>

              {activeVideo && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                      {activeVideo.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
                    <Calendar size={14} />
                    Uploaded on{" "}
                    {new Date(activeVideo.createdAt).toLocaleDateString()}
                  </div>

                  {activeVideo.description ? (
                    <p className="text-base text-slate-600 font-medium leading-relaxed">
                      {activeVideo.description}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <Info size={16} />
                      No description provided for this video.
                    </div>
                  )}

                  {(activeVideo.linkUrl || activeVideo.fileUrl) && (
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-6">
                      {activeVideo.linkUrl && (
                        <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-5">
                          <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <LinkIcon size={16} className="text-blue-500" /> Ask Doubt Form
                          </h3>
                          <p className="text-xs text-blue-700 mb-4 font-medium">Have questions? Fill out this form for support.</p>
                          <a href={activeVideo.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-blue-700 transition-colors shadow-sm">
                            Open Form <ExternalLink size={14} />
                          </a>
                        </div>
                      )}
                      
                      {activeVideo.fileUrl && (
                        <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                          <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-emerald-500" /> References
                          </h3>
                          <p className="text-xs text-emerald-700 mb-4 font-medium">Download supplementary materials here.</p>
                          <a href={activeVideo.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-emerald-700 transition-colors shadow-sm">
                            <FileText size={14} /> Download File
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Video Notes (Right Column) */}
            <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 flex flex-col h-full">
              {activeVideo && (
                <VideoNotes videoId={activeVideo.id} videoTitle={activeVideo.title} />
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}