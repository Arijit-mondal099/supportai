"use client";

import { apiClient } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CreateBotButton = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.post("/api/chatbots");
      if (data.success) {
        router.push(`/dashboard/bots/${data.bot._id}/config`);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={create} disabled={loading} className={className}>
      {children}
    </button>
  );
};
