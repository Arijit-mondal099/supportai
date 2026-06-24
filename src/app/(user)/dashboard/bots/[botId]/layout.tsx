import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TabBar } from "@/components/dashboard/TabBar";

export default function BotLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ botId: string }>;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <Suspense fallback={<BotHeaderSkeleton />}>
        <BotHeader params={params} />
      </Suspense>
      <div className="py-6">{children}</div>
    </div>
  );
}

function BotHeaderSkeleton() {
  return (
    <>
      <Skeleton className="mb-3 h-4 w-16" />
      <header className="mb-6 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-gray-50 pl-3 pr-1 py-1 shadow-sm mr-2">
          <span className="flex items-center gap-2">
            <Skeleton className="h-2.5 w-2.5 rounded-full" />
            <Skeleton className="h-3 w-10" />
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100">
            <Skeleton className="h-4 w-4" />
          </span>
        </span>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </header>
      <Skeleton className="h-10 w-full" />
    </>
  );
}

async function BotHeader({ params }: { params: Promise<{ botId: string }> }) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const { botId } = await params;
  const bot = await getChatbot(owner.ownerId, botId);
  if (!bot) redirect("/dashboard");

  return (
    <>
      <Link
        href="/dashboard/agents"
        className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Agents
      </Link>
      <header className="mb-6 flex items-center gap-3">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-gray-50 pl-3 pr-1 py-1 shadow-sm mr-2">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            AGENT
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>
        <h1 className="min-w-0 truncate text-2xl font-bold tracking-tight">{bot.name}</h1>
        {bot.status === "live" ? (
          <Badge variant="outline" className="shrink-0 border-emerald-300 bg-emerald-50 text-emerald-700">
            live
          </Badge>
        ) : (
          <Badge variant="secondary" className="shrink-0">draft</Badge>
        )}
      </header>
      <TabBar botId={bot._id} />
    </>
  );
}
