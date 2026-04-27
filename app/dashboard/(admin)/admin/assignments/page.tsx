"use client";

import { useState, useEffect } from "react";
import { FileCheck2, CheckCircle2, Download, Search, AlertCircle, X, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllSubmissions, gradeSubmission } from "@/app/actions/adminAssignments";
import { getDownloadPresignedUrl } from "@/app/actions/download";

type Submission = {
  id: string;
  status: string;
  score: number | null;
  feedback: string | null;
  fileUrl: string | null;
  studentNotes: string | null;
  submittedAt: Date;
  user: {
    name: string | null;
    studentId: string | null;
    className: string | null;
  };
  assignment: {
    title: string;
    project: { id: number; title: string };
  };
};

export default function AdminAssignmentsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Grading Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [score, setScore] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    const res = await getAllSubmissions();
    if (res.success && res.submissions) {
      setSubmissions(res.submissions as Submission[]);
    }
    setIsLoading(false);
  };

  const handleDownload = async (objectKey: string | null, originalFileName: string) => {
    if (!objectKey) return alert("No file attached");
    
    try {
      const { presignedUrl, error } = await getDownloadPresignedUrl(objectKey);
      if (error || !presignedUrl) throw new Error(error || "Failed to generate download URL");
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = presignedUrl;
      a.target = '_blank';
      a.download = originalFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message || "Could not download file.");
    }
  };

  const handleGradeSubmit = async () => {
    if (!selectedSubmission) return;
    
    const numScore = parseInt(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 100) {
      return alert("Please enter a valid score between 0 and 100");
    }

    setIsGrading(true);
    try {
      const res = await gradeSubmission(selectedSubmission.id, numScore, feedback);
      if (res.error) throw new Error(res.error);
      
      alert("Submission graded successfully!");
      setSelectedSubmission(null);
      setScore("");
      setFeedback("");
      fetchSubmissions(); // Refresh the list
    } catch (err: any) {
      alert(err.message || "Failed to submit grade");
    } finally {
      setIsGrading(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const term = searchTerm.toLowerCase();
    return (
      sub.user.name?.toLowerCase().includes(term) ||
      sub.assignment.title.toLowerCase().includes(term) ||
      sub.user.studentId?.toLowerCase().includes(term)
    );
  });

  const pendingCount = submissions.filter(s => s.status === "SUBMITTED").length;

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <FileCheck2 size={36} className="text-indigo-600" strokeWidth={2.5} />
          Grade Submissions
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          Review and evaluate student project files
          {pendingCount > 0 && (
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] border border-amber-300">
              {pendingCount} Pending
            </span>
          )}
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search by student, ID, or assignment..." 
            className="pl-10 h-11 border-slate-200 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Submissions Table */}
      <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Loading submissions...</div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-slate-50">
            <CheckCircle2 size={40} className="text-slate-300 mb-3" />
            <p className="font-black uppercase text-slate-400 text-sm">No submissions found</p>
            <p className="text-xs text-slate-400 mt-1">All caught up! Or adjust your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-black text-slate-600 uppercase tracking-wider text-[10px]">Student</TableHead>
                  <TableHead className="font-black text-slate-600 uppercase tracking-wider text-[10px]">Assignment</TableHead>
                  <TableHead className="font-black text-slate-600 uppercase tracking-wider text-[10px]">Submitted</TableHead>
                  <TableHead className="font-black text-slate-600 uppercase tracking-wider text-[10px]">Status</TableHead>
                  <TableHead className="font-black text-slate-600 uppercase tracking-wider text-[10px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((sub) => (
                  <TableRow key={sub.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <TableCell className="py-4">
                      <div>
                        <p className="font-black uppercase text-sm text-slate-800">{sub.user.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">ID: {sub.user.studentId} • {sub.user.className}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <p className="font-bold text-sm text-slate-700">{sub.assignment.title}</p>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Project {sub.assignment.project.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-xs font-medium text-slate-500">
                        {new Date(sub.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      {sub.status === "GRADED" ? (
                        <Badge className="bg-green-100 text-green-700 border border-green-300 font-bold hover:bg-green-100">
                          {sub.score}/100
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 border border-amber-300 font-bold hover:bg-amber-100">
                          Needs Grading
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setScore(sub.score?.toString() || "");
                          setFeedback(sub.feedback || "");
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
                      >
                        Review <ChevronRight size={14} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white shadow-2xl border-0 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-6 flex flex-row items-center justify-between sticky top-0">
              <div>
                <CardTitle className="text-lg font-black uppercase text-slate-800">
                  Review Submission
                </CardTitle>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                  {selectedSubmission.user.name} • Project {selectedSubmission.assignment.project.id}
                </p>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </CardHeader>
            
            <CardContent className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Submission Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Assignment</h3>
                    <p className="text-sm font-bold text-slate-800">{selectedSubmission.assignment.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Attached File</h3>
                    <button 
                      onClick={() => handleDownload(selectedSubmission.fileUrl, `${selectedSubmission.user.name?.replace(/\s/g, '_')}_Project${selectedSubmission.assignment.project.id}`)}
                      className="w-full flex items-center justify-between p-4 bg-indigo-50 border-2 border-indigo-100 rounded-xl hover:bg-indigo-100 hover:border-indigo-200 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileCheck2 size={24} className="text-indigo-500 group-hover:text-indigo-600" />
                        <div className="text-left">
                          <p className="text-sm font-bold text-indigo-900">View Attachment</p>
                          <p className="text-[10px] font-bold text-indigo-500 uppercase">Download from Cloudflare R2</p>
                        </div>
                      </div>
                      <Download size={18} className="text-indigo-400 group-hover:text-indigo-600" />
                    </button>
                  </div>

                  {selectedSubmission.studentNotes && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Student Notes</h3>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 italic">
                        "{selectedSubmission.studentNotes}"
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Grading Form */}
                <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-800 mb-1.5 block">Score (0-100)</label>
                    <div className="relative w-32">
                      <Input 
                        type="number" 
                        min="0" 
                        max="100"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="h-12 text-2xl font-black bg-white border-slate-200 text-indigo-600 px-4"
                        placeholder="--"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">/100</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-800 mb-1.5 block">Feedback for Student</label>
                    <textarea 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-3 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                      placeholder="Great job! Next time try to..."
                    />
                  </div>

                  <button 
                    onClick={handleGradeSubmit}
                    disabled={isGrading || !score}
                    className="w-full py-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl font-black uppercase text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {isGrading ? "Saving..." : "Save Grade & Feedback"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
