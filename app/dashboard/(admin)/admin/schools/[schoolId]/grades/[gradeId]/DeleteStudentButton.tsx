"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteStudent } from "@/app/actions/schools";

export function DeleteStudentButton({ studentId, schoolId, gradeId, studentName }: { studentId: string, schoolId: string, gradeId: string, studentName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to completely delete ${studentName} and revoke their access?`)) return;

    setIsDeleting(true);
    try {
      await deleteStudent(studentId, schoolId, gradeId);
    } catch (error) {
      console.error(error);
      alert("Failed to delete student");
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Student"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
