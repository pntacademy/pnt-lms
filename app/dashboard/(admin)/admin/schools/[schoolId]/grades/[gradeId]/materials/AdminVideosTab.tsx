"use client";

import { useState, useTransition, useEffect } from "react";
import { PlaySquare, Plus, Trash2, X, AlertCircle, Calendar, Film } from "lucide-react";
import { getAllVideos, createGlobalVideo, deleteGlobalVideo } from "@/app/actions/videos";

export function AdminVideosTab({ schoolId, gradeId, gradeName, schoolName }: { schoolId: string; gradeId: string; gradeName: string; schoolName: string }) {
  const [videos, setVideos] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = () => {
    startTransition(async () => {
      try {
        const fetchedVideos = await getAllVideos();
        // Filter videos for this specific grade
        const gradeVideos = fetchedVideos.filter(v => v.schoolGradeId === gradeId);
        setVideos(gradeVideos);
      } catch (err: any) {
        console.error("Failed to load data", err);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, [gradeId]);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    formData.append("schoolGradeId", gradeId);

    startTransition(async () => {
      try {
        await createGlobalVideo(formData);
        setShowModal(false);
        setMessage({ type: "success", text: "Video successfully added to this grade." });
        loadData();
      } catch (err: any) {
        setMessage({ type: "error", text: err.message });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    
    startTransition(async () => {
      try {
        await deleteGlobalVideo(id);
        setMessage({ type: "success", text: "Video deleted successfully." });
        loadData();
      } catch (err: any) {
        setMessage({ type: "error", text: err.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Film size={20} />
            </div>
            Video Lectures
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage video lectures specific to {gradeName}.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-purple-700 hover:shadow-md transition-all"
        >
          <Plus size={18} strokeWidth={2.5} /> Add Video
        </button>
      </header>

      {message && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${message.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      {isPending && videos.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 rounded-2xl border-dashed">
              <Film size={48} className="mb-4 text-slate-300" strokeWidth={1.5} />
              <p className="font-bold text-lg text-slate-500">No videos added to {gradeName}</p>
              <p className="text-sm mt-1">Click "Add Video" to link a video lecture.</p>
            </div>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col group">
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider border border-purple-100">
                      {schoolName} - {gradeName}
                    </span>
                    <button
                      onClick={() => handleDelete(video.id)}
                      disabled={isPending}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                  <h3 className="font-black text-lg text-slate-800 leading-tight mb-2 group-hover:text-purple-600 transition-colors">{video.title}</h3>
                  {video.description && (
                    <p className="text-xs font-medium text-slate-500 line-clamp-3 mb-4">{video.description}</p>
                  )}
                </div>
                
                <div className="pt-4 mt-auto border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Calendar size={14} /> {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                  <a
                    href={video.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-slate-700 hover:text-purple-700 rounded-xl text-xs font-black uppercase transition-colors"
                  >
                    <PlaySquare size={16} /> Test Link
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Video Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-black text-lg uppercase text-slate-800 tracking-tight flex items-center gap-2">
                <PlaySquare size={20} className="text-purple-500" />
                Add Video Lecture
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-5 overflow-y-auto">
              <div className="space-y-1.5 hidden">
                <input type="hidden" name="schoolGradeId" value={gradeId} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Video Title *</label>
                <input required name="title" placeholder="e.g. Introduction to Robotics" className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-400 placeholder:font-medium" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Description (Optional)</label>
                <textarea name="description" rows={3} placeholder="Brief summary of the video content..." className="w-full p-4 rounded-xl border-2 border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none placeholder:text-slate-400" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center justify-between">
                  <span>Google Drive Link *</span>
                  <span className="text-[9px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">Share with students first!</span>
                </label>
                <input required type="url" name="driveUrl" placeholder="https://drive.google.com/file/d/.../view?usp=sharing" className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-400" />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-12 bg-slate-100 text-slate-600 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex-[2] h-12 bg-purple-600 text-white rounded-xl text-sm font-black uppercase tracking-wider hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/20 transition-all disabled:opacity-50">
                  {isPending ? "Adding..." : "Add Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
