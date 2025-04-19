"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

interface Service {
  id: string;
  number: string;
  category: string;
  price: number;
  estimatedTime: string;
  status: "Active" | "Inactive";
  name: string;
  duration: string;
  description: string;
  image: string | null;
  orders: number;
}

const initialServices: Service[] = [
  {
    id: "S001",
    number: "001",
    category: "Laundry",
    price: 200,
    estimatedTime: "2 hours",
    status: "Active",
    name: "Wash & Fold",
    duration: "24 hours",
    description:
      "Professional washing and folding service for all types of clothes",
    image: "/services/wash-fold.jpg",
    orders: 5,
  },
  {
    id: "S002",
    number: "002",
    category: "Dry Cleaning",
    price: 400,
    estimatedTime: "1.5 hours",
    status: "Inactive",
    name: "Dry Clean",
    duration: "48 hours",
    description:
      "Expert dry cleaning service for delicate and special care garments",
    image: "/services/dry-clean.jpg",
    orders: 3,
  },
  {
    id: "S003",
    number: "003",
    category: "Ironing",
    price: 100,
    estimatedTime: "12 hours",
    status: "Active",
    name: "Iron Only",
    duration: "12 hours",
    description:
      "Professional ironing service to keep your clothes wrinkle-free",
    image: null,
    orders: 2,
  },
];

const categories = ["Laundry", "Dry Cleaning", "Ironing"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Service>>({});
  const itemsPerPage = 5;

  const totalPages = Math.ceil(services.length / itemsPerPage);

  const currentServices = services
    .filter(
      (service) =>
        (selectedCategory === "All" || service.category === selectedCategory) &&
        (service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteService(selectedService!.id);
    setShowDeleteDialog(false);
    setSelectedService(null);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setEditFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      status: service.status,
    });
    setShowEditDialog(true);
  };

  const handleEditSubmit = () => {
    if (selectedService) {
      setServices(
        services.map((service) =>
          service.id === selectedService.id
            ? { ...service, ...editFormData }
            : service
        )
      );
      setShowEditDialog(false);
      setSelectedService(null);
      setEditFormData({});
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.category && newService.price) {
      const service: Service = {
        id: `S${(services.length + 1).toString().padStart(3, "0")}`,
        number: (services.length + 1).toString().padStart(3, "0"),
        name: newService.name,
        category: newService.category,
        price: newService.price,
        estimatedTime: newService.estimatedTime || "2 hours",
        duration: newService.estimatedTime || "2 hours",
        status: newService.status as "Active" | "Inactive",
        description: newService.description || "",
        image: null,
        orders: 0,
      };
      setServices([...services, service]);
      setShowAddDialog(false);
      setNewService({
        name: "",
        category: "Laundry",
        price: 0,
        estimatedTime: "",
        status: "Active",
        description: "",
      });
    }
  };

  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    category: "Laundry",
    price: 0,
    estimatedTime: "",
    status: "Active",
    description: "",
  });

  return (
    <div className="container p-6 max-w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="text-gray-500">Manage your laundry services</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            onClick={() => setSelectedCategory("All")}
            className={`rounded-full ${
              selectedCategory === "All"
                ? "bg-rose-600 hover:bg-rose-700"
                : "hover:bg-rose-50 hover:text-rose-600"
            }`}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full ${
                selectedCategory === category
                  ? "bg-rose-700 hover:bg-rose-700"
                  : "hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              {category}
            </Button>
          ))}
          <div className="flex-1">
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={handleSearch}
              className="max-w-md"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      currentServices.length > 0 &&
                      currentServices.every((service) =>
                        selectedServices.includes(service.id)
                      )
                    }
                    onCheckedChange={(checked) => {
                      const newSelected = checked
                        ? currentServices.map((service) => service.id)
                        : [];
                      setSelectedServices(newSelected);
                    }}
                  />
                </TableHead>
                <TableHead className="w-[250px]">SERVICE ID</TableHead>
                <TableHead>CATEGORY</TableHead>
                <TableHead>PRICE (₹)</TableHead>
                <TableHead>ESTIMATED TIME</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentServices.map((service) => (
                <TableRow
                  key={service.id}
                  className={
                    selectedServices.includes(service.id) ? "bg-rose-50" : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => {
                        toggleSelect(service.id);
                      }}
                    />
                  </TableCell>
                  <TableCell>{service.id}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>₹{service.price}</TableCell>
                  <TableCell>{service.estimatedTime}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        service.status === "Active" ? "default" : "destructive"
                      }
                      className={`${
                        service.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(service)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(service)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
      </div>

      {/* Add Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Fill in the service details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newService.category}
                onChange={(e) =>
                  setNewService({ ...newService, category: e.target.value })
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={newService.price}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input
                id="estimatedTime"
                placeholder="e.g., 2 hours"
                value={newService.estimatedTime}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    estimatedTime: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newService.description}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newService.status}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Service Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the service details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Service Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editFormData.category || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, category: e.target.value })
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price (₹)</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                value={editFormData.price || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-estimatedTime">Estimated Time</Label>
              <Input
                id="edit-estimatedTime"
                placeholder="e.g., 2 hours"
                value={editFormData.estimatedTime || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    estimatedTime: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editFormData.status || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
