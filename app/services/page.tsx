"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

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
  },
];

// const categories = ["All", "Laundry", "Dry Cleaning", "Ironing"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const filteredServices = services.filter((service) => {
    return (
      (selectedCategory === "All" || service.category === selectedCategory) &&
      (service.id.toLowerCase().includes(search.toLowerCase()) ||
        service.category.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="container p-3 max-w-full overflow-y-scroll max-h-[90vh] pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="text-gray-500">Manage your laundry services</p>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            className={
              selectedCategory === "All"
                ? "bg-[#BE185D] hover:bg-[#9D174D]"
                : ""
            }
            onClick={() => setSelectedCategory("All")}
          >
            All
          </Button>
          <Button
            variant={selectedCategory === "Laundry" ? "default" : "outline"}
            className={
              selectedCategory === "Laundry"
                ? "bg-[#BE185D] hover:bg-[#9D174D]"
                : ""
            }
            onClick={() => setSelectedCategory("Laundry")}
          >
            Laundry
          </Button>
          <Button
            variant={
              selectedCategory === "Dry Cleaning" ? "default" : "outline"
            }
            className={
              selectedCategory === "Dry Cleaning"
                ? "bg-[#BE185D] hover:bg-[#9D174D]"
                : ""
            }
            onClick={() => setSelectedCategory("Dry Cleaning")}
          >
            Dry Cleaning
          </Button>
          <Button
            variant={selectedCategory === "Ironing" ? "default" : "outline"}
            className={
              selectedCategory === "Ironing"
                ? "bg-[#BE185D] hover:bg-[#9D174D]"
                : ""
            }
            onClick={() => setSelectedCategory("Ironing")}
          >
            Ironing
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Service ID</Label>
                  <Input
                    className="col-span-3"
                    placeholder="Enter service ID"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Number</Label>
                  <Input className="col-span-3" placeholder="Enter number" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Category</Label>
                  <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select category</option>
                    <option value="laundry">Laundry</option>
                    <option value="dry-cleaning">Dry Cleaning</option>
                    <option value="ironing">Ironing</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Price (₹)</Label>
                  <Input
                    className="col-span-3"
                    type="number"
                    placeholder="Enter price"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Estimated Time</Label>
                  <Input className="col-span-3" placeholder="e.g. 2 hours" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#BE185D] hover:bg-[#9D174D]">
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative w-full md:w-1/3">
          <Input
            type="text"
            placeholder="Search services..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"
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

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Checkbox
                  checked={Object.values(selected).every(Boolean)}
                  onCheckedChange={(checked) => {
                    const newSelected: Record<string, boolean> = {};
                    services.forEach((service) => {
                      newSelected[service.id] = checked as boolean;
                    });
                    setSelected(newSelected);
                  }}
                />
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service ID
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price (₹)
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimated Time
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td className="px-3 py-4">
                  <Checkbox
                    checked={selected[service.id] || false}
                    onCheckedChange={() => toggleSelect(service.id)}
                  />
                </td>
                <td className="px-3 py-4 text-sm">{service.id}</td>
                <td className="px-3 py-4 text-sm">{service.number}</td>
                <td className="px-3 py-4 text-sm">{service.category}</td>
                <td className="px-3 py-4 text-sm">₹{service.price}</td>
                <td className="px-3 py-4 text-sm">{service.estimatedTime}</td>
                <td className="px-3 py-4 text-sm">
                  <Badge
                    variant={
                      service.status === "Active" ? "default" : "secondary"
                    }
                    className={
                      service.status === "Active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {service.status}
                  </Badge>
                </td>
                <td className="px-3 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Service</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Service ID</Label>
                            <Input
                              className="col-span-3"
                              value={service.id}
                              readOnly
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Number</Label>
                            <Input
                              className="col-span-3"
                              value={service.number}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Category</Label>
                            <select
                              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={service.category}
                            >
                              <option value="Laundry">Laundry</option>
                              <option value="Dry Cleaning">Dry Cleaning</option>
                              <option value="Ironing">Ironing</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Price (₹)</Label>
                            <Input
                              className="col-span-3"
                              type="number"
                              value={service.price}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Estimated Time</Label>
                            <Input
                              className="col-span-3"
                              value={service.estimatedTime}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button className="bg-[#BE185D] hover:bg-[#9D174D]">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteService(service.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
