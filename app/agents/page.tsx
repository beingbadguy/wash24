"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AgentTable } from "@/components/AgentTable";
import { useState } from "react";
import { Search } from "lucide-react";

export default function AgentsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="container p-3 ">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
        <p className="text-gray-500">Manage your delivery agents</p>
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
        {/* Search Input */}
        <div className=" w-[500px] flex items-center gap-2 border border-gray-300 rounded p-2">
          <Search className="text-gray-400 ml-1 text-sm" />
          <input
            type="text"
            placeholder="Search agents..."
            className="w-full border-none ml-2 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none shadow-none"
          />
        </div>

        {/* Dropdown */}
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-[200px]" asChild>
              <Button variant="outline">Status: {filter}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuItem onClick={() => setFilter("All")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Active")}>
                Assigned Agent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Inactive")}>
                Offline Agent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Inactive")}>
                Pickup Agent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Inactive")}>
                Pickup Agent
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setFilter("Inactive")}>
                Verified Agent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Inactive")}>
                New Agent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Inactive")}>
                Top Rated Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AgentTable filter={filter} />
    </div>
  );
}
