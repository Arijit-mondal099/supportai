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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-gray-50 px-3 py-1 shadow-sm">
            <SkeletonPulse className="h-2.5 w-2.5 rounded-full" />
            <SkeletonPulse className="h-3 w-12" />
            <SkeletonPulse className="h-6 w-6 rounded-md" />
          </span>
          <div className="space-y-2">
            <SkeletonPulse className="h-7 w-24" />
            <SkeletonPulse className="h-4 w-56" />
          </div>
        </div>
        <SkeletonPulse className="h-9 w-28" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex items-start justify-between gap-2 space-y-0">
              <div className="flex items-center gap-3">
                <SkeletonPulse className="h-10 w-10 shrink-0 rounded-xl" />
                <div className="space-y-2">
                  <SkeletonPulse className="h-4 w-24" />
                  <SkeletonPulse className="h-3 w-16" />
                </div>
              </div>
              <SkeletonPulse className="h-8 w-8 shrink-0 rounded-md" />
            </CardHeader>
            <CardContent className="mt-4 flex items-center justify-between">
              <SkeletonPulse className="h-5 w-12 rounded-full" />
              <SkeletonPulse className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
