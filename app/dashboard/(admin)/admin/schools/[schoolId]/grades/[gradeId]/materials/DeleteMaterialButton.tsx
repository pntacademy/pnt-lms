"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteGradeMaterial } from "@/app/actions/materials";

export function DeleteMaterialButton({ materialId, gradeId, schoolId }: { materialId: string, gradeId: string, schoolId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    setIsDeleting(true);
    try {
      await deleteGradeMaterial(materialId, gradeId, schoolId);
    } catch (error) {
      console.error(error);
      alert("Failed to delete material.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-lg shadow-sm transition-all disabled:opacity-50"
      title="Delete Material"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
