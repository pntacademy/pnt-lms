"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteSchoolGrade } from "@/app/actions/schools";

import { toast } from "react-hot-toast";

export function DeleteGradeButton({ gradeId, schoolId, gradeName }: { gradeId: string, schoolId: string, gradeName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`WARNING: Are you sure you want to completely delete "${gradeName}" and ALL of its students and assignments? This action cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      await deleteSchoolGrade(gradeId, schoolId);
      toast.success("Grade deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete grade. Please make sure there are no existing dependencies.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl shadow-sm transition-all disabled:opacity-50"
      title={`Delete ${gradeName}`}
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
