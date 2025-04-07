"use client";

import { useState } from "react";
import { Pencil, Trash, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  ordersAssigned: number;
  rating: number;
}

export function AgentTable({ filter }: { filter: string }) {
  const agents: Agent[] = [
    {
      id: "AG001",
      name: "Ravi Sharma",
      email: "ravi.sharma@wash24.com",
      phone: "+91 9876543210",
      status: "Active",
      ordersAssigned: 12,
      rating: 4,
    },
    {
      id: "AG002",
      name: "Meena Verma",
      email: "meena.verma@wash24.com",
      phone: "+91 9876500012",
      status: "Inactive",
      ordersAssigned: 0,
      rating: 3,
    },
    {
      id: "AG003",
      name: "Amit Singh",
      email: "amit.singh@wash24.com",
      phone: "+91 9911223344",
      status: "Active",
      ordersAssigned: 8,
      rating: 5,
    },
  ];

  const filteredAgents =
    filter === "All"
      ? agents
      : agents.filter((agent) => agent.status === filter);

  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const isAllSelected =
    filteredAgents.length > 0 &&
    filteredAgents.every((agent) => selectedAgents.includes(agent.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(filteredAgents.map((agent) => agent.id));
    }
  };

  const toggleAgentSelection = (id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id)
        ? prev.filter((agentId) => agentId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="bg-white shadow-md rounded-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              <Checkbox
                className="data-[state=checked]:bg-[#9D215D] data-[state=checked]:text-white"
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
              />
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">
              Agent ID
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">
              Name
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">
              Email
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">
              Phone
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">
              Orders Assigned
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">
              Rating
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredAgents.map((agent) => (
            <tr
              key={agent.id}
              className={`hover:bg-gray-50 ${
                selectedAgents.includes(agent.id) ? "bg-gray-50" : ""
              }`}
            >
              <td className="px-4 py-4">
                <Checkbox
                  checked={selectedAgents.includes(agent.id)}
                  onCheckedChange={() => toggleAgentSelection(agent.id)}
                  className="data-[state=checked]:bg-[#9D215D] data-[state=checked]:text-white"
                />
              </td>
              <td className="px-6 py-4">{agent.id}</td>
              <td className="px-6 py-4 font-medium text-gray-900">
                {agent.name}
              </td>
              <td className="px-6 py-4">{agent.email}</td>
              <td className="px-6 py-4">{agent.phone}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                    agent.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {agent.status}
                </span>
              </td>
              <td className="px-6 py-4">
                {agent.ordersAssigned > 0 ? "Yes" : "No"}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < agent.rating ? "#FACC15" : "none"}
                      stroke={i < agent.rating ? "#FACC15" : "#D1D5DB"}
                    />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <button className="text-[#9D215D] hover:text-[#9D215D]">
                  <Pencil size={18} />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
