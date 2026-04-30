export default function Loading() {
  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-lg" />
      <div className="h-4 w-28 bg-slate-100 rounded-lg" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-1.5 bg-slate-100 w-full" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-3/4 bg-slate-100 rounded-lg" />
            <div className="h-3 w-1/2 bg-slate-100 rounded" />
            <div className="space-y-2 mt-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-14 bg-slate-50 border border-slate-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
