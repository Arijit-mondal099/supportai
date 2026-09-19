import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    <div className="mx-auto w-full max-w-6xl pb-10">
      <Suspense fallback={<BotHeaderSkeleton />}>
        <BotHeader params={params} />
      </Suspense>
      <div className="py-6">{children}</div>
    </div>
  );
}

function BotHeaderSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="mb-3 h-4 w-16" />
      <header className="mb-6 flex items-center gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-7 w-48 max-w-full sm:h-8 sm:w-64" />
          <Skeleton className="h-4 w-40 max-w-full" />
        </div>
        <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
      </header>
      <div className="flex gap-1 border-b border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 shrink-0 rounded-md" />
        ))}
      </div>
    </div>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

async function BotHeader({ params }: { params: Promise<{ botId: string }> }) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const { botId } = await params;
  const bot = await getChatbot(owner.ownerId, botId);
  if (!bot) redirect("/dashboard");

  const isLive = bot.status === "live";

  return (
    <>
      <Link
        href="/dashboard/agents"
        className="mb-3 inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Agents
      </Link>
      <header className="mb-6 flex items-center gap-3.5">
        <span className="relative shrink-0">
          <Avatar className="size-12 rounded-2xl">
            <AvatarFallback className="rounded-2xl bg-secondary font-title text-base font-bold">
              <span className="inline-block scale-[0.85] leading-none">{initials(bot.name)}</span>
            </AvatarFallback>
          </Avatar>
          <span
            title={isLive ? "Live" : "Draft"}
            aria-hidden
            className={`absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-background ${isLive ? "bg-emerald-500" : "bg-zinc-400"}`}
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="min-w-0 truncate text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              {bot.name}
            </h1>
            <Badge variant={isLive ? "default" : "secondary"} className="shrink-0">
              {isLive ? "Live" : "Draft"}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {[bot.businessInfo.businessName, bot.businessInfo.industry]
              .filter(Boolean)
              .join(" · ") || "Untitled business"}
          </p>
        </div>
      </header>
      <TabBar botId={bot._id} />
      <Separator className="mt-3" />
    </>
  );
}
