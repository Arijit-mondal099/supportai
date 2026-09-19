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
    <div className="mx-auto w-full max-w-2xl space-y-6 pb-10" aria-hidden>
      {/* Header — back link, title, step counter, progress */}
      <div className="space-y-4">
        <SkeletonPulse className="h-4 w-20" />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <SkeletonPulse className="h-9 w-52 sm:h-10 sm:w-64" />
            <SkeletonPulse className="h-4 w-64 max-w-full" />
          </div>
          <SkeletonPulse className="h-4 w-20" />
        </div>
        <SkeletonPulse className="h-1 w-full rounded-full" />
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex min-w-0 flex-1 items-center gap-2">
            <SkeletonPulse className="h-6 w-6 shrink-0 rounded-full" />
            <SkeletonPulse className="hidden h-4 w-16 sm:block" />
            {i < 3 && <SkeletonPulse className="h-px flex-1" />}
          </li>
        ))}
      </ol>

      {/* Step card — title, fields, nav footer */}
      <Card className="overflow-hidden">
        <CardHeader className="space-y-2">
          <SkeletonPulse className="h-6 w-28" />
          <SkeletonPulse className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <SkeletonPulse className="h-3.5 w-24" />
            <SkeletonPulse className="h-9 w-full rounded-lg" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <SkeletonPulse className="h-3.5 w-24" />
              <SkeletonPulse className="h-9 w-full rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <SkeletonPulse className="h-3.5 w-24" />
              <SkeletonPulse className="h-9 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-1.5">
            <SkeletonPulse className="h-3.5 w-32" />
            <SkeletonPulse className="h-24 w-full rounded-lg" />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2">
          <SkeletonPulse className="h-8 w-24 rounded-lg" />
          <SkeletonPulse className="h-8 w-24 rounded-lg" />
        </CardFooter>
      </Card>
    </div>
  );
}
