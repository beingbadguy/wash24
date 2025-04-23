"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Loader2,
  MoreVertical,
  FileText,
  DollarSign,
  Edit,
  Trash,
  Eye,
  Phone,
  Mail,
  MapPin,
  Car,
  CreditCard,
} from "lucide-react";
import { useAgentsStore } from "@/store/agents";
import api from "@/lib/axios";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { AxiosError } from "axios";

interface Agent {
  id: string;
  fullName: string;
  phone: string;
  status: string;
  orderCount: number;
  createdAt: string;
}

interface AgentDetails {
  id: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    emergencyContact: string;
  };
  addressInfo: {
    address: string;
    city: string;
    pinCode: string;
  };
  vehicleInfo: {
    vehicleNumber: string;
    vehicleType: string;
  };
  bankInfo: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  documents: Array<{
    id: string;
    documentType: string;
    documentUrl: string;
  }>;
  status: string;
}

export default function AgentsPage() {
  const router = useRouter();
  const { agents, isLoading, error, fetchAgents } = useAgentsStore();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showOrderReport, setShowOrderReport] = useState(false);
  const [showEarningsReport, setShowEarningsReport] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAgentDetails, setSelectedAgentDetails] =
    useState<AgentDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

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

  const handleViewDetails = async (agent: Agent) => {
    setShowDetails(true);
    setIsLoadingDetails(true);
    setDropdownOpen(null);

    try {
      const response = await api.get<{ data: AgentDetails }>(
        `/admin/delivery-agent/${agent.id}`
      );
      setSelectedAgentDetails(response.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          `Failed to fetch agent details: ${
            error.response?.data?.message || error.message
          }`
        );
      } else {
        toast.error("Failed to fetch agent details");
      }
      console.error("Error fetching agent details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const confirmDelete = async () => {
    if (agentToDelete) {
      try {
        await api.delete(`/admin/delivery-agent/${agentToDelete.id}`);
        toast.success("Agent deleted successfully");
        fetchAgents(); // Refresh the list
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            `Failed to delete agent: ${
              error.response?.data?.message || error.message
            }`
          );
        } else {
          toast.error("Failed to delete agent");
        }
        console.error("Error deleting agent:", error);
      }
      setShowDeleteConfirmation(false);
      setAgentToDelete(null);
    }
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container p-6 mx-auto max-h-[90vh] overflow-y-scroll w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <p className="text-gray-500">Manage your delivery agents</p>
        </div>
        <Button
          onClick={() => router.push("/agents/add")}
          className="bg-black hover:bg-black/90 cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search agents by name or phone..."
              className="pl-10 max-w-full border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Badge
                            variant="outline"
                            className="bg-[#9D215D]/10 text-[#9D215D] hover:bg-[#9D215D]/20 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium"
                          >
                            {agent.fullName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </Badge>
                          <div
                            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                              agent.status === "ACTIVE"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{agent.fullName}</div>
                          <div className="text-sm text-gray-500">
                            ID: {agent.id.split("-")[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{agent.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          agent.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {agent.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{agent.orderCount}</td>
                    <td className="py-3 px-4">
                      {new Date(agent.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right cursor-pointer">
                      <DropdownMenu
                        open={dropdownOpen === agent.id}
                        onOpenChange={(open) =>
                          setDropdownOpen(open ? agent.id : null)
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(agent)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Agent Details
                          </DropdownMenuItem>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                    {selectedAgent.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </Badge>
                  <span>Order Report - {selectedAgent.fullName}</span>
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
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedAgent.orderCount}
                    </div>
                  </CardContent>
                </Card>
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
                    {selectedAgent.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </Badge>
                  <span>Earnings Report - {selectedAgent.fullName}</span>
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
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedAgent.orderCount}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Agent Details Sheet */}
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Agent Details</SheetTitle>
          </SheetHeader>

          {isLoadingDetails ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : selectedAgentDetails ? (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-[#9D215D]/10 text-[#9D215D] hover:bg-[#9D215D]/20 h-16 w-16 rounded-full flex items-center justify-center text-xl font-medium"
                    >
                      {selectedAgentDetails.personalInfo.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Badge>
                    <div>
                      <div className="font-medium text-lg">
                        {selectedAgentDetails.personalInfo.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {selectedAgentDetails.id.split("-")[0]}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      {selectedAgentDetails.personalInfo.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      {selectedAgentDetails.personalInfo.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      Emergency:{" "}
                      {selectedAgentDetails.personalInfo.emergencyContact}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Address Information
                </h3>
                <div className="grid gap-2">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-1" />
                    <div>
                      <div>{selectedAgentDetails.addressInfo.address}</div>
                      <div>
                        {selectedAgentDetails.addressInfo.city},{" "}
                        {selectedAgentDetails.addressInfo.pinCode}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Vehicle Information
                </h3>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="h-4 w-4" />
                    {selectedAgentDetails.vehicleInfo.vehicleType}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="h-4 w-4" />
                    Vehicle Number:{" "}
                    {selectedAgentDetails.vehicleInfo.vehicleNumber}
                  </div>
                </div>
              </div>

              {/* Bank Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Bank Information
                </h3>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    {selectedAgentDetails.bankInfo.bankName}
                  </div>
                  <div className="text-gray-600 pl-6">
                    <div>
                      Account Holder:{" "}
                      {selectedAgentDetails.bankInfo.accountHolderName}
                    </div>
                    <div>
                      Account Number:{" "}
                      {selectedAgentDetails.bankInfo.accountNumber}
                    </div>
                    <div>
                      IFSC Code: {selectedAgentDetails.bankInfo.ifscCode}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Documents
                </h3>
                <div className="grid gap-4">
                  {selectedAgentDetails.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <span>{doc.documentType}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.documentUrl, "_blank")}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No agent details available
            </div>
          )}
        </SheetContent>
      </Sheet>

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
              {agentToDelete && ` "${agentToDelete.fullName}"`} and remove their
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
  );
}
