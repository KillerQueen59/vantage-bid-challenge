import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[92px] rounded-lg" />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Skeleton className="h-[34px] flex-1 rounded-md md:max-w-[280px]" />
        <Skeleton className="hidden h-[34px] w-[260px] rounded-md md:block" />
        <Skeleton className="hidden h-[34px] w-[140px] rounded-md md:block" />
        <Skeleton className="ml-auto h-[34px] w-[150px] rounded-md" />
      </div>

      <div className="border-line bg-surface rounded-lg border">
        <div className="border-line hidden border-b bg-[#fafbfc] px-4 py-2.5 md:block">
          <Skeleton className="h-3 w-40" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border-line-soft flex items-center gap-3 border-b px-4 py-3.5 last:border-0"
          >
            <Skeleton className="h-8 w-7 shrink-0 rounded-sm" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="hidden h-5 w-24 rounded-full md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
