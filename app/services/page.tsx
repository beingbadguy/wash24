"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash, Pencil } from "lucide-react";

interface Service {
  id: string;
  number: string;
  category: string;
  price: number;
  estimatedTime: string;
  status: "Active" | "Inactive";
}

const initialServices: Service[] = [
  {
    id: "S001",
    number: "001",
    category: "Laundry",
    price: 200,
    estimatedTime: "2 hours",
    status: "Active",
  },
  {
    id: "S002",
    number: "002",
    category: "Dry Cleaning",
    price: 400,
    estimatedTime: "1.5 hours",
    status: "Inactive",
  },
];

const categories = ["All", "Laundry", "Dry Cleaning", "Ironing"];

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
    <div className="container p-3 space-y-6">
      <div className="flex gap-2 flex-wrap items-center">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className={` ${
              selectedCategory === cat ? "bg-[#9D215D]" : ""
            }  text-sm`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Service ID" />
              <Input placeholder="Number" />
              <Input placeholder="Category" />
              <Input placeholder="Price in ₹" />
              <Input placeholder="Estimated Time" />
              <Input placeholder="Status (Active/Inactive)" />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2"
        />
      </div>

      <div className="bg-white rounded shadow-md overflow-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-12 px-4 py-2 text-center align-middle">
                <Checkbox
                  checked={
                    Object.values(selected).length > 0 &&
                    Object.values(selected).every(Boolean)
                  }
                  onCheckedChange={(value) => {
                    const newState: Record<string, boolean> = {};
                    filteredServices.forEach((s) => {
                      newState[s.id] = !!value;
                    });
                    setSelected(newState);
                  }}
                  className="border-[#9D215D] data-[state=checked]:bg-[#9D215D] data-[state=checked]:text-white"
                />
              </th>
              <th className="px-4 py-2 text-left">Service ID</th>
              <th className="px-4 py-2 text-left">Number</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price (₹)</th>
              <th className="px-4 py-2 text-left">Estimated Time</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td className="w-12 px-4 py-2 text-center align-middle">
                  <Checkbox
                    checked={selected[service.id] || false}
                    onCheckedChange={() => toggleSelect(service.id)}
                    className="border-[#9D215D] data-[state=checked]:bg-[#9D215D] data-[state=checked]:text-white"
                  />
                </td>
                <td className="px-4 py-2">{service.id}</td>
                <td className="px-4 py-2">{service.number}</td>
                <td className="px-4 py-2">{service.category}</td>
                <td className="px-4 py-2">₹{service.price}</td>
                <td className="px-4 py-2">{service.estimatedTime}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4 text-[#9D215D]" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteService(service.id)}
                  >
                    <Trash className="h-4 w-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
