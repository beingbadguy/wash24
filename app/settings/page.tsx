"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  IndianRupee,
  Shirt,
  ChevronRight,
  Plus,
  X,
  AlertTriangle,
  Loader2,
  LucideIcon,
} from "lucide-react";
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
import { toast } from "sonner";
import api from "@/lib/axios";

interface Subcategory {
  name: string;
  price: string;
}

interface Service {
  category: string;
  icon: LucideIcon;
  subcategories: Subcategory[];
  description?: string;
  id?: string;
  showOnHome?: boolean;
  sortOrder?: number;
  imageUrl?: string | null;
}

interface CategoryResponse {
  name: string;
  description: string;
  id: string;
  showOnHome: boolean;
  sortOrder: number;
  imageUrl: string | null;
}

export default function SettingsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState<Subcategory>({
    name: "",
    price: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: "category" | "subcategory";
    category?: string;
    subcategory?: string;
  }>({
    isOpen: false,
    type: "category",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await api.get(
        "https://civilian-mole-parivartanx-812f67f6.koyeb.app/api/v1/admin/categories"
      );
      if (response.data.success) {
        const transformedServices: Service[] = response.data.data.map(
          (category: CategoryResponse) => ({
            category: category.name,
            icon: Shirt as LucideIcon,
            subcategories: [],
            description: category.description,
            id: category.id,
            showOnHome: category.showOnHome,
            sortOrder: category.sortOrder,
            imageUrl: category.imageUrl,
          })
        );
        setServices(transformedServices);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      setIsLoading(true);
      try {
        const response = await api.post(
          "https://civilian-mole-parivartanx-812f67f6.koyeb.app/api/v1/admin/categories",
          {
            name: newCategory,
            description: `This is description of ${newCategory} service`,
            imageUrl: null,
            showOnHome: true,
            sortOrder: 0,
          }
        );

        if (response.data.success) {
          toast.success("Category added successfully");
          await fetchCategories();
          setNewCategory("");
          setIsAddingCategory(false);
        }
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error("Failed to add category");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddSubcategory = () => {
    if (
      selectedCategory &&
      newSubcategory.name.trim() &&
      newSubcategory.price.trim()
    ) {
      setServices(
        services.map((service) =>
          service.category === selectedCategory
            ? {
                ...service,
                subcategories: [
                  ...service.subcategories,
                  {
                    name: newSubcategory.name,
                    price: newSubcategory.price,
                  },
                ],
              }
            : service
        )
      );
      setNewSubcategory({ name: "", price: "" });
      setIsAddingSubcategory(false);
    }
  };

  const handleDeleteCategory = (category: string) => {
    setDeleteDialog({
      isOpen: true,
      type: "category",
      category,
    });
  };

  const handleDeleteSubcategory = (
    category: string,
    subcategoryName: string
  ) => {
    setDeleteDialog({
      isOpen: true,
      type: "subcategory",
      category,
      subcategory: subcategoryName,
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.type === "category" && deleteDialog.category) {
      setServices(
        services.filter((service) => service.category !== deleteDialog.category)
      );
    } else if (
      deleteDialog.type === "subcategory" &&
      deleteDialog.category &&
      deleteDialog.subcategory
    ) {
      setServices(
        services.map((service) =>
          service.category === deleteDialog.category
            ? {
                ...service,
                subcategories: service.subcategories.filter(
                  (sub) => sub.name !== deleteDialog.subcategory
                ),
              }
            : service
        )
      );
    }
    setDeleteDialog({ isOpen: false, type: "category" });
  };

  return (
    <div className="container p-6 max-w-7xl mx-auto max-h-[90vh] overflow-y-scroll">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#9D215D] to-[#CD3883] text-transparent bg-clip-text">
            Settings
          </h1>
          <p className="text-gray-500">Business Information</p>
        </div>

        <Tabs defaultValue="business" className="space-y-4">
          <TabsList className="bg-white border p-1 shadow-sm rounded-xl">
            <TabsTrigger
              value="business"
              className="gap-2 rounded-lg data-[state=active]:bg-[#9D215D] data-[state=active]:text-white transition-all cursor-pointer"
            >
              <Building2 className="h-4 w-4" />
              Business Info
            </TabsTrigger>
            <TabsTrigger
              value="hours"
              className="gap-2 rounded-lg data-[state=active]:bg-[#9D215D] data-[state=active]:text-white transition-all cursor-pointer"
            >
              <Clock className="h-4 w-4" />
              Working Hours
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="gap-2 rounded-lg data-[state=active]:bg-[#9D215D] data-[state=active]:text-white transition-all cursor-pointer"
            >
              <Shirt className="h-4 w-4" />
              Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="business">
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-[#9D215D]">
                  <Building2 className="h-5 w-5" />
                  Business Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Business Logo</p>
                      <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg border w-fit">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src="/logo.jpeg"
                            alt="Wash24 Logo"
                            className="object-contain"
                          />
                          <AvatarFallback>W24</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Business Name</p>
                      <p className="text-base font-medium">Wash24</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Email Address</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <p className="text-base">arjun@email.com</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <p className="text-base">+91 9876543210</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Business Address</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <p className="text-base">Paliganj, Patna, Bihar</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Currency</p>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-gray-500" />
                        <p className="text-base">Indian Rupee (₹)</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Time Zone</p>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <p className="text-base">IST (GMT +5:30)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours">
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-[#9D215D]">
                  <Clock className="h-5 w-5" />
                  Working Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-gray-50/50 rounded-lg transition-colors px-4"
                    >
                      <span className="font-medium text-gray-700">{day}</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-base">9:00 AM - 9:00 PM</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2 text-[#9D215D]">
                    <Shirt className="h-5 w-5" />
                    Services & Pricing
                  </CardTitle>
                  <Button
                    onClick={() => setIsAddingCategory(true)}
                    className="bg-[#9D215D] hover:bg-[#CD3883] cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingCategories ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <>
                    {isAddingCategory && (
                      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <div className="flex gap-4">
                          <Input
                            placeholder="Category Name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-1 cursor-text"
                            disabled={isLoading}
                          />
                          <Button
                            onClick={handleAddCategory}
                            className="bg-[#9D215D] hover:bg-[#CD3883] cursor-pointer"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              "Add"
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddingCategory(false)}
                            className="cursor-pointer"
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      {services.map((service) => (
                        <div
                          key={service.category}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                            <div className="flex items-center gap-3">
                              {React.createElement(service.icon, {
                                className: "h-5 w-5 text-[#9D215D]",
                              })}
                              <h3 className="font-semibold text-gray-800">
                                {service.category}
                              </h3>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCategory(service.category);
                                  setIsAddingSubcategory(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Subcategory
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteCategory(service.category)
                                }
                                className="cursor-pointer"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="divide-y">
                            {isAddingSubcategory &&
                              selectedCategory === service.category && (
                                <div className="p-4 bg-gray-50">
                                  <div className="flex gap-4">
                                    <Input
                                      placeholder="Subcategory Name"
                                      value={newSubcategory.name}
                                      onChange={(e) =>
                                        setNewSubcategory({
                                          ...newSubcategory,
                                          name: e.target.value,
                                        })
                                      }
                                      className="flex-1 cursor-text"
                                    />
                                    <Input
                                      placeholder="Price"
                                      value={newSubcategory.price}
                                      onChange={(e) =>
                                        setNewSubcategory({
                                          ...newSubcategory,
                                          price: e.target.value,
                                        })
                                      }
                                      className="w-32 cursor-text"
                                    />
                                    <Button
                                      onClick={handleAddSubcategory}
                                      className="bg-[#9D215D] hover:bg-[#CD3883] cursor-pointer"
                                    >
                                      Add
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setIsAddingSubcategory(false);
                                        setNewSubcategory({
                                          name: "",
                                          price: "",
                                        });
                                      }}
                                      className="cursor-pointer"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                            {service.subcategories.map((subcategory) => (
                              <div
                                key={subcategory.name}
                                className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-700">
                                    {subcategory.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[#9D215D] font-medium">
                                    {subcategory.price}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteSubcategory(
                                        service.category,
                                        subcategory.name
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    <X className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AlertDialog
          open={deleteDialog.isOpen}
          onOpenChange={() =>
            setDeleteDialog({ isOpen: false, type: "category" })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                {deleteDialog.type === "category"
                  ? `Are you sure you want to delete the "${deleteDialog.category}" category? This will also delete all its subcategories.`
                  : `Are you sure you want to delete the "${deleteDialog.subcategory}" subcategory from "${deleteDialog.category}"?`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
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
