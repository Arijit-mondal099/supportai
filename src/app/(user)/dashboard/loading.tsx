"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-gray-50 px-3 py-1 shadow-sm">
            <SkeletonPulse className="h-2.5 w-2.5 rounded-full" />
            <SkeletonPulse className="h-3 w-16" />
            <SkeletonPulse className="h-6 w-6 rounded-md" />
          </span>
          <div className="space-y-2">
            <SkeletonPulse className="h-7 w-32" />
            <SkeletonPulse className="h-4 w-48" />
          </div>
        </div>
        <SkeletonPulse className="h-9 w-28" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SkeletonPulse className="h-4 w-20" />
              <SkeletonPulse className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <SkeletonPulse className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <SkeletonPulse className="h-5 w-24" />
            <SkeletonPulse className="h-3 w-40" />
          </CardHeader>
          <CardContent>
            <SkeletonPulse className="h-[240px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <SkeletonPulse className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <SkeletonPulse className="h-4 w-28" />
                <SkeletonPulse className="h-4 w-8" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <SkeletonPulse className="h-5 w-40" />
          <SkeletonPulse className="h-3 w-48" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SkeletonPulse className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <SkeletonPulse className="h-4 w-16" />
                </TableHead>
                <TableHead className="text-right">
                  <SkeletonPulse className="ml-auto h-4 w-16" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <SkeletonPulse className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <SkeletonPulse className="h-4 w-8" />
                  </TableCell>
                  <TableCell className="text-right">
                    <SkeletonPulse className="ml-auto h-4 w-20" />
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
