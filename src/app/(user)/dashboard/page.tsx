import { redirect } from "next/navigation";
import { Bot, Plus } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { listChatbots } from "@/lib/chatbots";
import { CreateBotButton } from "@/components/dashboard/CreateBotButton";

export default async function DashboardHome() {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const bots = await listChatbots(owner.ownerId);
  if (bots.length > 0) redirect(`/dashboard/bots/${bots[0]._id}`);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
        <Bot size={26} className="text-white" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
        Create your first chatbot
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        Spin up an AI support assistant, give it a persona, and embed it on your site in minutes.
      </p>
      <CreateBotButton className="mt-6 flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50">
        <Plus size={16} /> New chatbot
      </CreateBotButton>
    </div>
  );
}
