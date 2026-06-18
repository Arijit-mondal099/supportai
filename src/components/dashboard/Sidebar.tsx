"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bot, Check, LogOut, Plus, Settings, Trash2, X } from "lucide-react";
import type { SerializedBot } from "@/lib/chatbots";
import { apiClient } from "@/lib/axios";
import { CreateBotButton } from "./CreateBotButton";

export const Sidebar = ({ bots, email }: { bots: SerializedBot[]; email: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { data } = await apiClient.delete(`/api/chatbots/${id}`);
      if (data.success) {
        setConfirmId(null);
        if (pathname.startsWith(`/dashboard/bots/${id}`)) router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900">
          <Bot size={17} className="text-white" />
        </div>
        <span className="font-title text-base font-bold tracking-tight text-slate-900">
          Support<span className="text-slate-400">AI</span>
        </span>
      </div>

      {/* Bots */}
      <div className="flex-1 overflow-y-auto p-3">
        <span className="block px-2 pb-2 font-title text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Chatbots
        </span>
        <nav className="space-y-1">
          {bots.map((b) => {
            const active = pathname.startsWith(`/dashboard/bots/${b._id}`);
            const confirming = confirmId === b._id;
            return (
              <div
                key={b._id}
                className={`group relative flex items-center rounded-xl transition ${
                  active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Link
                  href={`/dashboard/bots/${b._id}`}
                  className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-sm"
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      b.status === "live" ? "bg-emerald-400" : "bg-slate-300"
                    }`}
                  />
                  <span className="flex-1 truncate font-medium">{b.name}</span>
                </Link>

                {confirming ? (
                  <span className="flex shrink-0 items-center gap-0.5 pr-2">
                    <button
                      onClick={() => handleDelete(b._id)}
                      disabled={deletingId === b._id}
                      aria-label="Confirm delete"
                      className="cursor-pointer rounded-md p-1 text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      aria-label="Cancel delete"
                      className={`cursor-pointer rounded-md p-1 transition ${
                        active
                          ? "text-white/70 hover:bg-white/10"
                          : "text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmId(b._id)}
                    aria-label="Delete chatbot"
                    className={`mr-2 shrink-0 cursor-pointer rounded-md p-1 opacity-0 transition group-hover:opacity-100 ${
                      active
                        ? "text-white/70 hover:bg-white/10"
                        : "text-slate-400 hover:text-rose-500"
                    }`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
          {bots.length === 0 && (
            <p className="px-3 py-2 text-xs text-slate-400">No chatbots yet.</p>
          )}
        </nav>

        <CreateBotButton className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-700 disabled:opacity-50">
          <Plus size={15} /> New bot
        </CreateBotButton>
      </div>

      {/* Account + logout */}
      <div className="space-y-1 border-t border-slate-100 p-3">
        <Link
          href="/dashboard/account"
          className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
            pathname === "/dashboard/account"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Settings size={16} /> Account
        </Link>
        <p className="truncate px-3 pt-1 text-[11px] text-slate-400">{email}</p>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100"
        >
          <LogOut size={16} /> Log out
        </a>
      </div>
    </aside>
  );
};
