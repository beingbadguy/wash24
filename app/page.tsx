"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
type Order = {
  id: string;
  service: string;
  status: "completed" | "processing" | "pending";
  date: string;
};

type Agent = {
  id: number;
  name: string;
  avatar: string;
};

type ActiveAgent = Agent & {
  currentOrder: string | null;
};

type InactiveAgent = Agent & {
  lastActive: string;
};

type RevenueData = {
  month: string;
  amount: number;
};

type OrderStat = {
  name: string;
  value: number;
};

export default function DashboardPage() {
  const revenueData: RevenueData[] = [
    { month: "Jan", amount: 99.42 },
    { month: "Feb", amount: 75.12 },
    { month: "Mar", amount: 84.92 },
    { month: "Apr", amount: 34.0 },
  ];

  const orderStats: OrderStat[] = [
    { name: "Orders in Progress", value: 92 },
    { name: "Completed Orders", value: 81 },
    { name: "Cancelled Orders", value: 48 },
    { name: "New Orders", value: 92 },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-scroll max-h-[90vh] pb-20">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Recent Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.service}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-500">{order.date}</p>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Agents Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Delivery Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAgents.map((agent) => (
                <div key={agent.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={agent.avatar} />
                    <AvatarFallback>
                      {agent.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-gray-500">
                      {agent.currentOrder
                        ? `Order #${agent.currentOrder}`
                        : "Available"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inactive Delivery Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inactiveAgents.map((agent) => (
                <div key={agent.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={agent.avatar} />
                    <AvatarFallback>
                      {agent.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-gray-500">
                      Last active: {agent.lastActive}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Inactive
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full">
        <div className="flex-1 overflow-auto">
          <main className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Total Revenue</h2>
                  <select className="px-3 py-1 border rounded-md bg-gray-50 cursor-pointer">
                    <option>Filter</option>
                    <option>Daily</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Bar dataKey="amount" fill="#9D215D" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2 grid grid-cols-2 gap-4">
                  <div>
                    <p>January - 99.42 Lakh</p>
                    <p>February - 75.12 Lakh</p>
                    <p>March - 84.92 Lakh</p>
                    <p>April - 34.00 Lakh</p>
                  </div>

                  <div className="flex">
                    <Separator
                      orientation="vertical"
                      className="h-24 w-px bg-gray-300 mx-4"
                    />
                    <div className="w-full flex items-center justify-center flex-col gap-2 font-bold">
                      <p className="text-[#9D215D]">Total Revenue</p>
                      <p>80 Lakh</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Total Orders</h2>
                  <select className="px-3 py-1 border rounded-md bg-gray-50 cursor-pointer">
                    <option>Filter</option>
                    <option>Daily</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="value" fill="#9D215D" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p>Orders in Progress - 92</p>
                    <p>Completed Orders - 81</p>
                    <p>Cancelled Orders - 48</p>
                    <p>New Orders - 92</p>
                  </div>
                  <div className="flex">
                    <Separator
                      orientation="vertical"
                      className="h-24 w-px bg-gray-300 mx-4"
                    />
                    <div className="w-full flex items-center justify-center flex-col gap-2 font-bold">
                      <p className="text-[#9D215D]">Total Orders</p>
                      <p>313</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-6">Total Revenue</h2>
                <p className="text-3xl font-bold">80 Lakh</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-6">Total Orders</h2>
                <p className="text-3xl font-bold">313</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Sample data - Replace with actual data from your backend
const recentOrders: Order[] = [
  {
    id: "1234",
    service: "Wash & Fold",
    status: "processing",
    date: "2024-03-20",
  },
  { id: "1235", service: "Dry Clean", status: "completed", date: "2024-03-19" },
  { id: "1236", service: "Iron Only", status: "pending", date: "2024-03-19" },
];

const activeAgents: ActiveAgent[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/avatars/john.jpg",
    currentOrder: "1234",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/avatars/jane.jpg",
    currentOrder: null,
  },
];

const inactiveAgents: InactiveAgent[] = [
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "/avatars/mike.jpg",
    lastActive: "2 hours ago",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    avatar: "/avatars/sarah.jpg",
    lastActive: "1 day ago",
  },
];

const getStatusVariant = (status: Order["status"]) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "secondary";
    case "processing":
      return "outline";
    case "pending":
      return "default";
    default:
      return "default";
  }
};
