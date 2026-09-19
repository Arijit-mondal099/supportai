"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      {/* Header — title + two actions */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <SkeletonPulse className="h-9 w-44 sm:h-10 sm:w-52" />
          <SkeletonPulse className="h-4 w-64 max-w-full sm:w-80" />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SkeletonPulse className="h-8 w-28 rounded-lg" />
          <SkeletonPulse className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* Counter strip — label + icon tile, big number, caption, meter */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <SkeletonPulse className="h-3 w-16" />
              <SkeletonPulse className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <SkeletonPulse className="h-10 w-20" />
              <SkeletonPulse className="mt-2 h-3.5 w-28" />
              <SkeletonPulse className="mt-3 h-1 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity chart + top agents rail */}
      <div className="grid items-start gap-4 lg:grid-cols-5">
        <Card className="overflow-hidden lg:col-span-3">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <SkeletonPulse className="h-6 w-36" />
              <SkeletonPulse className="h-4 w-52" />
            </div>
            <SkeletonPulse className="h-7 w-[136px] rounded-lg" />
          </CardHeader>
          <CardContent>
            <SkeletonPulse className="h-[240px] w-full" />
            <Separator className="my-4" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2 rounded-lg border border-border px-3 py-2.5">
                  <SkeletonPulse className="h-2.5 w-16" />
                  <SkeletonPulse className="h-4 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-2">
              <SkeletonPulse className="h-6 w-28" />
              <SkeletonPulse className="h-4 w-40" />
            </div>
            <SkeletonPulse className="h-7 w-12 rounded-lg" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 px-2 py-2.5">
                  <SkeletonPulse className="h-6 w-6 shrink-0 rounded-full" />
                  <span className="min-w-0 flex-1 space-y-2">
                    <SkeletonPulse className="h-4 w-3/4" />
                    <SkeletonPulse className="h-1 w-full rounded-full" />
                  </span>
                  <SkeletonPulse className="h-4 w-8 shrink-0" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recent conversations — avatar + name, badge, timestamp */}
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <SkeletonPulse className="h-6 w-48" />
            <SkeletonPulse className="h-4 w-56" />
          </div>
          <SkeletonPulse className="h-5 w-16 rounded-full" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <SkeletonPulse className="h-3 w-12" />
                </TableHead>
                <TableHead>
                  <SkeletonPulse className="h-3 w-16" />
                </TableHead>
                <TableHead className="text-right">
                  <SkeletonPulse className="ml-auto h-3 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <span className="flex items-center gap-3.5 py-0.5">
                      <SkeletonPulse className="h-6 w-6 shrink-0 rounded-full" />
                      <SkeletonPulse className="h-4 w-24" />
                    </span>
                  </TableCell>
                  <TableCell>
                    <SkeletonPulse className="h-5 w-10 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <SkeletonPulse className="ml-auto h-4 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
