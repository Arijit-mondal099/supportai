"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Globe,
  Link2Off,
  Loader2,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ease = { type: "spring", bounce: 0.22, duration: 0.5 } as const;

const plugins = [
  {
    name: "Notion",
    desc: "Connect Notion databases and pages as knowledge sources.",
    icon: BookOpen,
    status: "dynamic" as const,
  },
  {
    name: "Website Widget",
    desc: "Embed the chat widget on any site with a single script tag.",
    icon: Globe,
    status: "active" as const,
  },
];

export default function PluginsPage() {
  const [notionConnected, setNotionConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tokenValue, setTokenValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((data) => setNotionConnected(data.hasNotionIntegration ?? false))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveToken = async (token: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notionIntegrationToken: token }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotionConnected(data.hasNotionIntegration);
        setDialogOpen(false);
      }
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const disconnect = () => saveToken("");

  const connectedCount = (notionConnected ? 1 : 0) + 1;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ease}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">Plugins</h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {loading
              ? "Connect your agents to the tools you already use."
              : `${connectedCount} of ${plugins.length} connected`}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {plugins.map((p) => {
          const Icon = p.icon;
          const isNotion = p.name === "Notion";
          const resolvedStatus = isNotion ? (notionConnected ? "active" : "setup") : "active";

          return (
            <motion.div
              key={p.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={ease}
              className="h-full"
            >
              <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-secondary text-foreground">
                    <Icon size={19} aria-hidden />
                  </span>
                  {loading && isNotion ? (
                    <Badge variant="secondary" className="shrink-0">
                      Checking…
                    </Badge>
                  ) : resolvedStatus === "active" ? (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-emerald-300 bg-emerald-50 text-emerald-700"
                    >
                      <CheckCircle2 size={11} className="mr-1" aria-hidden />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0">
                      Not connected
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <CardDescription className="mt-1">{p.desc}</CardDescription>
                </CardContent>
                <CardFooter className="mt-auto flex items-center gap-2">
                  {isNotion ? (
                    <>
                      <Button
                        variant={notionConnected ? "outline" : "default"}
                        size="sm"
                        onClick={() => {
                          setTokenValue("");
                          setDialogOpen(true);
                        }}
                        disabled={loading}
                      >
                        {notionConnected ? "Update key" : "Connect"}
                      </Button>
                      {notionConnected && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={disconnect}
                          disabled={saving}
                          className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Link2Off size={13} className="mr-1" aria-hidden />
                          Disconnect
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      render={<Link href="/dashboard/agents" />}
                      nativeButton={false}
                      variant="outline"
                      size="sm"
                    >
                      Open agents <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary">
                <BookOpen size={18} aria-hidden />
              </span>
              <div>
                <DialogTitle>Notion integration</DialogTitle>
                <DialogDescription>
                  Paste your Notion internal integration token to connect your workspace.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="notion-token">Integration token</Label>
            <Input
              id="notion-token"
              type="password"
              value={tokenValue}
              onChange={(e) => setTokenValue(e.target.value)}
              placeholder="ntn_..."
              autoComplete="new-password"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Create one at{" "}
              <a
                href="https://www.notion.so/my-integrations"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-2 hover:text-foreground"
              >
                notion.so/my-integrations <ExternalLink className="inline h-3 w-3" aria-hidden />
              </a>
              , then invite it to the pages you want to import.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => saveToken(tokenValue)} disabled={saving || !tokenValue.trim()}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Save className="h-4 w-4" aria-hidden />
              )}
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
