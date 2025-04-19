"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
} from "lucide-react";

// Mock user data - replace with actual data fetching
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 890",
  address: "123 Main St, City, Country",
  joinDate: "2023-01-15",
  status: "Active",
  totalOrders: 12,
  totalSpent: 1250.0,
  recentOrders: [
    {
      id: "ORD-001",
      date: "2023-06-15",
      amount: 150.0,
      status: "Delivered",
    },
    {
      id: "ORD-002",
      date: "2023-06-10",
      amount: 200.0,
      status: "Processing",
    },
  ],
  orders: [
    {
      id: "ORD001",
      date: "2023-06-15",
      service: "Wash & Fold",
      status: "Completed",
      amount: 450,
    },
    {
      id: "ORD002",
      date: "2023-06-10",
      service: "Dry Clean",
      status: "In Progress",
      amount: 850,
    },
    {
      id: "ORD003",
      date: "2023-06-05",
      service: "Iron Only",
      status: "Pending",
      amount: 200,
    },
  ],
};

export default function UserDetailsPage() {
  const router = useRouter();

  // In a real application, you would fetch user data here
  const user = mockUser;

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          className: "bg-green-100 text-green-800",
        };
      case "In Progress":
        return {
          icon: <Clock className="h-4 w-4" />,
          className: "bg-blue-100 text-blue-800",
        };
      case "Pending":
        return {
          icon: <Clock className="h-4 w-4" />,
          className: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          icon: <XCircle className="h-4 w-4" />,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  return (
    <div className="container p-3 max-w-full overflow-y-scroll max-h-[90vh] pb-20">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
                  user.status === "Active" ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-gray-500">ID: {user.id}</p>
                </div>
                <Badge
                  variant={user.status === "Active" ? "default" : "destructive"}
                  className={`${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{user.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined: {user.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-lg font-semibold">{user.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-lg font-semibold">₹{user.totalSpent}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {user.orders.map((order) => {
                    const statusDetails = getStatusDetails(order.status);
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Package className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{order.service}</p>
                            <p className="text-sm text-gray-500">
                              Order #{order.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="secondary"
                            className={statusDetails.className}
                          >
                            <div className="flex items-center gap-1">
                              {statusDetails.icon}
                              {order.status}
                            </div>
                          </Badge>
                          <div className="text-right">
                            <p className="font-medium">₹{order.amount}</p>
                            <p className="text-sm text-gray-500">
                              {order.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
