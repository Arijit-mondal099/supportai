"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const pulse = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" as const },
  },
};

const SkeletonPulse = ({ className }: { className?: string }) => (
  <motion.div {...pulse}>
    <Skeleton className={className} />
  </motion.div>
);

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10" aria-hidden>
      {/* Header — title + New agent action */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <SkeletonPulse className="h-9 w-40 sm:h-10 sm:w-48" />
          <SkeletonPulse className="h-4 w-48 max-w-full sm:w-64" />
        </div>
        <SkeletonPulse className="h-8 w-28 shrink-0 rounded-lg" />
      </div>

      {/* Agent cards — avatar tile, name, meta row, status footer */}
      <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="flex h-full flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
              <div className="flex min-w-0 items-center gap-3">
                <SkeletonPulse className="h-11 w-11 shrink-0 rounded-xl" />
                <div className="min-w-0 space-y-2">
                  <SkeletonPulse className="h-4 w-28" />
                  <SkeletonPulse className="h-3 w-20" />
                </div>
              </div>
              <SkeletonPulse className="h-8 w-8 shrink-0 rounded-md" />
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <SkeletonPulse className="h-5 w-16 shrink-0 rounded-full" />
              <SkeletonPulse className="h-3.5 w-24" />
              <SkeletonPulse className="h-3.5 w-20" />
            </CardContent>
            <CardFooter className="mt-auto flex items-center justify-between gap-2">
              <SkeletonPulse className="h-5 w-14 rounded-full" />
              <SkeletonPulse className="h-7 w-20 rounded-lg" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
