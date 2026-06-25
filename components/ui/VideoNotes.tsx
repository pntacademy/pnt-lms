"use client";

import { useState, useEffect } from "react";
import { Download, Copy, Trash2, CheckCircle, FileText } from "lucide-react";

interface VideoNotesProps {
  videoId: string;
  videoTitle: string;
}

export function VideoNotes({ videoId, videoTitle }: VideoNotesProps) {
  const [notes, setNotes] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load notes on mount
  useEffect(() => {
    setIsMounted(true);
    const savedNotes = localStorage.getItem(`video-notes-${videoId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [videoId]);

  // Handle note changes and auto-save
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(`video-notes-${videoId}`, newNotes);
  };

  const handleDownload = () => {
    if (!notes.trim()) return;
    const blob = new Blob([notes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeTitle = videoTitle.replace(/[^a-z0-9]/gi, '_');
    a.download = `${safeTitle}-notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!notes.trim()) return;
    try {
      await navigator.clipboard.writeText(notes);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy notes:", err);
    }
  };

  const handleClear = () => {
    if (!notes.trim()) return;
    if (window.confirm("Are you sure you want to clear your notes? This cannot be undone.")) {
      setNotes("");
      localStorage.removeItem(`video-notes-${videoId}`);
    }
  };

  // Prevent hydration mismatch by returning null until mounted
  if (!isMounted) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-slate-800">
          <FileText size={18} className="text-indigo-500" />
          <h3 className="font-black uppercase tracking-tight text-base">My Notes</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownload}
            disabled={!notes.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} /> Download
          </button>
          <button
            onClick={handleCopy}
            disabled={!notes.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-[85px] justify-center"
          >
            {isCopied ? <CheckCircle size={14} /> : <Copy size={14} />} 
            {isCopied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleClear}
            disabled={!notes.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>
      <div className="p-4 flex-1">
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Write your notes here... They will be automatically saved to your browser."
          className="w-full h-full p-4 text-sm text-slate-700 font-medium bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
        />
      </div>
    </div>
  );
}
