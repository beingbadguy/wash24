"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="container p-3 max-w-full overflow-y-scroll max-h-[90vh] pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500">Manage your customers</p>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <Input type="text" placeholder="Search users..." className="pl-10" />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Status:</span>
          <select className="border rounded-md px-3 py-1.5 text-sm">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Checkbox />
              </th>
              <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="w-64 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Orders
              </th>
              <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membership
              </th>
              <th className="w-auto px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-3 py-4">
                  <Checkbox />
                </td>
                <td className="px-3 py-4 text-sm">{user.id}</td>
                <td className="px-3 py-4 text-sm">{user.name}</td>
                <td className="px-3 py-4 text-sm">{user.email}</td>
                <td className="px-3 py-4 text-sm">{user.phone}</td>
                <td className="px-3 py-4 text-sm">
                  <Badge
                    variant={user.status === "Active" ? "default" : "secondary"}
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="px-3 py-4 text-sm text-center">
                  {user.totalOrders}
                </td>
                <td className="px-3 py-4 text-sm">
                  <Badge variant="outline">{user.membership}</Badge>
                </td>
                <td className="px-3 py-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Order History
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Order History - {user.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Total Orders
                              </p>
                              <p className="text-2xl font-bold">
                                {user.orderHistory.total}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                This Month
                              </p>
                              <p className="text-2xl font-bold">
                                {user.orderHistory.thisMonth}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Total Spent
                              </p>
                              <p className="text-2xl font-bold">
                                ₹{user.orderHistory.totalSpent}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Recent Orders
                            </h3>
                            <div className="space-y-2">
                              {user.orderHistory.recentOrders.map((order) => (
                                <div
                                  key={order.id}
                                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                >
                                  <div>
                                    <p className="font-medium">
                                      Order #{order.id}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {order.service}
                                    </p>
                                  </div>
                                  <div>
                                    <Badge variant="secondary">
                                      {order.status}
                                    </Badge>
                                    <p className="text-sm text-gray-500 mt-1">
                                      ₹{order.amount}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Sample data
const users = [
  {
    id: "USR001",
    name: "Priya Patel",
    email: "priya.patel@gmail.com",
    phone: "+91 9876543210",
    status: "Active",
    totalOrders: 15,
    membership: "Premium",
    orderHistory: {
      total: 15,
      thisMonth: 3,
      totalSpent: 7500,
      recentOrders: [
        {
          id: "1234",
          service: "Wash & Fold",
          status: "Completed",
          amount: 450,
        },
        {
          id: "1235",
          service: "Dry Clean",
          status: "In Progress",
          amount: 850,
        },
        { id: "1236", service: "Iron Only", status: "Pending", amount: 200 },
      ],
    },
  },
  {
    id: "USR002",
    name: "Rahul Kumar",
    email: "rahul.kumar@gmail.com",
    phone: "+91 9876500012",
    status: "Inactive",
    totalOrders: 8,
    membership: "Basic",
    orderHistory: {
      total: 8,
      thisMonth: 0,
      totalSpent: 3200,
      recentOrders: [
        {
          id: "1230",
          service: "Wash & Fold",
          status: "Completed",
          amount: 400,
        },
        { id: "1231", service: "Dry Clean", status: "Completed", amount: 750 },
      ],
    },
  },
  {
    id: "USR003",
    name: "Anjali Sharma",
    email: "anjali.sharma@gmail.com",
    phone: "+91 9911223344",
    status: "Active",
    totalOrders: 25,
    membership: "Premium",
    orderHistory: {
      total: 25,
      thisMonth: 5,
      totalSpent: 12500,
      recentOrders: [
        {
          id: "1237",
          service: "Wash & Fold",
          status: "In Progress",
          amount: 550,
        },
        { id: "1238", service: "Dry Clean", status: "Completed", amount: 950 },
        {
          id: "1239",
          service: "Iron Only",
          status: "In Progress",
          amount: 300,
        },
      ],
    },
  },
];
