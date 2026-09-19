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
      <div className="space-y-2">
        <SkeletonPulse className="h-9 w-44 sm:h-10 sm:w-52" />
        <SkeletonPulse className="h-4 w-64 max-w-full" />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <SkeletonPulse className="h-11 w-11 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonPulse className="h-5 w-48 max-w-full" />
            <SkeletonPulse className="h-3.5 w-24" />
          </div>
          <SkeletonPulse className="h-5 w-14 shrink-0 rounded-full" />
        </CardHeader>
        <CardFooter className="flex items-center justify-between gap-2">
          <SkeletonPulse className="h-4 w-56 max-w-full" />
          <SkeletonPulse className="h-8 w-24 shrink-0 rounded-lg" />
        </CardFooter>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <SkeletonPulse className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="space-y-2">
            <SkeletonPulse className="h-5 w-24" />
            <SkeletonPulse className="h-3.5 w-64 max-w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <SkeletonPulse className="h-16 w-full rounded-xl" />
        </CardContent>
        <CardFooter>
          <SkeletonPulse className="h-7 w-28 rounded-lg" />
        </CardFooter>
      </Card>
    </div>
  );
}
