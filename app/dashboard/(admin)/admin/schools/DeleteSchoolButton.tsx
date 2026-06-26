"use client";

import { toast } from "react-hot-toast";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { deleteSchool } from "@/app/actions/schools";

export function DeleteSchoolButton({ schoolId, schoolName }: { schoolId: string, schoolName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSchool(schoolId);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete school. Please make sure there are no existing dependencies.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={(e) => { e.preventDefault(); setShowModal(true); }}
        disabled={isDeleting}
        className="p-2.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl shadow-sm transition-all disabled:opacity-50"
        title={`Delete ${schoolName}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={(e) => { e.preventDefault(); setShowModal(false); }}
        >
          <div 
            className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 border border-red-200">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Delete School?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                Are you sure you want to completely delete the school <strong className="text-slate-900 font-bold">"{schoolName}"</strong> and ALL of its grades, students, and assignments? This action cannot be undone.
              </p>
              
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={(e) => { e.preventDefault(); setShowModal(false); }}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); handleDelete(); }}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
