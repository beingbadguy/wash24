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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface AgentsStore {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  fetchAgents: (page?: number, limit?: number) => Promise<void>;
}

export const useAgentsStore = create<AgentsStore>((set) => ({
  agents: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
  },
  fetchAgents: async (page = 1, limit = 6) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/admin/delivery-agents", {
        params: {
          page,
          limit,
        },
      });

      // Handle the response data structure
      const data = response.data.data || [];
      const meta = response.data.meta || {
        currentPage: page,
        totalPages: Math.ceil((data.length || 0) / limit),
        totalItems: data.length || 0,
        itemsPerPage: limit,
      };

      // Only set the current page's data
      set({
        agents: data,
        pagination: {
          currentPage: meta.currentPage,
          totalPages: meta.totalPages,
          totalItems: meta.totalItems,
          itemsPerPage: meta.itemsPerPage,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching agents:", error);
      set({
        error: "Failed to fetch agents",
        isLoading: false,
        agents: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: limit,
        },
      });
    }
  },
}));
