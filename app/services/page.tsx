"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Service, initialServices, categories } from "./types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);

  // Filtering
  const filteredServices = services.filter(
    (service) =>
      (selectedCategory === "All" || service.category === selectedCategory) &&
      (service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handlers
  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      name: "",
      category: categories[0],
      price: 0,
      estimatedTime: "",
      duration: "",
      status: "Active",
      description: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setModalMode("edit");
    setSelectedServiceId(service.id);
    setFormData({ ...service });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedServiceId(null);
    setFormData({});
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.category ||
      formData.price === undefined ||
      !formData.estimatedTime ||
      !formData.status ||
      !formData.description
    ) {
      return;
    }
    if (modalMode === "add") {
      const newService: Service = {
        id: `S${(services.length + 1).toString().padStart(3, "0")}`,
        number: (services.length + 1).toString().padStart(3, "0"),
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        estimatedTime: formData.estimatedTime,
        duration: formData.duration || formData.estimatedTime,
        status: formData.status as "Active" | "Inactive",
        description: formData.description,
        image: null,
        orders: 0,
        priceVariations: [],
      };
      setServices((prev) => [...prev, newService]);
    } else if (modalMode === "edit" && selectedServiceId) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === selectedServiceId
            ? {
                ...s,
                ...formData,
                price: Number(formData.price),
                status: formData.status as "Active" | "Inactive",
              }
            : s
        )
      );
    }
    closeModal();
  };

  const openDeleteDialog = (id: string) => {
    setDeleteServiceId(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (deleteServiceId) {
      setServices((prev) => prev.filter((s) => s.id !== deleteServiceId));
      setShowDeleteDialog(false);
      setDeleteServiceId(null);
    }
  };

  return (
    <div className="container p-6 max-w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="text-gray-500">Manage your laundry services</p>
          </div>
          <Button onClick={openAddModal} className="bg-black text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Service
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>
        {/* Table Layout */}
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-2 text-left">SERVICE ID</th>
                <th className="px-2 py-2 text-left">CATEGORY</th>
                <th className="px-2 py-2 text-left">PRICE (₹)</th>
                <th className="px-2 py-2 text-left">ESTIMATED TIME</th>
                <th className="px-2 py-2 text-left">STATUS</th>
                <th className="px-2 py-2 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-2">{service.id}</td>
                  <td className="px-2 py-2">{service.category}</td>
                  <td className="px-2 py-2">₹{service.price}</td>
                  <td className="px-2 py-2">{service.estimatedTime}</td>
                  <td className="px-2 py-2">
                    <span className={
                      service.status === "Active"
                        ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                        : "bg-rose-100 text-rose-800 px-2 py-1 rounded-full text-xs"
                    }>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 flex gap-2">
                    <button
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => openEditModal(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => openDeleteDialog(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto py-8">
          <DialogHeader>
            <DialogTitle>{modalMode === "add" ? "Add Service" : "Edit Service"}</DialogTitle>
            <DialogDescription>
              {modalMode === "add"
                ? "Fill in the service details below."
                : "Update the service details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.category || categories[0]}
                onChange={handleFormChange}
                required
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
                name="price"
                type="number"
                min="0"
                value={formData.price || ""}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input
                id="estimatedTime"
                name="estimatedTime"
                value={formData.estimatedTime || ""}
                onChange={handleFormChange}
                required
                placeholder="e.g., 2 hours"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration || ""}
                onChange={handleFormChange}
                required
                placeholder="e.g., 24 hours"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.status || "Active"}
                onChange={handleFormChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleFormChange}
                required
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal} type="button">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-rose-600 hover:bg-rose-700 text-white" type="button">
              {modalMode === "add" ? "Add Service" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto py-8">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
