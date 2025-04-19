"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  lastUpdated: string;
  description: string;
}

export default function SupportPage() {
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    priority: "medium",
    description: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [tickets] = useState<Ticket[]>([
    {
      id: "1",
      ticketNumber: "TKT-001",
      subject: "Order delivery issue",
      status: "open",
      priority: "high",
      createdAt: "2024-03-20",
      lastUpdated: "2024-03-20",
      description:
        "Order #12345 was not delivered on time. Need urgent assistance.",
    },
    {
      id: "2",
      ticketNumber: "TKT-002",
      subject: "Payment refund request",
      status: "in-progress",
      priority: "medium",
      createdAt: "2024-03-19",
      lastUpdated: "2024-03-20",
      description: "Requesting refund for cancelled order #12346",
    },
    {
      id: "3",
      ticketNumber: "TKT-003",
      subject: "Service quality concern",
      status: "resolved",
      priority: "low",
      createdAt: "2024-03-18",
      lastUpdated: "2024-03-19",
      description: "Clothes were not properly cleaned in order #12347",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle ticket creation
    console.log("Ticket created:", formData);
    setShowCreateTicket(false);
    setFormData({ subject: "", priority: "medium", description: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownAction = (ticket: Ticket, action: string) => {
    switch (action) {
      case "view":
        setSelectedTicket(ticket);
        setDropdownOpen((prev) => ({ ...prev, [ticket.id]: false }));
        break;
      case "update":
        // Handle update status
        setDropdownOpen((prev) => ({ ...prev, [ticket.id]: false }));
        break;
      case "close":
        // Handle close ticket
        setDropdownOpen((prev) => ({ ...prev, [ticket.id]: false }));
        break;
    }
  };

  const getStatusVariant = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case "in-progress":
        return <Clock className="h-3 w-3 mr-1" />;
      case "resolved":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "closed":
        return <XCircle className="h-3 w-3 mr-1" />;
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / itemsPerPage)
  );

  // Ensure currentPage is within valid range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container p-3 max-w-full overflow-y-scroll max-h-[90vh] pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-500">
            Manage and track your support requests
          </p>
        </div>
        <Button onClick={() => setShowCreateTicket(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      <div className="relative w-full md:w-1/3 mb-6">
        <Input
          type="text"
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket Number</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">
                  {ticket.ticketNumber}
                </TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusVariant(
                      ticket.status
                    )}`}
                  >
                    {getStatusIcon(ticket.status)}
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.createdAt}</TableCell>
                <TableCell>{ticket.lastUpdated}</TableCell>
                <TableCell>
                  <DropdownMenu
                    open={dropdownOpen[ticket.id]}
                    onOpenChange={(open) =>
                      setDropdownOpen({ ...dropdownOpen, [ticket.id]: open })
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDropdownAction(ticket, "view")}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDropdownAction(ticket, "update")}
                      >
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDropdownAction(ticket, "close")}
                      >
                        Close Ticket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateTicket} onOpenChange={setShowCreateTicket}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateTicket(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ticket Details Sheet */}
      {selectedTicket && (
        <Sheet
          open={!!selectedTicket}
          onOpenChange={() => setSelectedTicket(null)}
        >
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Ticket Details</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">Ticket Information</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Ticket Number</p>
                    <p className="font-medium">{selectedTicket.ticketNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusVariant(
                        selectedTicket.status
                      )}`}
                    >
                      {getStatusIcon(selectedTicket.status)}
                      {selectedTicket.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <p className="font-medium">{selectedTicket.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{selectedTicket.createdAt}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="mt-2 text-gray-600">
                  {selectedTicket.description}
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
