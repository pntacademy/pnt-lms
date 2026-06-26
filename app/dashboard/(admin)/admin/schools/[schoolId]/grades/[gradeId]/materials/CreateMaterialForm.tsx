"use client";

import { useState } from "react";
import { Save, Video, FileText, Link as LinkIcon, UploadCloud, Heading } from "lucide-react";
import { createGradeMaterial } from "@/app/actions/materials";
import { getUploadPresignedUrl } from "@/app/actions/upload";
import { toast } from "react-hot-toast";

export function CreateMaterialForm({ gradeId }: { gradeId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileStatus, setFileStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setFileStatus(null);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const file = formData.get("fileUrl") as File;
    
    let fileUrl: string | undefined = undefined;

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
        
        fileUrl = presignedRes.objectKey;
        setFileStatus("File uploaded successfully.");
      }

      await createGradeMaterial({
        gradeId,
        title,
        description,
        videoUrl,
        linkUrl,
        fileUrl
      });
      
      toast.success("Material added successfully!");
      form.reset();
      setFileStatus(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save material. If you were uploading a large file, it may have failed.");
      setFileStatus("File upload failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Add Daily Material</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Heading className="w-4 h-4 text-orange-500" /> Title (e.g., Session 1, Oct 12 Notes) *
          </label>
          <input 
            type="text" 
            name="title" 
            required
            placeholder="Enter title..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-500" /> Description / Notes
          </label>
          <textarea 
            name="description" 
            rows={3}
            placeholder="Add specific instructions, study notes, or announcements..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-y"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Video className="w-4 h-4 text-purple-500" /> Video or Drive Link
          </label>
          <input 
            type="url" 
            name="videoUrl" 
            placeholder="e.g. https://youtube.com/... or https://drive.google.com/..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-100 rounded-xl p-4 bg-slate-50">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-blue-500" /> External Link (e.g. Forms)
            </label>
            <input 
              type="url" 
              name="linkUrl" 
              placeholder="e.g. https://forms.gle/..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-blue-500" /> Or Upload File (PDF/Doc/Img)
            </label>
            <input 
              type="file" 
              name="fileUrl" 
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
            />
            {fileStatus && <p className="text-xs text-blue-600 font-medium mt-1">{fileStatus}</p>}
          </div>
        </div>

      </div>

      <div className="pt-2 flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isLoading ? "Saving..." : "Add Material"}
        </button>
      </div>
    </form>
  );
}
