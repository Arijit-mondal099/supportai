import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  Clock,
  Code2,
  FlaskConical,
  MessageSquare,
  Settings2,
  Users,
} from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";
import { MODELS, PROVIDERS } from "@/lib/options";
import { ConversationModel } from "@/models/conversation.model";
import { MessageModel } from "@/models/message.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default async function BotOverview({ params }: { params: Promise<{ botId: string }> }) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const { botId } = await params;
  const bot = await getChatbot(owner.ownerId, botId);
  if (!bot) redirect("/dashboard");

  const [conversations, messages, latest] = await Promise.all([
    ConversationModel.countDocuments({ botId }),
    MessageModel.countDocuments({ botId }),
    ConversationModel.findOne({ botId }).sort({ lastMessageAt: -1 }).select("lastMessageAt").lean(),
  ]);

  const lastActiveAt = latest?.lastMessageAt
    ? new Date(latest.lastMessageAt as Date).toISOString()
    : null;

  const stats = [
    {
      label: "Conversations",
      value: conversations.toLocaleString(),
      caption: "Sessions handled",
      icon: Users,
    },
    {
      label: "Messages",
      value: messages.toLocaleString(),
      caption: "Replies sent",
      icon: MessageSquare,
    },
    {
      label: "Last active",
      value: formatDate(lastActiveAt),
      caption: latest ? "Most recent session" : "No sessions yet",
      icon: Clock,
    },
  ];

  const details = [
    { label: "Display name", value: bot.botInfo.botName || bot.appearance.displayName || "—" },
    { label: "Business", value: bot.businessInfo.businessName || "—" },
    { label: "Industry", value: bot.businessInfo.industry || "—" },
    { label: "Support email", value: bot.supportEmail || "—" },
    {
      label: "Provider",
      value: PROVIDERS.find((p) => p.value === bot.provider)?.label ?? bot.provider,
    },
    {
      label: "Model",
      value: MODELS[bot.provider]?.find((m) => m.value === bot.model)?.label || "Default",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Counters */}
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.label}
              className="bg-pinstripe group relative overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="absolute inset-0 bg-card/85" aria-hidden />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-1">
                <span className="font-title text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  {s.label}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition-transform group-hover:-translate-y-0.5">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
              </CardHeader>
              <CardContent className="relative">
                <div className="truncate font-heading text-3xl font-bold tracking-tight tabular-nums">
                  {s.value}
                </div>
                <p className="mt-1 truncate text-[13px] text-muted-foreground">{s.caption}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Details + next steps */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Agent details</CardTitle>
            <CardDescription>How this agent is set up right now</CardDescription>
          </div>
          <CardAction>
            <Badge variant={bot.status === "live" ? "default" : "secondary"}>
              {bot.status === "live" ? "Live" : "Draft"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border rounded-xl border border-border bg-muted/40">
            {details.map((it) => (
              <div key={it.label} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <dt className="shrink-0 text-sm text-muted-foreground">{it.label}</dt>
                <dd className="truncate text-sm font-medium">{it.value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-4 py-2.5">
              <dt className="shrink-0 text-sm text-muted-foreground">API key</dt>
              <dd>
                {bot.hasApiKey ? (
                  <span className="font-mono text-[13px] font-medium">{bot.apiKeyMasked}</span>
                ) : (
                  <span className="text-sm font-medium text-destructive">Not set</span>
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/dashboard/bots/${bot._id}/playground`} />}
            nativeButton={false}
          >
            <FlaskConical className="h-3.5 w-3.5" /> Test in playground
          </Button>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/dashboard/bots/${bot._id}/config`} />}
            nativeButton={false}
          >
            <Settings2 className="h-3.5 w-3.5" /> Edit config
          </Button>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/dashboard/bots/${bot._id}/embed`} />}
            nativeButton={false}
          >
            <Code2 className="h-3.5 w-3.5" /> Get embed code
          </Button>
          <Button
            size="sm"
            render={<Link href={`/dashboard/bots/${bot._id}/conversations`} />}
            nativeButton={false}
            className="sm:ml-auto"
          >
            View conversations <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
