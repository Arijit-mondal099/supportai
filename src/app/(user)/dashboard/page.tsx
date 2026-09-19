import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Bot, FileText, Palette, Plus } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getAccountAnalytics } from "@/lib/analytics";
import { listChatbots } from "@/lib/chatbots";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OverviewContent } from "@/components/dashboard/OverviewContent";

const steps = [
  { icon: Bot, title: "Name your agent", text: "Give it a role, tone, and job to do." },
  { icon: FileText, title: "Add knowledge", text: "Drop in docs, links, or FAQs it can quote." },
  { icon: Palette, title: "Match your brand", text: "Tune colors and embed it anywhere." },
];

export default async function OverviewPage() {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const [analytics, bots] = await Promise.all([
    getAccountAnalytics(owner.ownerId),
    listChatbots(owner.ownerId),
  ]);

  if (bots.length === 0) {
    return (
      <div className="mx-auto flex min-h-[62vh] w-full max-w-2xl items-center justify-center py-10">
        <Card className="bg-pinstripe relative w-full overflow-hidden text-center">
          <div className="absolute inset-0 bg-card/88" aria-hidden />
          <CardContent className="relative px-6 py-10 sm:px-10">
            <Badge variant="secondary" className="font-title tracking-[0.14em] uppercase">
              Step one of three minutes
            </Badge>
            <div className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Bot className="h-7 w-7" aria-hidden />
            </div>
            <h1 className="mx-auto mt-5 max-w-md text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Create your first agent
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Spin up an AI support agent, teach it your business, and embed it on any page.
            </p>

            <ul className="mx-auto mt-7 grid gap-2 text-left sm:grid-cols-3">
              {steps.map((s) => {
                const Icon = s.icon;
                return (
                  <li
                    key={s.title}
                    className="rounded-xl border border-border bg-card/90 p-3 shadow-sm"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <p className="mt-2.5 text-[13px] font-semibold">{s.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              <Button size="lg" render={<Link href="/dashboard/agents/new" />} nativeButton={false}>
                <Plus className="h-4 w-4" /> New agent
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/dashboard/agents" />}
                nativeButton={false}
              >
                How it works <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <OverviewContent analytics={analytics} />;
}
