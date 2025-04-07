// import { OrderTable } from "@/components/orders/OrderTable";

import { OrderTable } from "@/components/OrderTable";

export default function OrdersPage() {
  return (
    <div className="container p-3">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500">
          Manage your orders and track their status
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button className="rounded-md bg-[#9D215D] px-4 py-2 text-sm font-medium text-white hover:bg-[#9D215D]">
              All
            </button>
            <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              New Orders
            </button>
            <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Previous Orders
            </button>
          </div>

          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search orders..."
              className="rounded-md  border-[#9D215D] border-2 px-4 py-2 pl-10 text-sm focus:border-[#9D215D] focus:outline-none focus:ring-1 focus:ring-[#9D215D] w-full"
            />
            <svg
              className="absolute left-3 top-2.5 size-4 text-[#9D215D]"
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

        <OrderTable />
      </div>
    </div>
  );
}
