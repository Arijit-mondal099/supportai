import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-[32rem] flex-col gap-0 overflow-hidden rounded-xl border border-border py-0">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <div className="space-y-0.5 leading-tight">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <div className="flex justify-start">
          <Skeleton className="h-12 w-3/5 rounded-2xl rounded-bl-sm" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-2/5 rounded-2xl rounded-br-sm" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="h-16 w-3/4 rounded-2xl rounded-bl-sm" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-1/2 rounded-2xl rounded-br-sm" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="h-12 w-2/3 rounded-2xl rounded-bl-sm" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t border-border px-3 py-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
      </div>
    </div>
  );
}
