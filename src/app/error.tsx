"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-pinstripe px-4">
      <span className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-gray-50 pl-3 pr-1 py-1 shadow-sm">
        <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          ERROR
        </span>
        <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
          <ChevronRight className="w-4 h-4" />
        </span>
      </span>

      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 border border-red-200">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-center text-sm text-zinc-400">
        An unexpected error occurred. Please try again or return home.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Button onClick={reset}>Try Again</Button>
        <Button render={<Link href="/" />} nativeButton={false} variant="outline">
          Go Home
        </Button>
      </div>
    </div>
  );
}
