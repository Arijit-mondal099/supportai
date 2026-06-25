import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-14 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-9 w-40" />
        </CardContent>
      </Card>
      <div>
        <Skeleton className="mb-3 h-3 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-8 w-8" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
