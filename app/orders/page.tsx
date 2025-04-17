// import { OrderTable } from "@/components/orders/OrderTable";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OrdersPage() {
  return (
    <div className="container p-3 max-w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500">
          Manage your orders and track their status
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap gap-4">
          <Button variant="default" className="bg-[#9D215D] hover:bg-[#8D114D]">
            All
          </Button>
          <Button variant="outline">New Orders</Button>
          <Button variant="outline">Previous Orders</Button>
        </div>

        <div className="relative w-full md:w-1/3">
          <Input type="text" placeholder="Search orders..." className="pl-10" />
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
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Checkbox />
              </th>
              <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="w-72 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services
              </th>
              <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pickup Date
              </th>
              <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Agent
              </th>
              <th className="w-auto px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-3 py-4">
                  <Checkbox />
                </td>
                <td className="px-3 py-4 text-sm">#{order.id}</td>
                <td className="px-3 py-4 text-sm">{order.customerName}</td>
                <td className="px-3 py-4">
                  <div className="space-y-1 min-w-[200px]">
                    {order.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm">{service.name}</span>
                        <Badge variant="outline">₹{service.price}</Badge>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-4 text-sm">
                  ₹
                  {order.services.reduce(
                    (total, service) => total + service.price,
                    0
                  )}
                </td>
                <td className="px-3 py-4 text-sm">{order.pickupDate}</td>
                <td className="px-3 py-4 text-sm">
                  <Badge
                    variant={
                      order.status === "Paid"
                        ? "secondary"
                        : order.status === "Pending"
                        ? "outline"
                        : "default"
                    }
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="px-3 py-4 text-sm">
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Assign Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAgents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id.toString()}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-4 text-sm">
                  <div className="flex flex-wrap gap-2 min-w-[200px]">
                    {order.status === "Pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Accept
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Order Details #{order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">
                              Customer Information
                            </h3>
                            <p>Name: {order.customerName}</p>
                            <p>Phone: {order.phone}</p>
                            <p>Address: {order.address}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Services</h3>
                            {order.services.map((service, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-2 border-b"
                              >
                                <span>{service.name}</span>
                                <span>₹{service.price}</span>
                              </div>
                            ))}
                            <div className="flex justify-between items-center pt-2 font-semibold">
                              <span>Total</span>
                              <span>
                                ₹
                                {order.services.reduce(
                                  (total, service) => total + service.price,
                                  0
                                )}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Order Status</h3>
                            <Badge>{order.status}</Badge>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
const orders = [
  {
    id: "LAU1256",
    customerName: "Ms. Laxmi Sah",
    phone: "+91 9876543210",
    address: "123 Main St, Mumbai",
    services: [
      { name: "Wash & Steam Iron", price: 300 },
      { name: "Dry Clean", price: 200 },
    ],
    pickupDate: "12 Feb 2025",
    status: "Paid",
  },
  {
    id: "LAU1257",
    customerName: "Mr. Rahul Kumar",
    phone: "+91 9876543211",
    address: "456 Park Ave, Delhi",
    services: [{ name: "Dry Clean", price: 750 }],
    pickupDate: "13 Feb 2025",
    status: "Pending",
  },
  {
    id: "LAU1258",
    customerName: "Mrs. Priya Singh",
    phone: "+91 9876543212",
    address: "789 Lake View, Bangalore",
    services: [
      { name: "Wash & Fold", price: 200 },
      { name: "Iron Only", price: 100 },
    ],
    pickupDate: "14 Feb 2025",
    status: "Paid",
  },
];

const availableAgents = [
  { id: 1, name: "Rahul Kumar" },
  { id: 2, name: "Priya Singh" },
  { id: 3, name: "Amit Patel" },
];
