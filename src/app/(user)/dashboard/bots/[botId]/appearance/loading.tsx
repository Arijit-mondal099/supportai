"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <div className="grid items-start gap-4 lg:grid-cols-2" aria-hidden>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <SkeletonPulse className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="space-y-2">
            <SkeletonPulse className="h-6 w-28" />
            <SkeletonPulse className="h-4 w-64 max-w-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <SkeletonPulse className="h-3.5 w-20" />
            <SkeletonPulse className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <SkeletonPulse className="h-3.5 w-20" />
            <SkeletonPulse className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <SkeletonPulse className="h-3.5 w-28" />
            <SkeletonPulse className="h-20 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <SkeletonPulse className="h-3.5 w-36" />
              <SkeletonPulse className="h-7 w-16 rounded-lg" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <SkeletonPulse className="mt-1 h-8 w-8 shrink-0 rounded-lg" />
                <SkeletonPulse className="h-9 flex-1 rounded-lg" />
                <SkeletonPulse className="h-9 flex-1 rounded-lg" />
                <SkeletonPulse className="mt-0.5 h-8 w-8 shrink-0 rounded-md" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <SkeletonPulse className="h-5 w-28 shrink-0 rounded-full" />
            <SkeletonPulse className="h-9 w-36 rounded-lg" />
          </div>
        </CardContent>
      </Card>
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <SkeletonPulse className="h-3 w-24" />
          <SkeletonPulse className="h-5 w-14 rounded-full" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border px-6 pt-8 pb-4">
          <SkeletonPulse className="mx-auto h-[62px] w-[62px] rounded-2xl" />
          <SkeletonPulse className="mx-auto mt-6 h-6 w-40" />
          <SkeletonPulse className="mx-auto mt-2 h-6 w-64 max-w-full" />
          <SkeletonPulse className="mx-auto mt-3 h-12 w-72 max-w-full" />
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <SkeletonPulse className="h-9 w-28 rounded-lg" />
            <SkeletonPulse className="h-9 w-24 rounded-lg" />
            <SkeletonPulse className="h-9 w-32 rounded-lg" />
          </div>
          <SkeletonPulse className="mt-4 h-16 w-full rounded-[10px]" />
        </div>
      </div>
    </div>
  );
}
