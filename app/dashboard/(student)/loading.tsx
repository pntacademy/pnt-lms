import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-full font-sans p-4 md:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-10 w-[200px] md:w-[300px]" />
          <Skeleton className="h-4 w-[250px] md:w-[400px]" />
        </div>
        <Skeleton className="h-10 w-[140px] rounded-xl" />
      </div>

      {/* Grid of Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 shadow-sm h-[200px]">
            <div className="flex justify-between items-start">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4 mt-2" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
