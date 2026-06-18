import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";
import { Embed } from "@/components/Embed";

export default async function BotEmbedPage({ params }: { params: Promise<{ botId: string }> }) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const { botId } = await params;
  const bot = await getChatbot(owner.ownerId, botId);
  if (!bot) redirect("/dashboard");

  return <Embed botId={bot._id} />;
}
