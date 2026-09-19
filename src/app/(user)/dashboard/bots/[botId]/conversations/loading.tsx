"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="grid items-start gap-4 lg:grid-cols-[20rem_1fr]" aria-hidden>
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <SkeletonPulse className="h-3 w-20" />
          <SkeletonPulse className="h-5 w-10 rounded-full" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <SkeletonPulse className="h-3.5 w-24" />
                <SkeletonPulse className="h-5 w-12 rounded-full" />
              </div>
              <SkeletonPulse className="mt-2 h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
      <Card className="min-h-80 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
          <SkeletonPulse className="h-4 w-40" />
          <SkeletonPulse className="h-4 w-16" />
        </div>
        <CardContent className="space-y-3 py-5">
          <SkeletonPulse className="h-12 w-2/3 rounded-2xl rounded-bl-sm" />
          <SkeletonPulse className="ml-auto h-10 w-1/2 rounded-2xl rounded-br-sm" />
          <SkeletonPulse className="h-16 w-3/4 rounded-2xl rounded-bl-sm" />
        </CardContent>
      </Card>
    </div>
  );
}
