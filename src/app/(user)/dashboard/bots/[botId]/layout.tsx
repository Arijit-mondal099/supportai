import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";
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
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{bot.name}</h1>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
            bot.status === "live"
              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
              : "border-slate-200 bg-slate-100 text-slate-500"
          }`}
        >
          {bot.status}
        </span>
      </header>
      <TabBar botId={bot._id} />
      <div className="py-6">{children}</div>
    </div>
  );
}
