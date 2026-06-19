import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";
import { Badge } from "@/components/ui/badge";
import { TabBar } from "@/components/dashboard/TabBar";

export default async function BotLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ botId: string }>;
}) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const { botId } = await params;
  const bot = await getChatbot(owner.ownerId, botId);
  if (!bot) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/agents"
        className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Agents
      </Link>
      <header className="mb-6 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm mr-2">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            AGENT
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>
        <h1 className="text-2xl font-bold tracking-tight">{bot.name}</h1>
        {bot.status === "live" ? (
          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
            live
          </Badge>
        ) : (
          <Badge variant="secondary">draft</Badge>
        )}
      </header>
      <TabBar botId={bot._id} />
      <div className="py-6">{children}</div>
    </div>
  );
}
