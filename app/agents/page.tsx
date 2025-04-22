"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import {
  FileText,
  DollarSign,
  Package,
  MoreVertical,
  Edit,
  Trash,
  Plus,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock data - replace with actual data fetching
const mockAgents = [
  {
    id: "1",
    name: "John Smith",
    phone: "+1 234 567 890",
    status: "Active",
    totalOrders: 45,
    totalEarnings: 1250.0,
    joinDate: "2023-01-15",
    recentOrders: [
      { id: "ORD-001", amount: 150.0, date: "2023-06-15" },
      { id: "ORD-002", amount: 200.0, date: "2023-06-10" },
    ],
    recentEarnings: [
      { amount: 150.0, date: "2023-06-15" },
      { amount: 200.0, date: "2023-06-10" },
    ],
    avatar: "/john-smith.jpg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+1 987 654 321",
    status: "Inactive",
    totalOrders: 32,
    totalEarnings: 980.0,
    joinDate: "2023-02-20",
    recentOrders: [
      { id: "ORD-003", amount: 180.0, date: "2023-06-12" },
      { id: "ORD-004", amount: 220.0, date: "2023-06-08" },
    ],
    recentEarnings: [
      { amount: 180.0, date: "2023-06-12" },
      { amount: 220.0, date: "2023-06-08" },
    ],
    avatar: "/sarah-johnson.jpg",
  },
];

type Agent = (typeof mockAgents)[0];

export default function AgentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showOrderReport, setShowOrderReport] = useState(false);
  const [showEarningsReport, setShowEarningsReport] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAgents = mockAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAgents.length / itemsPerPage)
  );

  
  const currentAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Ensure currentPage is within valid range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleViewOrderReport = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowOrderReport(true);
    setDropdownOpen(null);
  };

  const handleViewEarningsReport = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowEarningsReport(true);
    setDropdownOpen(null);
  };

  const handleEdit = (agent: Agent) => {
    router.push(`/agents/${agent.id}/edit`);
    setDropdownOpen(null);
  };

  const handleDelete = (agent: Agent) => {
    setAgentToDelete(agent);
    setShowDeleteConfirmation(true);
    setDropdownOpen(null);
  };

  const confirmDelete = () => {
    if (agentToDelete) {
      // Implement delete functionality
      console.log("Deleting agent:", agentToDelete.id);
      setShowDeleteConfirmation(false);
      setAgentToDelete(null);
    }
  };

  return (
    <div className="container p-6 max-w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Agents</h1>
            <p className="text-gray-500">Manage your delivery agents</p>
          </div>
          <Button onClick={() => router.push("/agents/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search agents by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 max-w-md"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">AGENT</TableHead>
                <TableHead>CONTACT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ORDERS</TableHead>
                <TableHead>JOIN DATE</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Badge
                          variant="outline"
                          className="bg-[#9D215D]/10 text-[#9D215D] hover:bg-[#9D215D]/20 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium"
                        >
                          {agent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Badge>
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            agent.status === "Active"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {agent.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{agent.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        agent.status === "Active" ? "default" : "secondary"
                      }
                      className={`${
                        agent.status === "Active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{agent.totalOrders}</TableCell>
                  <TableCell>{agent.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={dropdownOpen === agent.id}
                      onOpenChange={(open) =>
                        setDropdownOpen(open ? agent.id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewOrderReport(agent)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Order Report
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewEarningsReport(agent)}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          View Earnings Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(agent)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(agent)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Order Report Sheet */}
        {selectedAgent && showOrderReport && (
          <Sheet open={showOrderReport} onOpenChange={setShowOrderReport}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-[#9D215D]/10 text-[#9D215D] hover:bg-[#9D215D]/20"
                    >
                      {selectedAgent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Badge>
                    <span>Order Report - {selectedAgent.name}</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Orders
                      </CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedAgent.totalOrders}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Earnings
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${selectedAgent.totalEarnings.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Recent Orders</h3>
                  <div className="space-y-2">
                    {selectedAgent.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-[#9D215D]" />
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-gray-500">
                              {order.date}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">
                          ${order.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Earnings Report Sheet */}
        {selectedAgent && showEarningsReport && (
          <Sheet open={showEarningsReport} onOpenChange={setShowEarningsReport}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-[#9D215D]/10 text-[#9D215D] hover:bg-[#9D215D]/20"
                    >
                      {selectedAgent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Badge>
                    <span>Earnings Report - {selectedAgent.name}</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Earnings
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${selectedAgent.totalEarnings.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Orders
                      </CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedAgent.totalOrders}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Recent Earnings</h3>
                  <div className="space-y-2">
                    {selectedAgent.recentEarnings.map((earning, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-[#9D215D]" />
                          <div className="text-sm text-gray-500">
                            {earning.date}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${earning.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={showDeleteConfirmation}
          onOpenChange={setShowDeleteConfirmation}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                agent
                {agentToDelete && ` "${agentToDelete.name}"`} and remove their
                data from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAgentToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
