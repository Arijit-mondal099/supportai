import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
        ))}
      </div>
      <Card className="min-h-80">
        <CardContent className="py-5">
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    </div>
  );
}
