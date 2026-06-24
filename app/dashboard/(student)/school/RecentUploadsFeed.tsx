"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, CheckCheck, BookOpen, FileText, PlaySquare, FileCheck2 } from "lucide-react";

type Activity = {
  id: string;
  type: string;
  title: string;
  date: Date;
  color: string;
  bg: string;
  link: string | null;
};

const getIconForType = (type: string) => {
  switch (type) {
    case "Material": return BookOpen;
    case "Test": return FileText;
    case "Video": return PlaySquare;
    case "Assignment": return FileCheck2;
    default: return BookOpen;
  }
};

export function RecentUploadsFeed({ activities }: { activities: Activity[] }) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dismissed_uploads");
    if (saved) {
      try {
        setDismissedIds(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const next = [...dismissedIds, id];
    setDismissedIds(next);
    localStorage.setItem("dismissed_uploads", JSON.stringify(next));
  };

  const handleClearAll = () => {
    const allIds = activities.map(a => a.id);
    const next = [...new Set([...dismissedIds, ...allIds])];
    setDismissedIds(next);
    localStorage.setItem("dismissed_uploads", JSON.stringify(next));
  };

  if (!isLoaded) {
    return (
      <div className="bg-slate-50/50 p-6 md:p-8">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Recent Uploads</h3>
        <div className="text-center py-8 text-slate-400 font-bold animate-pulse text-sm">
          Loading feed...
        </div>
      </div>
    );
  }

  const visibleActivities = activities.filter(a => !dismissedIds.includes(a.id));

  return (
    <div className="bg-slate-50/50 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Recent Uploads</h3>
        {visibleActivities.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
          >
            <CheckCheck size={14} /> Clear All
          </button>
        )}
      </div>
      
      {visibleActivities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm font-medium">No recent activity found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleActivities.map((activity) => {
            const Icon = getIconForType(activity.type);
            
            const innerContent = (
              <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group/card relative pr-12">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      New {activity.type}: <span className="font-medium text-slate-700">{activity.title}</span>
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      {new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                {/* Dismiss Button */}
                <button
                  onClick={(e) => handleDismiss(e, activity.id)}
                  className="absolute right-4 p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all bg-white border border-slate-100 shadow-sm"
                  aria-label="Dismiss notification"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            );

            return activity.link ? (
              <Link href={activity.link} key={activity.id} className="block group">
                {innerContent}
              </Link>
            ) : (
              <div key={activity.id}>
                {innerContent}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
