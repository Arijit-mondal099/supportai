import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-12" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="flex justify-end border-t border-border pt-4">
            <Skeleton className="h-9 w-36" />
          </div>
        </CardContent>
      </Card>
      <div>
        <Skeleton className="mb-3 h-3 w-24" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  );
}
