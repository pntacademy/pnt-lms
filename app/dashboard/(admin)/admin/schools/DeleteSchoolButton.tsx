"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteSchool } from "@/app/actions/schools";

export function DeleteSchoolButton({ schoolId, schoolName }: { schoolId: string, schoolName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the school if button is inside a Link
    
    if (!confirm(`WARNING: Are you sure you want to completely delete the school "${schoolName}" and ALL of its grades, students, and assignments? This action cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      await deleteSchool(schoolId);
    } catch (error) {
      console.error(error);
      alert("Failed to delete school. Please make sure there are no existing dependencies.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl shadow-sm transition-all disabled:opacity-50"
      title={`Delete ${schoolName}`}
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
