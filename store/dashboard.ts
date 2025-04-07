import { create } from "zustand";

interface Order {
  id: string;
  status: "in-progress" | "completed" | "cancelled" | "new";
  amount: number;
  date: string;
}

interface Revenue {
  month: string;
  amount: number;
}

interface DashboardStore {
  orders: Order[];
  revenue: Revenue[];
  totalRevenue: number;
  totalOrders: number;
  agents: number[];
  users: number[];
}

export const useDashboardStore = create<DashboardStore>(() => ({
  orders: [
    { id: "1", status: "in-progress", amount: 1200, date: "2024-03-15" },
    { id: "2", status: "completed", amount: 2300, date: "2024-03-14" },
    { id: "3", status: "cancelled", amount: 1500, date: "2024-03-13" },
    { id: "4", status: "new", amount: 3400, date: "2024-03-12" },
  ],
  revenue: [
    { month: "January", amount: 99.42 },
    { month: "February", amount: 75.12 },
    { month: "March", amount: 84.92 },
    { month: "April", amount: 34.0 },
  ],
  totalRevenue: 80,
  totalOrders: 313,
  agents: [95, 58, 55, 15, 85, 88],
  users: [92, 55, 55, 18, 88],
}));
