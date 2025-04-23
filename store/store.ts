import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/lib/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  showOnHome: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  services: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

const storage =
  typeof window !== "undefined"
    ? createJSONStorage(() => localStorage)
    : createJSONStorage(() => ({
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }));

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      storage,
    }
  )
);

export const useCategoryStore = create<CategoryState>()((set) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/admin/categories");
      if (response.data.success) {
        set({ categories: response.data.data, loading: false });
      } else {
        set({ error: "Failed to fetch categories", loading: false });
      }
    } catch (error) {
      set({ error: "Error fetching categories", loading: false });
    }
  },
}));
