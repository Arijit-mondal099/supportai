import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { Provider } from "@/lib/options";

export function useDeleteBot() {
  return useMutation({
    mutationFn: async (botId: string) => {
      const { data } = await apiClient.delete(`/api/chatbots/${botId}`);
      if (!data.success) throw new Error(data.message || "Could not delete agent.");
      return data;
    },
  });
}

interface UpdateBotPayload {
  name?: string;
  status?: "draft" | "live";
  supportEmail?: string;
  provider?: Provider;
  model?: string;
  apiKey?: string;
  businessInfo?: {
    businessName?: string;
    industry?: string;
    description?: string;
  };
  botInfo?: {
    botName?: string;
    communicationTone?: string;
    personalityDescription?: string;
  };
  appearance?: {
    accentColor?: string;
    avatarUrl?: string;
    displayName?: string;
    welcomeMessage?: string;
  };
}

export function useUpdateBot(botId: string) {
  return useMutation({
    mutationFn: async (payload: UpdateBotPayload) => {
      const { data } = await apiClient.put(`/api/chatbots/${botId}`, payload);
      if (!data.success) throw new Error(data.message || "Could not save changes.");
      return data;
    },
  });
}

interface CreateBotPayload {
  name: string;
  status: "draft" | "live";
  supportEmail: string;
  provider: string;
  model: string;
  apiKey: string;
  businessInfo: {
    businessName: string;
    industry: string;
    description: string;
  };
  botInfo: {
    botName: string;
    communicationTone: string;
    personalityDescription: string;
  };
}

export function useCreateBot() {
  return useMutation({
    mutationFn: async (payload: CreateBotPayload) => {
      const { data } = await apiClient.post("/api/chatbots", payload);
      if (!data.success) throw new Error(data.message || "Could not create agent.");
      return data;
    },
  });
}
