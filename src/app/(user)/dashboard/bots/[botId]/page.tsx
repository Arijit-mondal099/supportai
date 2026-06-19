import { redirect } from "next/navigation";
import { Clock, MessageSquare, Users } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";
import { MODELS, PROVIDERS } from "@/lib/options";
import { ConversationModel } from "@/models/conversation.model";
import { MessageModel } from "@/models/message.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    { label: "Conversations", value: conversations.toLocaleString(), icon: Users },
    { label: "Messages", value: messages.toLocaleString(), icon: MessageSquare },
    { label: "Last active", value: formatDate(lastActiveAt), icon: Clock },
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
    { label: "API key", value: bot.hasApiKey ? bot.apiKeyMasked : "Not set" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border">
            {details.map((it) => (
              <div key={it.label} className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-sm text-muted-foreground">{it.label}</dt>
                <dd className="truncate text-sm font-medium">{it.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
