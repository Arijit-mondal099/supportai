import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";

export default async function BotOverview({ params }: { params: Promise<{ botId: string }> }) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const { botId } = await params;
  const bot = await getChatbot(owner.ownerId, botId);
  if (!bot) redirect("/dashboard");

  const items = [
    { label: "Display name", value: bot.botInfo.botName || bot.appearance.displayName || "—" },
    { label: "Business", value: bot.businessInfo.businessName || "—" },
    { label: "Industry", value: bot.businessInfo.industry || "—" },
    { label: "Support email", value: bot.supportEmail || "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {it.label}
            </p>
            <p className="mt-1.5 truncate text-sm font-medium text-slate-800">{it.value}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-400">
        Conversation analytics will appear here once your bot starts chatting.
      </p>
    </div>
  );
}
