"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, CheckCircle2, Clock, UploadCloud, FileUp, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getUploadPresignedUrl } from "@/app/actions/upload";
import { submitAssignment } from "@/app/actions/assignments";
import { getStudentAssignments } from "@/app/actions/getAssignments";

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  project: { id: number; title: string };
  submissions: { status: string; score: number | null; fileUrl: string | null }[];
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [studentNotes, setStudentNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch real assignments on mount
  useEffect(() => {
    getStudentAssignments().then((result) => {
      if (result.success && result.assignments) {
        setAssignments(result.assignments as Assignment[]);
        if (result.assignments.length > 0) {
          setSelectedAssignmentId(result.assignments[0].id);
        }
      }
      setIsLoading(false);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file to upload");
    if (!selectedAssignmentId) return alert("Please select an assignment");

    setIsUploading(true);

    try {
      // 1. Get Presigned URL
      const { presignedUrl, objectKey, error } = await getUploadPresignedUrl(file.name, file.type);
      if (error || !presignedUrl || !objectKey) throw new Error(error || "Failed to get upload URL");

      // 2. Upload directly to Cloudflare R2
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Failed to upload file to cloud storage");

      // 3. Save submission record to DB
      const dbResult = await submitAssignment(selectedAssignmentId, objectKey, studentNotes);
      if (dbResult.error) throw new Error(dbResult.error);

      // 4. Refresh assignments list to show new status
      const refreshed = await getStudentAssignments();
      if (refreshed.success && refreshed.assignments) {
        setAssignments(refreshed.assignments as Assignment[]);
      }

      setFile(null);
      setStudentNotes("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("✅ Assignment submitted successfully!");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  const pendingAssignments = assignments.filter((a) => !a.submissions.length || a.submissions[0].status === "PENDING");
  const submittedAssignments = assignments.filter((a) => a.submissions.length && a.submissions[0].status !== "PENDING");

  const formatDue = (d: Date | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "No deadline";

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <FileText size={36} className="text-[#43a047]" strokeWidth={2.5} />
          Assignments
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Submit your project files and track your grades
        </p>
      </header>

      {/* Upload Form */}
      <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 bg-white">
        <CardHeader className="bg-gradient-to-br from-orange-300 to-amber-400 border-b border-slate-200 p-4">
          <CardTitle className="text-sm font-black uppercase text-slate-800 flex items-center gap-2">
            <UploadCloud size={20} strokeWidth={2.5} />
            Submit New Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-800">Select Assignment</label>
                {isLoading ? (
                  <div className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 text-sm text-slate-400 animate-pulse">Loading assignments...</div>
                ) : (
                  <select
                    value={selectedAssignmentId}
                    onChange={(e) => setSelectedAssignmentId(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-3 bg-white text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ffcb05]"
                  >
                    {pendingAssignments.length === 0 && (
                      <option value="">All assignments submitted!</option>
                    )}
                    {pendingAssignments.map((a) => (
                      <option key={a.id} value={a.id}>
                        Project {a.project.id}: {a.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Show selected assignment description */}
              {selectedAssignmentId && (() => {
                const selected = assignments.find(a => a.id === selectedAssignmentId);
                return selected?.description ? (
                  <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-lg">
                    <p className="text-xs font-black uppercase text-amber-700 mb-1">Task Description</p>
                    <p className="text-sm text-slate-700">{selected.description}</p>
                    <p className="text-xs font-bold text-slate-500 mt-2">Due: {formatDue(selected.dueDate)}</p>
                  </div>
                ) : null;
              })()}

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-800">Notes for Teacher (Optional)</label>
                <textarea
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ffcb05]"
                  rows={3}
                  placeholder="Add any notes for the instructor..."
                />
              </div>
            </div>

            {/* File Drop Zone */}
            <div className="flex flex-col h-full gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 border-4 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors cursor-pointer group ${
                  file ? "border-[#43a047] bg-green-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
                }`}
              >
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.ino,.cpp,.c,.py,.zip" />
                <div className={`p-4 rounded-full border-2 mb-4 transition-all ${file ? "bg-[#43a047] border-green-600" : "bg-white border-slate-300"}`}>
                  {file ? <CheckCircle2 size={32} className="text-white" strokeWidth={2.5} /> : <FileUp size={32} className="text-slate-400" strokeWidth={2} />}
                </div>
                <p className="text-sm font-black uppercase text-slate-800 mb-1 text-center">
                  {file ? file.name : "Click to select a file"}
                </p>
                <p className="text-xs font-bold text-slate-500 uppercase text-center">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, INO, CPP, PY, ZIP (Max 10MB)"}
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!file || isUploading || !selectedAssignmentId}
                className={`w-full py-3 px-6 text-white text-sm font-black uppercase rounded-xl border transition-all flex items-center justify-center gap-2 ${
                  !file || isUploading || !selectedAssignmentId
                    ? "bg-slate-300 border-slate-300 cursor-not-allowed"
                    : "bg-black border-slate-200 shadow-lg hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                }`}
              >
                {isUploading ? (
                  <><Loader2 className="animate-spin" size={20} /> Uploading to Cloud...</>
                ) : (
                  "Submit Assignment"
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <h2 className="text-xl font-black uppercase text-slate-800 tracking-tight mt-10">Your Submissions</h2>

      {isLoading ? (
        <div className="text-center py-10 text-slate-400 font-bold animate-pulse">Loading...</div>
      ) : submittedAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <AlertCircle size={32} className="text-slate-300 mb-3" />
          <p className="font-black uppercase text-slate-400 text-sm">No submissions yet</p>
          <p className="text-xs text-slate-400 mt-1">Upload your first assignment above!</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-100 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-black text-slate-800 uppercase tracking-wider text-xs w-[280px]">Assignment</TableHead>
                  <TableHead className="font-black text-slate-800 uppercase tracking-wider text-xs">Project</TableHead>
                  <TableHead className="font-black text-slate-800 uppercase tracking-wider text-xs">Due Date</TableHead>
                  <TableHead className="font-black text-slate-800 uppercase tracking-wider text-xs">Status</TableHead>
                  <TableHead className="font-black text-slate-800 uppercase tracking-wider text-xs text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submittedAssignments.map((a) => {
                  const sub = a.submissions[0];
                  return (
                    <TableRow key={a.id} className="border-b border-slate-100">
                      <TableCell className="py-4">
                        <p className="font-black uppercase text-sm text-slate-800">{a.title}</p>
                      </TableCell>
                      <TableCell className="py-4 font-bold text-sm text-slate-600">Project {a.project.id}</TableCell>
                      <TableCell className="py-4 text-sm text-slate-500 font-medium">{formatDue(a.dueDate)}</TableCell>
                      <TableCell className="py-4">
                        {sub.status === "GRADED" ? (
                          <Badge className="bg-green-100 text-green-700 border-2 border-green-600 font-black uppercase hover:bg-green-100">Graded</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-700 border-2 border-blue-600 font-black uppercase hover:bg-blue-100">
                            <CheckCircle2 size={12} className="mr-1" strokeWidth={3} />
                            Submitted
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-right font-black text-slate-800">
                        {sub.score != null ? `${sub.score}/100` : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {submittedAssignments.map((a) => {
              const sub = a.submissions[0];
              return (
                <Card key={a.id} className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 bg-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[10px] font-black text-[#43a047] uppercase tracking-widest bg-green-50 inline-block px-2 py-1 border-2 border-[#43a047] rounded-md">
                        Project {a.project.id}
                      </div>
                      <CheckCircle2 size={24} className="text-blue-500" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-black uppercase text-slate-800 leading-tight">{a.title}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase mt-1 mb-4">Due: {formatDue(a.dueDate)}</p>
                    <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-slate-200">
                      <span className="text-xs font-black uppercase text-slate-500">Score</span>
                      <span className="font-black text-lg text-slate-800">{sub.score != null ? `${sub.score}/100` : "Pending"}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Pending Assignments */}
      {pendingAssignments.length > 0 && (
        <>
          <h2 className="text-xl font-black uppercase text-slate-800 tracking-tight mt-6">Pending Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingAssignments.map((a) => (
              <Card key={a.id} className="border border-slate-200 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedAssignmentId(a.id)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 inline-block px-2 py-1 border-2 border-orange-300 rounded-md">
                      Project {a.project.id}
                    </div>
                    <Clock size={20} className="text-orange-400" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-sm font-black uppercase text-slate-800 leading-tight mt-2">{a.title}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-2">Due: {formatDue(a.dueDate)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
