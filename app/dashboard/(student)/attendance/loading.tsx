export default function Loading() {
  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="h-8 w-12 bg-slate-100 rounded-lg mx-auto" />
            <div className="h-3 w-full bg-slate-100 rounded" />
          </div>
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
            <div className="h-3 w-1/4 bg-slate-100 rounded" />
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
