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
import { Pencil, Trash, Star } from "lucide-react";

export default function AgentsPage() {
  return (
    <div className="container p-3 max-w-full overflow-y-scroll max-h-[90vh] pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
        <p className="text-gray-500">Manage your delivery agents</p>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <Input type="text" placeholder="Search agents..." className="pl-10" />
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
                Agent ID
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
                Orders Assigned
              </th>
              <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="w-auto px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td className="px-3 py-4">
                  <Checkbox />
                </td>
                <td className="px-3 py-4 text-sm">{agent.id}</td>
                <td className="px-3 py-4 text-sm">{agent.name}</td>
                <td className="px-3 py-4 text-sm">{agent.email}</td>
                <td className="px-3 py-4 text-sm">{agent.phone}</td>
                <td className="px-3 py-4 text-sm">
                  <Badge
                    variant={
                      agent.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {agent.status}
                  </Badge>
                </td>
                <td className="px-3 py-4 text-sm text-center">
                  {agent.ordersAssigned}
                </td>
                <td className="px-3 py-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < agent.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-3 py-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          Orders Report
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>
                            Order Assignment Report - {agent.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Today`&apos;`s Orders
                              </p>
                              <p className="text-2xl font-bold">
                                {agent.reports.today}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Weekly Orders
                              </p>
                              <p className="text-2xl font-bold">
                                {agent.reports.weekly}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Monthly Orders
                              </p>
                              <p className="text-2xl font-bold">
                                {agent.reports.monthly}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Recent Orders
                            </h3>
                            <div className="space-y-2">
                              {agent.reports.recentOrders.map((order) => (
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
                                  <Badge variant="secondary">
                                    {order.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          Earnings Report
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>
                            Earnings Report - {agent.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Today`&apos;`s Earnings
                              </p>
                              <p className="text-2xl font-bold">
                                ₹{agent.earnings.today}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Weekly Earnings
                              </p>
                              <p className="text-2xl font-bold">
                                ₹{agent.earnings.weekly}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Monthly Earnings
                              </p>
                              <p className="text-2xl font-bold">
                                ₹{agent.earnings.monthly}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Earnings History
                            </h3>
                            <div className="space-y-2">
                              {agent.earnings.history.map((entry, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                >
                                  <div>
                                    <p className="font-medium">{entry.date}</p>
                                    <p className="text-sm text-gray-500">
                                      {entry.orders} orders
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      ₹{entry.amount}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Commission: ₹{entry.commission}
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
                      size="sm"
                      variant="outline"
                      className="text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
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
const agents = [
  {
    id: "AG001",
    name: "Ravi Sharma",
    email: "ravi.sharma@wash24.com",
    phone: "+91 9876543210",
    status: "Active",
    ordersAssigned: "Yes",
    rating: 4,
    reports: {
      today: 5,
      weekly: 28,
      monthly: 112,
      recentOrders: [
        { id: "1234", service: "Wash & Fold", status: "Completed" },
        { id: "1235", service: "Dry Clean", status: "In Progress" },
        { id: "1236", service: "Iron Only", status: "Pending" },
      ],
    },
    earnings: {
      today: 1200,
      weekly: 8400,
      monthly: 33600,
      history: [
        { date: "Today", orders: 5, amount: 1200, commission: 120 },
        { date: "Yesterday", orders: 6, amount: 1500, commission: 150 },
        { date: "18 Mar 2024", orders: 4, amount: 1000, commission: 100 },
      ],
    },
  },
  {
    id: "AG002",
    name: "Meena Verma",
    email: "meena.verma@wash24.com",
    phone: "+91 9876500012",
    status: "Inactive",
    ordersAssigned: "No",
    rating: 3,
    reports: {
      today: 0,
      weekly: 15,
      monthly: 60,
      recentOrders: [
        { id: "1230", service: "Wash & Fold", status: "Completed" },
        { id: "1231", service: "Dry Clean", status: "Completed" },
      ],
    },
    earnings: {
      today: 0,
      weekly: 4500,
      monthly: 18000,
      history: [
        { date: "Yesterday", orders: 3, amount: 750, commission: 75 },
        { date: "17 Mar 2024", orders: 4, amount: 1000, commission: 100 },
      ],
    },
  },
  {
    id: "AG003",
    name: "Amit Singh",
    email: "amit.singh@wash24.com",
    phone: "+91 9911223344",
    status: "Active",
    ordersAssigned: "Yes",
    rating: 5,
    reports: {
      today: 7,
      weekly: 32,
      monthly: 128,
      recentOrders: [
        { id: "1237", service: "Wash & Fold", status: "In Progress" },
        { id: "1238", service: "Dry Clean", status: "Completed" },
        { id: "1239", service: "Iron Only", status: "In Progress" },
      ],
    },
    earnings: {
      today: 1750,
      weekly: 9600,
      monthly: 38400,
      history: [
        { date: "Today", orders: 7, amount: 1750, commission: 175 },
        { date: "Yesterday", orders: 5, amount: 1250, commission: 125 },
        { date: "18 Mar 2024", orders: 6, amount: 1500, commission: 150 },
      ],
    },
  },
];
