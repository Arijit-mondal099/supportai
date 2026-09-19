"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
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
    <Card className="flex h-[32rem] flex-col gap-0 overflow-hidden py-0 shadow-sm" aria-hidden>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <SkeletonPulse className="h-8 w-8 shrink-0 rounded-xl" />
          <div className="space-y-1 leading-tight">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-3 w-32" />
          </div>
        </div>
        <SkeletonPulse className="h-7 w-20 shrink-0 rounded-lg" />
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <div className="flex items-end gap-2">
          <SkeletonPulse className="h-6 w-6 shrink-0 rounded-lg" />
          <SkeletonPulse className="h-12 w-3/5 rounded-2xl rounded-bl-sm" />
        </div>
        <div className="flex justify-end">
          <SkeletonPulse className="h-10 w-2/5 rounded-2xl rounded-br-sm" />
        </div>
        <div className="flex items-end gap-2">
          <SkeletonPulse className="h-6 w-6 shrink-0 rounded-lg" />
          <SkeletonPulse className="h-16 w-3/4 rounded-2xl rounded-bl-sm" />
        </div>
        <div className="flex justify-end">
          <SkeletonPulse className="h-10 w-1/2 rounded-2xl rounded-br-sm" />
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="flex gap-2 overflow-hidden border-t border-border px-4 pt-3 pb-3">
        <SkeletonPulse className="h-7 w-28 shrink-0 rounded-full" />
        <SkeletonPulse className="h-7 w-24 shrink-0 rounded-full" />
        <SkeletonPulse className="h-7 w-32 shrink-0 rounded-full" />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border py-2 pr-2 pl-5">
          <SkeletonPulse className="h-12 flex-1" />
          <SkeletonPulse className="h-11 w-11 shrink-0 rounded-xl" />
        </div>
      </div>
    </Card>
  );
}
