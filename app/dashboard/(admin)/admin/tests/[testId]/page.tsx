"use client";

import { useState, useEffect, useTransition, use } from "react";
import { useRouter } from "next/navigation";
import { getTestById, updateQuestion, deleteQuestion } from "@/app/actions/tests";
import Link from "next/link";
import { ChevronLeft, Edit3, Trash2, Check, X, AlertCircle } from "lucide-react";

type TestData = NonNullable<Awaited<ReturnType<typeof getTestById>>>;
type QuestionData = TestData["questions"][0];

export default function AdminTestReviewPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = use(params);
  const router = useRouter();

  const [test, setTest] = useState<TestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await getTestById(testId);
      if (!data) throw new Error("Test not found");
      setTest(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [testId]);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">
        Loading test details...
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="p-16 text-center text-red-500 font-bold uppercase tracking-widest text-sm">
        {error || "Test not found"}
      </div>
    );
  }

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase text-slate-800 tracking-tight">
              Review Test Questions
            </h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
              {test.title} · {test.totalMarks} Marks Total
            </p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 text-indigo-800 text-sm font-medium">
        <AlertCircle className="shrink-0 mt-0.5" size={18} />
        <p>
          Please review the AI-generated questions below. Ensure that correct answers map to exact options and text formatting is accurate before publishing.
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {test.questions.map((q, index) => (
          <QuestionEditor key={q.id} question={q} index={index + 1} onUpdate={load} />
        ))}
      </div>
    </div>
  );
}

function QuestionEditor({ question, index, onUpdate }: { question: QuestionData; index: number; onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...question });
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateQuestion(question.id, formData);
      setIsEditing(false);
      onUpdate();
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    startTransition(async () => {
      await deleteQuestion(question.id);
      onUpdate();
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-black text-indigo-600 uppercase tracking-widest text-xs">
            Editing Question {index}
          </span>
        </div>

        <textarea
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          rows={3}
          placeholder="Question text"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((opt) => {
            const key = `option${opt}` as keyof typeof formData;
            return (
              <div key={opt} className="flex gap-2 items-center">
                <span className="font-black text-slate-400 w-6 text-center">{opt}</span>
                <input
                  value={formData[key] as string}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder={`Option ${opt}`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="flex-1">
            <label className="text-xs font-black uppercase text-slate-500 tracking-widest block mb-1">Correct Answer</label>
            <input
              value={formData.correctAnswer}
              onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              placeholder="Correct Answer Text (Must exactly match an option)"
            />
          </div>
          <div className="w-24">
            <label className="text-xs font-black uppercase text-slate-500 tracking-widest block mb-1">Marks</label>
            <input
              type="number"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 1 })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-bold text-center focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              min="1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
          >
            <X size={16} /> Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Check size={16} /> {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="font-bold text-slate-800 text-lg leading-snug">
          <span className="text-indigo-500 mr-2">{index}.</span>
          {question.question}
        </h3>
        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {["A", "B", "C", "D"].map((opt) => {
          const key = `option${opt}` as keyof typeof question;
          const val = question[key] as string;
          if (!val) return null;

          const isCorrect = val.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

          return (
            <div
              key={opt}
              className={`px-4 py-3 rounded-xl border text-sm font-medium ${isCorrect
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
            >
              <span className={`font-black mr-2 ${isCorrect ? "text-emerald-500" : "text-slate-400"}`}>
                {opt}.
              </span>
              {val}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span>ID: {question.id.slice(-6)}</span>
        <span>·</span>
        <span>{question.marks} {question.marks === 1 ? "Mark" : "Marks"}</span>
      </div>
    </div>
  );
}
