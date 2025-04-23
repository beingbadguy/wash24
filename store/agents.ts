import { create } from "zustand";
import api from "@/lib/axios";

interface Agent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  orderCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AgentsStore {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
}

export const useAgentsStore = create<AgentsStore>((set) => ({
  agents: [],
  isLoading: false,
  error: null,
  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/admin/delivery-agents");
      set({ agents: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch agents", isLoading: false });
      console.error("Error fetching agents:", error);
    }
  },
}));
