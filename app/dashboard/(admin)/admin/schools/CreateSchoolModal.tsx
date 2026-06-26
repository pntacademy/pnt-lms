"use client";

import { useState } from "react";
import { Plus, X, Building, MapPin, User } from "lucide-react";
import { createSchool } from "@/app/actions/schools";
import { toast } from "react-hot-toast";

export function CreateSchoolModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const coordinatorName = formData.get("coordinatorName") as string;

    try {
      await createSchool({ name, location, coordinatorName });
      toast.success("School created successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create school.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all"
      >
        <Plus className="w-5 h-5" />
        Add New School
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Add New School</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" /> School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Springfield High"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" /> Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. New York, NY"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" /> Coordinator Name
                </label>
                <input
                  type="text"
                  name="coordinatorName"
                  placeholder="e.g. John Doe"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create School"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
