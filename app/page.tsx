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

// type OrderStat = {
//   name: string;
//   value: number;
// };

export default function DashboardPage() {
  const revenueData: RevenueData[] = [
    { month: "Jan", amount: 99.42 },
    { month: "Feb", amount: 75.12 },
    { month: "Mar", amount: 84.92 },
    { month: "Apr", amount: 34.0 },
  ];

  // const orderStats: OrderStat[] = [
  //   { name: "Orders in Progress", value: 92 },
  //   { name: "Completed Orders", value: 81 },
  //   { name: "Cancelled Orders", value: 48 },
  //   { name: "New Orders", value: 92 },
  // ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents.length}</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {order.service}
                    </p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="ml-auto font-medium">+$25.00</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Active Delivery Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {activeAgents.map((agent) => (
                <div key={agent.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {agent.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {agent.currentOrder
                        ? `Order #${agent.currentOrder}`
                        : "Available"}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Badge
                      variant={agent.currentOrder ? "default" : "secondary"}
                    >
                      {agent.currentOrder ? "On Delivery" : "Available"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Inactive Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {inactiveAgents.map((agent) => (
                <div key={agent.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {agent.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last active: {agent.lastActive}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
