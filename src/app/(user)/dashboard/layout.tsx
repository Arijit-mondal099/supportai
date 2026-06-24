import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { listChatbots } from "@/lib/chatbots";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "SupportAI | Dashboard",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const bots = await listChatbots(owner.ownerId);

  return (
    <SidebarProvider>
      <AppSidebar agentCount={bots.length} />
      <SidebarInset className="no-scrollbar max-h-svh overflow-y-auto">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-sidebar px-4">
          <SidebarTrigger className="border-r border-border" />
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <PageTransition>
          <div className="flex-1 p-4 sm:p-6">{children}</div>
        </PageTransition>
      </SidebarInset>
      <Toaster position="top-center" />
    </SidebarProvider>
  );
}
