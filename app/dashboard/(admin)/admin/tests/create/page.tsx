"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, ChevronLeft, Bot, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getAllCourses } from "@/app/actions/courses";
import { generateTestFromPdf } from "@/app/actions/tests";

type Course = Awaited<ReturnType<typeof getAllCourses>>[0];

export default function CreateAITestPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getAllCourses().then(setCourses).catch(console.error);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (f.type !== "application/pdf") {
        setError("Only PDF files are supported.");
        setFile(null);
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setError("File is too large. Maximum size is 10MB.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(f);
      
      // Auto-fill title if empty
      if (!title) {
        setTitle(f.name.replace(".pdf", "").replace(/-/g, " ").replace(/_/g, " "));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      setError("Please fill in all required fields and upload a PDF.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("courseId", courseId);

      const res = await generateTestFromPdf(formData);
      
      if (res.success && res.testId) {
        setSuccess(true);
        // Wait a short moment to show success state before redirecting
        setTimeout(() => {
          router.push(`/dashboard/admin/tests/${res.testId}`);
        }, 1500);
      } else {
        setError(res.error || "Failed to generate test from PDF.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/tests"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
            <Bot size={28} className="text-indigo-600" />
            Generate AI Test
          </h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
            Upload a PDF to extract questions automatically
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-600">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="text-sm font-bold uppercase tracking-wide">{error}</div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center flex-col gap-2 text-green-700 py-12">
          <CheckCircle size={48} className="text-green-500 mb-2" />
          <div className="text-lg font-black uppercase tracking-widest">Test Generated Successfully!</div>
          <div className="text-sm font-bold">Redirecting to review screen...</div>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Target Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">No Course (Global Test)</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Test Title *</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midterm Robotics Quiz"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions or details about the test..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Upload PDF File *</label>
            
            <div className="relative border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors group text-center p-8">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isProcessing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                  {file ? <FileText size={32} /> : <UploadCloud size={32} />}
                </div>
                {file ? (
                  <div>
                    <p className="text-sm font-black text-indigo-900">{file.name}</p>
                    <p className="text-xs font-bold text-indigo-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-black text-indigo-900 uppercase tracking-widest">Select PDF File</p>
                    <p className="text-xs font-bold text-indigo-500 mt-1">Drag and drop or click to browse</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isProcessing || !file || !title}
              className="w-full flex items-center justify-center gap-3 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
            >
              {isProcessing ? (
                <>
                  <Bot className="animate-bounce" size={20} />
                  Analyzing PDF via AI...
                </>
              ) : (
                <>
                  <Bot size={20} />
                  Generate Questions
                </>
              )}
            </button>
            <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">
              Powered by Google Gemini 1.5
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
