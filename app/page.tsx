"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowUp,
  Users,
  Package,
  IndianRupee,
  Activity,
  LineChart,
  BarChart2,
  Calendar,
  UserCheck,
  UserX,
} from "lucide-react";

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
    { month: "May", amount: 45.0 },
    { month: "Jun", amount: 67.0 },
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-[#9D215D] to-[#BE185D] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 rounded-full bg-white/10">
              <IndianRupee className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹80 Lakh</div>
            <div className="flex items-center text-xs">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+20.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="p-2 rounded-full bg-white/10">
              <Package className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">313</div>
            <div className="flex items-center text-xs">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+180.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delivery Agents
            </CardTitle>
            <div className="p-2 rounded-full bg-white/10">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-xs">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+4 new agents this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <div className="p-2 rounded-full bg-white/10">
              <Activity className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+2 new services added</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <LineChart className="h-5 w-5 text-[#9D215D]" />
            <CardTitle>Revenue Overview</CardTitle>
          </div>
          <select className="px-3 py-1.5 border rounded-md bg-gray-50 cursor-pointer text-sm">
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9D215D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#9D215D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#666" }}
                  axisLine={{ stroke: "#666" }}
                />
                <YAxis tick={{ fill: "#666" }} axisLine={{ stroke: "#666" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#9D215D"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Orders and Recent Orders Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-5 w-5 text-[#9D215D]" />
              <CardTitle>Total Orders</CardTitle>
            </div>
            <select className="px-3 py-1.5 border rounded-md bg-gray-50 cursor-pointer text-sm">
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderStats}
                  margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#666" }}
                    axisLine={{ stroke: "#666" }}
                  />
                  <YAxis
                    tick={{ fill: "#666" }}
                    axisLine={{ stroke: "#666" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="value" fill="#9D215D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-[#9D215D]" />
              <CardTitle>Recent Orders</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-[#9D215D]/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-[#9D215D]" />
                    </div>
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{order.service}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "processing"
                        ? "secondary"
                        : "outline"
                    }
                    className={`${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                    }`}
                  >
                    {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Agents Status */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Delivery Agents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-[#9D215D]" />
              <CardTitle>Active Delivery Agents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback className="bg-[#9D215D]/10 text-[#9D215D]">
                        {agent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
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
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                  >
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inactive Delivery Agents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-[#9D215D]" />
              <CardTitle>Inactive Delivery Agents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inactiveAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback className="bg-gray-100 text-gray-800">
                        {agent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-gray-500">
                        Last active: {agent.lastActive}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Inactive
                  </Badge>
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

// const getStatusVariant = (status: Order["status"]) => {
//   switch (status.toLowerCase()) {
//     case "completed":
//       return "success";
//     case "processing":
//       return "warning";
//     case "pending":
//       return "default";
//     default:
//       return "default";
//   }
// };
