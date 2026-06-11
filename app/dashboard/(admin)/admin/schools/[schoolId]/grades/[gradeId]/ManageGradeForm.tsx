"use client";

import { useState } from "react";
import { Save, Video, FileText, Link as LinkIcon, UploadCloud } from "lucide-react";
import { updateSchoolGradeDetails } from "@/app/actions/schools";
import { getUploadPresignedUrl } from "@/app/actions/upload";

export function ManageGradeForm({ 
  gradeId, 
  schoolId, 
  initialData 
}: { 
  gradeId: string; 
  schoolId: string; 
  initialData: { videoUrl: string | null; notes: string | null; assignmentLink: string | null; assignmentFileUrl: string | null } 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileStatus, setFileStatus] = useState<string | null>(initialData.assignmentFileUrl ? "Existing file uploaded" : null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const videoUrl = formData.get("videoUrl") as string;
    const notes = formData.get("notes") as string;
    const assignmentLink = formData.get("assignmentLink") as string;
    const file = formData.get("assignmentFile") as File;
    
    let assignmentFileUrl = initialData.assignmentFileUrl || undefined;

    try {
      if (file && file.size > 0) {
        setFileStatus("Uploading file...");
        const presignedRes = await getUploadPresignedUrl(file.name, file.type);
        if (presignedRes.error || !presignedRes.presignedUrl || !presignedRes.objectKey) {
          throw new Error(presignedRes.error || "Failed to generate presigned URL");
        }

        const uploadRes = await fetch(presignedRes.presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadRes.ok) throw new Error("Failed to upload file to storage");
        
        assignmentFileUrl = presignedRes.objectKey;
        setFileStatus("File uploaded successfully.");
      }

      await updateSchoolGradeDetails(gradeId, schoolId, { videoUrl, notes, assignmentLink, assignmentFileUrl });
      alert("Details saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save details. If you were uploading a large file, it may have failed.");
      setFileStatus("File upload failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Grade Content</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <Video className="w-4 h-4 text-purple-500" /> Video or Drive Link
        </label>
        <input 
          type="url" 
          name="videoUrl" 
          defaultValue={initialData.videoUrl || ""}
          placeholder="e.g. https://youtube.com/... or https://drive.google.com/..."
          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-100 rounded-xl p-4 bg-slate-50">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-blue-500" /> Assignment Link
          </label>
          <input 
            type="url" 
            name="assignmentLink" 
            defaultValue={initialData.assignmentLink || ""}
            placeholder="e.g. https://forms.gle/..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-blue-500" /> Or Upload Assignment File
          </label>
          <input 
            type="file" 
            name="assignmentFile" 
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
          />
          {fileStatus && <p className="text-xs text-blue-600 font-medium mt-1">{fileStatus}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-500" /> Teacher Notes & Instructions
        </label>
        <textarea 
          name="notes" 
          defaultValue={initialData.notes || ""}
          rows={5}
          placeholder="Add specific instructions, study notes, or announcements for this grade..."
          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-y"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isLoading ? "Saving..." : "Save Content"}
        </button>
      </div>
    </form>
  );
}
