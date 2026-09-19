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
            <SkeletonPulse className="h-6 w-32" />
            <SkeletonPulse className="h-4 w-56 max-w-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <SkeletonPulse className="h-8 w-full rounded-lg" />
          <div className="space-y-1.5">
            <SkeletonPulse className="h-3.5 w-24" />
            <SkeletonPulse className="h-9 w-full rounded-lg" />
          </div>
          <SkeletonPulse className="h-36 w-full rounded-xl" />
          <SkeletonPulse className="h-9 w-48 rounded-lg" />
        </CardContent>
      </Card>
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <SkeletonPulse className="h-3 w-24" />
          <SkeletonPulse className="h-3.5 w-32" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-3 py-3">
                <SkeletonPulse className="h-9 w-9 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <SkeletonPulse className="h-4 w-32" />
                  <SkeletonPulse className="h-3 w-28" />
                </div>
                <SkeletonPulse className="h-5 w-16 shrink-0 rounded-full" />
                <SkeletonPulse className="h-8 w-8 shrink-0 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
