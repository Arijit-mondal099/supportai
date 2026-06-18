import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { listChatbots } from "@/lib/chatbots";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const metadata = {
  title: "SupportAI | Dashboard",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const bots = await listChatbots(owner.ownerId);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar bots={bots} email={owner.email} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
