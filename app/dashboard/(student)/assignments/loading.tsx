export default function Loading() {
  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-lg" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="h-5 w-2/3 bg-slate-100 rounded-lg" />
          <div className="h-3 w-1/3 bg-slate-100 rounded" />
          <div className="h-8 w-24 bg-slate-100 rounded-lg mt-2" />
        </div>
      ))}
    </div>
  );
}
