"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Trash2, Eye } from "lucide-react";

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  membership: "Basic" | "Premium" | "Gold";
  totalOrders: number;
}

const dummyUsers: User[] = [
  {
    id: "U001",
    name: "Priya Mehta",
    phone: "+91 9876543210",
    email: "priya.mehta@example.com",
    membership: "Gold",
    totalOrders: 25,
  },
  {
    id: "U002",
    name: "Rahul Jain",
    phone: "+91 9988776655",
    email: "rahul.jain@example.com",
    membership: "Basic",
    totalOrders: 5,
  },
  {
    id: "U003",
    name: "Sneha Kapoor",
    phone: "+91 9123456780",
    email: "sneha.kapoor@example.com",
    membership: "Premium",
    totalOrders: 14,
  },
];

export function UsersTable() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredUsers = dummyUsers.filter((user) => {
    return (
      (filter === "All" || user.membership === filter) &&
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleCheckbox = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search users..."
          className="w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-[#9D215D] border-[#9D215D]"
            >
              <Filter className="w-4 h-4 mr-2" />
              {filter === "All" ? "Filter by Membership" : filter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Basic")}>
              Basic
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Premium")}>
              Premium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Gold")}>
              Gold
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={selectedIds.length === filteredUsers.length}
                  onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                  className="border-[#9D215D] data-[state=checked]:bg-[#9D215D] data-[state=checked]:text-white text-[#9D215D]"
                />
              </TableHead>
              <TableHead className="text-[#9D215D]">User ID</TableHead>
              <TableHead className="text-[#9D215D]">Name</TableHead>
              <TableHead className="text-[#9D215D]">Phone</TableHead>
              <TableHead className="text-[#9D215D]">Email</TableHead>
              <TableHead className="text-[#9D215D]">Membership</TableHead>
              <TableHead className="text-[#9D215D]#9D215D">
                Total Orders
              </TableHead>
              <TableHead className="text-[#9D215D] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(user.id)}
                    onCheckedChange={() => toggleCheckbox(user.id)}
                    className="border-[#9D215D] data-[state=checked]:bg-[#9D215D] data-[state=checked]:text-white text-[#9D215D]"
                  />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-[#9D215D]">
                    {user.membership}
                  </span>
                </TableCell>
                <TableCell>{user.totalOrders}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="icon" variant="ghost">
                    <Eye className="w-4 h-4 text-[#9D215D]" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
