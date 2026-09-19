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
    <div className="space-y-4" aria-hidden>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <SkeletonPulse className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="space-y-2">
            <SkeletonPulse className="h-6 w-36" />
            <SkeletonPulse className="h-4 w-64 max-w-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="overflow-hidden rounded-xl bg-[#1b1a17] px-5 py-5">
            <SkeletonPulse className="h-3.5 w-56 max-w-full" />
            <SkeletonPulse className="mt-3 h-3.5 w-72 max-w-full" />
            <SkeletonPulse className="mt-3 h-3.5 w-40" />
          </div>
          <SkeletonPulse className="h-4 w-64 max-w-full" />
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-2.5">
              <SkeletonPulse className="h-9 w-9 rounded-xl" />
              <SkeletonPulse className="h-2.5 w-14" />
              <SkeletonPulse className="h-4 w-28" />
              <SkeletonPulse className="h-3.5 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div className="flex items-center gap-3">
            <SkeletonPulse className="h-9 w-9 shrink-0 rounded-xl" />
            <div className="space-y-2">
              <SkeletonPulse className="h-6 w-28" />
              <SkeletonPulse className="h-4 w-48 max-w-full" />
            </div>
          </div>
          <SkeletonPulse className="h-5 w-14 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden rounded-xl border border-border p-6 sm:p-8">
            <SkeletonPulse className="h-3 w-20" />
            <SkeletonPulse className="mt-3 h-5 w-2/3" />
            <SkeletonPulse className="mt-2 h-5 w-1/2" />
            <SkeletonPulse className="mt-3 h-2.5 w-full" />
            <SkeletonPulse className="mt-2 h-2.5 w-3/4" />
            <div className="absolute right-5 bottom-5">
              <SkeletonPulse className="h-12 w-12 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
