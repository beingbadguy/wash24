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
  SheetDescription,
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
import { Card, CardContent } from "@/components/ui/card";
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
  MoreVertical,
  Package,
  CheckCircle2,
  XCircle,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

interface Service {
  id: number;
  name: string;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  date: string;
  status: "Pending" | "Completed" | "Rejected";
  services: Service[];
  total: number;
}

interface Agent {
  id: string;
  name: string;
  currentOrders: number;
  status: "Active" | "Inactive";
  rating: number;
}

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    phone: "+1 234 567 890",
    address: "123 Main St, City",
    date: "2024-03-20",
    status: "Pending",
    services: [
      { id: 1, name: "Wash & Fold", price: 25.0 },
      { id: 2, name: "Dry Cleaning", price: 35.0 },
      { id: 3, name: "Ironing", price: 15.0 },
    ],
    total: 75.0,
  },
  // Add more mock orders as needed
];

// Mock data for delivery agents
const mockAgents: Agent[] = [
  {
    id: "AG-001",
    name: "Mike Wilson",
    currentOrders: 2,
    status: "Active",
    rating: 4.8,
  },
  {
    id: "AG-002",
    name: "Sarah Johnson",
    currentOrders: 1,
    status: "Active",
    rating: 4.9,
  },
  // Add more mock agents as needed
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showAssignAgent, setShowAssignAgent] = useState(false);
  const [showActionConfirmation, setShowActionConfirmation] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(
    null
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOrderAction = (order: Order, action: "accept" | "reject") => {
    setSelectedOrder(order);
    setActionType(action);
    setShowActionConfirmation(true);
    setOpenDropdownId(null);
  };

  const handleConfirmAction = () => {
    if (selectedOrder && actionType) {
      console.log(`Order ${selectedOrder.id} ${actionType}ed`);
      setShowActionConfirmation(false);
      setActionType(null);
      setSelectedOrder(null);
    }
  };

  const handleAssignAgent = (order: Order) => {
    setSelectedOrder(order);
    setShowAssignAgent(true);
    setOpenDropdownId(null);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
    setOpenDropdownId(null);
  };

  const confirmAssignAgent = (agentId: string) => {
    console.log(`Assigning agent ${agentId} to order ${selectedOrder?.id}`);
    setShowAssignAgent(false);
    setSelectedOrder(null);
  };

  const handleCloseDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const handleCloseAssign = () => {
    setShowAssignAgent(false);
    setSelectedOrder(null);
  };

  const handleCloseConfirmation = () => {
    setShowActionConfirmation(false);
    setActionType(null);
    setSelectedOrder(null);
  };

  return (
    <div className="container p-6 max-w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-gray-500">Manage customer orders</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ORDER ID</TableHead>
                <TableHead>CUSTOMER</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>SERVICES</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {order.services.slice(0, 2).map((service) => (
                        <Badge key={service.id} variant="secondary">
                          {service.name}
                        </Badge>
                      ))}
                      {order.services.length > 2 && (
                        <Badge variant="outline">
                          +{order.services.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={openDropdownId === order.id}
                      onOpenChange={(open) => {
                        setOpenDropdownId(open ? order.id : null);
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(order)}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAssignAgent(order)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOrderAction(order, "accept")}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Accept
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOrderAction(order, "reject")}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
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

        {/* Order Details Sheet */}
        <Sheet open={showOrderDetails} onOpenChange={handleCloseDetails}>
          <SheetContent className="sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Order Details - {selectedOrder?.id}</SheetTitle>
              <SheetDescription>
                View complete order information and services
              </SheetDescription>
            </SheetHeader>
            {selectedOrder && (
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Customer</div>
                    <div className="font-medium">
                      {selectedOrder.customerName}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium">{selectedOrder.phone}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">{selectedOrder.date}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge
                      variant="outline"
                      className={
                        selectedOrder.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : selectedOrder.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">
                    Services
                  </div>
                  <div className="divide-y divide-gray-100 rounded-md border">
                    {selectedOrder.services.map((service: Service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between py-3 px-4"
                      >
                        <div className="text-sm">{service.name}</div>
                        <div className="text-sm font-medium">
                          ${service.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm font-medium text-gray-500">
                    Total Amount
                  </div>
                  <div className="text-base font-semibold">
                    ${selectedOrder.total.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Assign Agent Sheet */}
        <Sheet open={showAssignAgent} onOpenChange={handleCloseAssign}>
          <SheetContent className="sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Assign Delivery Agent</SheetTitle>
              <SheetDescription>
                Select a delivery agent for order {selectedOrder?.id}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              {mockAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-gray-500">
                        {agent.currentOrders} current orders
                      </div>
                    </div>
                    <Button onClick={() => confirmAssignAgent(agent.id)}>
                      Assign
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Action Confirmation Dialog */}
        <AlertDialog
          open={showActionConfirmation}
          onOpenChange={handleCloseConfirmation}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === "accept" ? "Accept Order" : "Reject Order"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {actionType} order {selectedOrder?.id}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseConfirmation}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmAction}
                className={
                  actionType === "accept" ? "bg-green-600" : "bg-red-600"
                }
              >
                {actionType === "accept" ? "Accept" : "Reject"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
