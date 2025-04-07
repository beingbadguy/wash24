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

export default function DashboardPage() {
  const revenueData = [
    { month: "Jan", amount: 99.42 },
    { month: "Feb", amount: 75.12 },
    { month: "Mar", amount: 84.92 },
    { month: "Apr", amount: 34.0 },
  ];

  const orderStats = [
    { name: "Orders in Progress", value: 92 },
    { name: "Completed Orders", value: 81 },
    { name: "Cancelled Orders", value: 48 },
    { name: "New Orders", value: 92 },
  ];

  return (
    <div className="flex max-h-[90vh] overflow-y-scroll w-full">
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
              <div className="mt-4 space-y-2  grid grid-cols-2 gap-4">
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
  );
}
