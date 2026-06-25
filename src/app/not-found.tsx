import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-pinstripe px-4">
      <span className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-gray-50 pl-3 pr-1 py-1 shadow-sm">
        <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          ERROR
        </span>
        <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
          <ChevronRight className="w-4 h-4" />
        </span>
      </span>

      <h1 className="mt-8 text-8xl font-extrabold tracking-tight text-zinc-900">404</h1>
      <p className="mt-4 text-lg font-medium text-zinc-500">Page not found</p>
      <p className="mt-2 max-w-md text-center text-sm text-zinc-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Double-check the URL
        or head back home.
      </p>

      <Button render={<Link href="/" />} nativeButton={false} className="mt-8 h-10 px-6 text-sm">
        Back to Home
      </Button>
    </div>
  );
}
