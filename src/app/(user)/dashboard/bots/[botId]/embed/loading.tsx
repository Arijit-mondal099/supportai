import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
            <div className="space-y-1 px-5 py-5">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="h-3 w-64" />
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-2 py-5">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-56 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}
