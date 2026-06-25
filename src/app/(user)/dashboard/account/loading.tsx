import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <span className="mb-3 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-gray-50 px-3 py-1 shadow-sm">
          <Skeleton className="h-2.5 w-2.5 rounded-full" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </span>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-1 h-4 w-24" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <Skeleton className="h-9 w-28" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-3 w-72" />
        </CardHeader>
      </Card>
    </div>
  );
}
