import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-24" />
              <Skeleton className="mt-2 h-3.5 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-0 rounded-xl border border-border">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <Skeleton className="h-4 w-24 shrink-0" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-7 w-36 rounded-lg" />
          <Skeleton className="h-7 w-28 rounded-lg" />
          <Skeleton className="h-7 w-36 rounded-lg" />
          <Skeleton className="ml-auto h-7 w-40 rounded-lg" />
        </CardFooter>
      </Card>
    </div>
  );
}
