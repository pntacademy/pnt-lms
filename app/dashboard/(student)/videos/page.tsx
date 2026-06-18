import { Film, PlayCircle, Calendar, Info } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function StudentVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const resolvedParams = await searchParams;
  const selectedVideoId = resolvedParams.v;

  const videos = await prisma.globalVideo.findMany({
    orderBy: { createdAt: "desc" }
  });

  const activeVideo = selectedVideoId ? videos.find(v => v.id === selectedVideoId) : null;

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
      <header className="mb-6 shrink-0">
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
        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          {/* Main Video Player */}
          <div className="flex-1 flex flex-col gap-6">
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

            {/* Video Details */}
            {activeVideo && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                    {activeVideo.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
                  <Calendar size={14} />
                  Uploaded on {new Date(activeVideo.createdAt).toLocaleDateString()}
                </div>

                {activeVideo.description ? (
                  <p className="text-base text-slate-600 font-medium leading-relaxed">
                    {activeVideo.description}
                  </p>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-400 font-medium italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Info size={16} /> No description provided for this video.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Video Playlist Sidebar */}
          <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">
                More Videos
              </h3>
              <Link href="/dashboard/videos" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {videos.map((video) => {
                const isActive = activeVideo?.id === video.id;
                return (
                  <Link
                    key={video.id}
                    href={`/dashboard/videos?v=${video.id}`}
                    className={`flex items-start gap-4 p-3 rounded-2xl border transition-all group ${isActive
                      ? "bg-indigo-50 border-indigo-200 shadow-sm"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
                      }`}
                  >
                    <div className={`w-24 aspect-video shrink-0 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                      }`}>
                      <PlayCircle size={24} strokeWidth={isActive ? 2 : 1.5} />
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                      <h4 className={`font-black text-sm leading-tight mb-1 line-clamp-2 ${isActive ? "text-indigo-900" : "text-slate-800 group-hover:text-indigo-700"
                        }`}>
                        {video.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Calendar size={10} /> {new Date(video.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
