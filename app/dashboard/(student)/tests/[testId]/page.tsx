"use client";

import { useEffect, useState, useTransition } from "react";
import { getStudentTestById, submitTestAttempt, gradePracticeTest } from "@/app/actions/tests";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

type TestDetails = Awaited<ReturnType<typeof getStudentTestById>>;

export default function TestRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [test, setTest] = useState<TestDetails | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Practice mode state
  const [isRetesting, setIsRetesting] = useState(false);
  const [practiceResult, setPracticeResult] = useState<{ score: number; totalMarks: number } | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    getStudentTestById(testId)
      .then((data) => {
        setTest(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [testId]);

  const handleOptionSelect = (questionId: string, option: string) => {
    if (test?.submission && !isRetesting) return; // Prevent edits if already submitted and not retesting
    if (practiceResult) return; // Prevent edits after submitting practice test
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    if (!test) return;
    
    const unanswered = test.questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      setShowConfirmModal(true);
      return;
    }
    executeSubmit();
  };

  const executeSubmit = () => {
    if (!test) return;
    setShowConfirmModal(false);

    startTransition(async () => {
      try {
        if (isRetesting) {
          const result = await gradePracticeTest(testId, answers);
          setPracticeResult({ score: result.score, totalMarks: result.totalMarks });
          window.scrollTo(0, 0);
          toast.success("Practice test submitted!");
        } else {
          await submitTestAttempt(testId, answers);
          // Refresh the page data to show results
          const updatedData = await getStudentTestById(testId);
          setTest(updatedData);
          window.scrollTo(0, 0);
          toast.success("Test submitted successfully!");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to submit test.");
      }
    });
  };

  const startRetest = () => {
    setIsRetesting(true);
    setPracticeResult(null);
    setAnswers({});
  };

  const exitRetest = () => {
    setIsRetesting(false);
    setPracticeResult(null);
    setAnswers({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="p-8 max-w-3xl mx-auto mt-10 bg-white border border-red-200 rounded-2xl shadow-sm text-center">
        <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-black uppercase text-slate-800 mb-2">Failed to load test</h2>
        <p className="text-sm font-medium text-slate-500 mb-6">{error}</p>
        <Link
          href="/dashboard/tests"
          className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-wider"
        >
          <ArrowLeft size={16} /> Back to Tests
        </Link>
      </div>
    );
  }

  const isCompleted = !!test.submission;
  const scorePercentage = isCompleted 
    ? Math.round((test.submission.score / test.submission.totalMarks) * 100) 
    : 0;

  return (
    <div className="min-h-full bg-slate-50 pb-20">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/tests"
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
                {test.title}
              </h1>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">
                {test.course?.title || "Global Test"}
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          {isCompleted ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700">
              <CheckCircle size={16} />
              <span className="text-xs font-black uppercase tracking-wider hidden md:inline">Submitted</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-black uppercase tracking-wider hidden md:block">
              {Object.keys(answers).length} / {test.questions.length} Answered
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Results Banner if completed and not retesting */}
        {isCompleted && !isRetesting && (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg shadow-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Test Completed!</h2>
              <p className="text-emerald-100 font-medium text-sm mb-4">
                Your test was submitted successfully on {new Date(test.submission.createdAt).toLocaleString()}.
              </p>
              <button
                onClick={startRetest}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 rounded-xl font-black uppercase text-xs tracking-wider shadow-sm hover:-translate-y-0.5 transition-all"
              >
                Retest (Practice Mode)
              </button>
            </div>
            <div className="bg-white/20 px-8 py-6 rounded-2xl border border-white/30 backdrop-blur-sm text-center shrink-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-1">Final Score</p>
              <div className="text-4xl font-black leading-none">
                {scorePercentage}%
              </div>
              <p className="text-sm font-bold mt-2 text-emerald-50">
                {test.submission.score} / {test.submission.totalMarks} Marks
              </p>
            </div>
          </div>
        )}

        {/* Practice Result Banner */}
        {isRetesting && practiceResult && (
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200 flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2 flex items-center gap-2">
                <AlertCircle size={24} className="text-indigo-200" /> Practice Result
              </h2>
              <p className="text-indigo-100 font-medium text-sm mb-4">
                This is a demo retest. Your official score has not been changed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={startRetest}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 rounded-xl font-black uppercase text-xs tracking-wider shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={exitRetest}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-700 text-white border border-indigo-500 rounded-xl font-black uppercase text-xs tracking-wider hover:bg-indigo-800 transition-all"
                >
                  Back to Official Score
                </button>
              </div>
            </div>
            <div className="bg-white/20 px-8 py-6 rounded-2xl border border-white/30 backdrop-blur-sm text-center shrink-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-1">Practice Score</p>
              <div className="text-4xl font-black leading-none">
                {Math.round((practiceResult.score / practiceResult.totalMarks) * 100)}%
              </div>
              <p className="text-sm font-bold mt-2 text-indigo-50">
                {practiceResult.score} / {practiceResult.totalMarks} Marks
              </p>
            </div>
          </div>
        )}

        {/* Active Retest Banner */}
        {isRetesting && !practiceResult && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-500" />
              <div>
                <p className="text-sm font-black text-amber-800 uppercase tracking-widest">Practice Mode Active</p>
                <p className="text-xs text-amber-600 font-medium mt-0.5">Your official score will not be overwritten.</p>
              </div>
            </div>
            <button
              onClick={exitRetest}
              className="text-xs font-bold text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Cancel Practice
            </button>
          </div>
        )}

        {/* Question List */}
        <div className="space-y-6">
          {test.questions.map((q, index) => {
            const studentAnswer = isRetesting 
              ? answers[q.id] 
              : (isCompleted 
                  ? (test.submission.answers as Record<string, string>)[q.id] 
                  : answers[q.id]);

            return (
              <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h3 className="text-lg font-black text-slate-800 leading-snug">
                    <span className="text-amber-500 mr-2">{index + 1}.</span>
                    {q.question}
                  </h3>
                  <span className="shrink-0 px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-md">
                    {q.marks} Mark{q.marks > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "A", text: q.optionA },
                    { id: "B", text: q.optionB },
                    { id: "C", text: q.optionC },
                    { id: "D", text: q.optionD },
                  ].map((opt) => {
                    if (!opt.text) return null;
                    
                    const isSelected = studentAnswer === opt.text;
                    // When submitted, we highlight their choice, but we don't show correct answers to prevent them sharing it.
                    // The backend automatically scored it.
                    
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-50 border-amber-400 text-amber-900"
                            : "bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50/50"
                        } ${(isCompleted && !isRetesting) || !!practiceResult ? "cursor-default opacity-90" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt.text}
                          checked={isSelected}
                          onChange={() => handleOptionSelect(q.id, opt.text)}
                          disabled={(isCompleted && !isRetesting) || !!practiceResult}
                          className="w-5 h-5 text-amber-500 border-slate-300 focus:ring-amber-500 disabled:opacity-50"
                        />
                        <span className="font-medium text-sm">{opt.text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Action */}
        {(!isCompleted || (isRetesting && !practiceResult)) && (
          <div className="pt-6 pb-10 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className={`flex items-center gap-3 px-8 py-4 ${isRetesting ? 'bg-gradient-to-br from-indigo-600 to-purple-700 shadow-indigo-900/20' : 'bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-900/20'} text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0`}
            >
              {isPending ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              {isRetesting ? 'Submit Practice Test' : 'Submit Test for Grading'}
            </button>
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center rotate-3">
                <AlertCircle size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Unanswered Questions</h3>
                <p className="text-slate-500 mt-2 text-sm font-medium">
                  You have <span className="font-bold text-amber-600 px-1">{test.questions.length - Object.keys(answers).length}</span> unanswered question(s). Are you sure you want to submit?
                </p>
              </div>
              <div className="flex items-center gap-3 w-full pt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors uppercase text-xs tracking-wider"
                >
                  Go Back
                </button>
                <button
                  onClick={executeSubmit}
                  className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md transition-colors uppercase text-xs tracking-wider"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
