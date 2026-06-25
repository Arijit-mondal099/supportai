"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteBot } from "@/hooks/use-bots";

export const DeleteBotSection = ({ botId, botName }: { botId: string; botName: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteBot();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(botId);
      toast.success("Agent deleted");
      router.push("/dashboard/agents");
      router.refresh();
    } catch {
      toast.error("Could not delete agent.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.5, delay: 0.2 }}
    >
      <Card className="mt-5 border-destructive/30">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle size={17} />
            </span>
            <div>
              <h3 className="text-sm font-semibold">Delete this agent</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Permanently removes <span className="font-medium text-foreground">{botName}</span>,
                its knowledge base, and all conversations. This can&apos;t be undone.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" /> Delete agent
          </Button>
        </CardContent>

        <AlertDialog
          open={open}
          onOpenChange={(o) => {
            if (!deleteMutation.isPending) setOpen(o);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {botName}?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes the agent, its knowledge base, and all conversations. This
                can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </motion.div>
  );
};
