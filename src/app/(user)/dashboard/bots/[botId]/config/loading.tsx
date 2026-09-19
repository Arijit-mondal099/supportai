import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SectionSkeleton = ({ titleWidth, descWidth }: { titleWidth: string; descWidth: string }) => (
  <CardHeader className="flex flex-row items-center gap-3 space-y-0">
    <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
    <div className="space-y-2">
      <Skeleton className={`h-5 ${titleWidth}`} />
      <Skeleton className={`h-3 ${descWidth}`} />
    </div>
  </CardHeader>
);

export default function Loading() {
  return (
    <div className="space-y-4" aria-hidden>
      <Card>
        <SectionSkeleton titleWidth="w-16" descWidth="w-48" />
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full max-w-sm" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-9 w-48 rounded-xl" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <SectionSkeleton titleWidth="w-16" descWidth="w-56" />
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <SectionSkeleton titleWidth="w-14" descWidth="w-56" />
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-28 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <SectionSkeleton titleWidth="w-24" descWidth="w-56" />
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-9 w-full max-w-md" />
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>

      <Card className="border-destructive/30">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Skeleton className="mt-0.5 h-9 w-9 shrink-0 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
          <Skeleton className="h-9 w-36 shrink-0" />
        </CardContent>
      </Card>
    </div>
  );
}
