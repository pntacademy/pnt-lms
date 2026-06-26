"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { getStudentDownloadPresignedUrl } from "@/app/actions/download";

import { toast } from "react-hot-toast";

export function AssignmentFileDownloadButton({ objectKey }: { objectKey: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await getStudentDownloadPresignedUrl(objectKey);
      if (res.error || !res.presignedUrl) {
        throw new Error(res.error || "Failed to get download link");
      }
      
      // Open the presigned URL in a new tab which will download/view the file
      window.open(res.presignedUrl, "_blank");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download the assignment file.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
    >
      {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
      Download Assignment File
    </button>
  );
}
