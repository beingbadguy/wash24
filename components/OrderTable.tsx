"use client";

import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "./ui/button";

interface Order {
  id: string;
  name: string;
  serviceType: string;
  serviceAmount: number;
  pickupDate: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
}

const dummyOrders: Order[] = [
  {
    id: "#LAU1256",
    name: "Ms. Laxmi Sah",
    serviceType: "Wash & Steam Iron",
    serviceAmount: 500,
    pickupDate: "12 Feb 2025",
    paymentStatus: "Paid",
  },
  {
    id: "#LAU1257",
    name: "Mr. Rahul Kumar",
    serviceType: "Dry Clean",
    serviceAmount: 750,
    pickupDate: "13 Feb 2025",
    paymentStatus: "Pending",
  },
  {
    id: "#LAU1258",
    name: "Mrs. Priya Singh",
    serviceType: "Wash & Fold",
    serviceAmount: 300,
    pickupDate: "14 Feb 2025",
    paymentStatus: "Paid",
  },
  // Add more dummy data as needed
];

export function OrderTable() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const handleCheckboxChange = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleDelete = (orderId: string) => {
    console.log("Delete order:", orderId);
  };

  const handleEdit = (orderId: string) => {
    console.log("Edit order:", orderId);
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="h-12 px-4 text-left align-middle font-medium">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#9D215D]  accent-[#9D215D]"
                  onChange={() => {
                    setSelectedOrders(
                      selectedOrders.length === dummyOrders.length
                        ? []
                        : dummyOrders.map((order) => order.id)
                    );
                  }}
                  checked={selectedOrders.length === dummyOrders.length}
                />
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Order ID
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Service Type
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Amount
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Pickup Date
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {dummyOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b transition-colors hover:bg-gray-50/50"
              >
                <td className="h-12 px-4 align-middle">
                  <input
                    type="checkbox"
                    className="accent-purple-600 size-4 "
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleCheckboxChange(order.id)}
                  />
                </td>
                <td className="h-12 px-4 align-middle">{order.id}</td>
                <td className="h-12 px-4 align-middle">{order.name}</td>
                <td className="h-12 px-4 align-middle">{order.serviceType}</td>
                <td className="h-12 px-4 align-middle">
                  ₹{order.serviceAmount}
                </td>
                <td className="h-12 px-4 align-middle">{order.pickupDate}</td>
                <td className="h-12 px-4 align-middle">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="h-12 px-4 align-middle">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(order.id)}
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(order.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <FiTrash2 className="h-4 w-4" />
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
