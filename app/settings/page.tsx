"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { uploadImageToCloudinary } from "@/lib/cloudinaryImageUpload";

interface Subcategory {
  name: string;
  price: string;
}

interface Service {
  category: string;
  icon: LucideIcon;
  subcategories: Subcategory[];
  description?: string;
  id: string;
  showOnHome?: boolean;
  sortOrder?: number;
  imageUrl?: string | null;
  services?: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    imageUrl: string | null;
    isActive: boolean;
    showOnHome: boolean;
    sortOrder: number;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    pricingVariations?: {
      itemType: string;
      customerCategory: "MALE" | "FEMALE";
      price: number;
      description: string;
      isActive: boolean;
    }[];
  }[];
}

interface CategoryResponse {
  name: string;
  description: string;
  id: string;
  showOnHome: boolean;
  sortOrder: number;
  imageUrl: string | null;
  services?: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    imageUrl: string | null;
    isActive: boolean;
    showOnHome: boolean;
    sortOrder: number;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

interface NewCategory {
  name: string;
  description: string;
  showOnHome: boolean;
  imageUrl: string | null;
  sortOrder: number;
}

interface PricingVariation {
  itemType: string;
  customerCategory: "MALE" | "FEMALE";
  price: number;
  description: string;
  isActive: boolean;
}

interface NewSubcategory {
  name: string;
  description: string;
  categoryId: string;
  basePrice: number;
  imageUrl: string | null;
  isActive: boolean;
  showOnHome: boolean;
  pricingVariations: PricingVariation[];
}

export default function SettingsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: "",
    description: "",
    showOnHome: true,
    imageUrl: null,
    sortOrder: 0,
  });
  const [newSubcategory, setNewSubcategory] = useState<NewSubcategory>({
    name: "",
    description: "",
    categoryId: "",
    basePrice: 0,
    imageUrl: null,
    isActive: true,
    showOnHome: false,
    pricingVariations: [],
  });
  const [newPricingVariation, setNewPricingVariation] =
    useState<PricingVariation>({
      itemType: "",
      customerCategory: "MALE",
      price: 0,
      description: "",
      isActive: true,
    });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  console.log(selectedCategory);
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await api.get(
        "https://civilian-mole-parivartanx-812f67f6.koyeb.app/api/v1/admin/categories"
      );
      console.log(response.data);
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
            services: category.services || [],
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

  const handleImageUpload = async (file: File, isSubcategory: boolean = false) => {
    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      console.log('Uploaded image URL:', imageUrl);
      if (isSubcategory) {
        setNewSubcategory((prev) => ({
          ...prev,
          imageUrl,
        }));
      } else {
        setNewCategory((prev) => ({
          ...prev,
          imageUrl,
        }));
      }
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      if (isSubcategory) {
        setNewSubcategory((prev) => ({
          ...prev,
          imageUrl: null,
        }));
      } else {
        setNewCategory((prev) => ({
          ...prev,
          imageUrl: null,
        }));
      }
    } finally {
      setIsUploadingImage(false);
    }
  };
  console.log(selectedCategory);

  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      setIsLoading(true);
      try {
        const response = await api.post(
          `/admin/services/${selectedCategory}`,
          newCategory
        );

        if (response.data.success) {
          toast.success("Category added successfully");
          await fetchCategories();
          setNewCategory({
            
            name: "",
            description: "",
            showOnHome: true,
            imageUrl: null,
            sortOrder: 0,
          });
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

  const handleAddPricingVariation = () => {
    if (newPricingVariation.itemType && newPricingVariation.price > 0) {
      setNewSubcategory((prev) => ({
        ...prev,
        pricingVariations: [
          ...prev.pricingVariations,
          { ...newPricingVariation },
        ],
      }));
      // Reset the new pricing variation form
      setNewPricingVariation({
        itemType: "",
        customerCategory: "MALE",
        price: 0,
        description: "",
        isActive: true,
      });
    } else {
      toast.error(
        "Please fill in all required fields for the pricing variation"
      );
    }
  };

  const handleRemovePricingVariation = (index: number) => {
    setNewSubcategory((prev) => ({
      ...prev,
      pricingVariations: prev.pricingVariations.filter((_, i) => i !== index),
    }));
  };

  const handleAddSubcategory = async () => {
    if (
      selectedCategory &&
      newSubcategory.name.trim() &&
      newSubcategory.pricingVariations.length > 0
    ) {
      setIsLoading(true);
      try {
        const response = await api.post(
          `/admin/services/${selectedCategory}`,
          {
            name: newSubcategory.name,
            description: newSubcategory.description,
            basePrice: newSubcategory.basePrice,
            imageUrl: newSubcategory.imageUrl,
            isActive: newSubcategory.isActive,
            showOnHome: newSubcategory.showOnHome,
            pricingVariations: newSubcategory.pricingVariations,
          }
        );

        if (response.data.success) {
          toast.success("Service added successfully");
          await fetchCategories();
          setNewSubcategory({
            name: "",
            description: "",
            categoryId: "",
            basePrice: 0,
            imageUrl: null,
            isActive: true,
            showOnHome: false,
            pricingVariations: [],
          });
          setIsAddingSubcategory(false);
        }
      } catch (error) {
        console.error("Error adding service:", error);
        toast.error("Failed to add service");
      } finally {
        setIsLoading(false);
      }
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
                {isAddingCategory && (
                  <Card className="my-3">
                    <CardHeader>
                      <CardTitle>Add New Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoryName">Name</Label>
                          <Input
                            id="categoryName"
                            placeholder="Enter category name"
                            value={newCategory.name}
                            onChange={(e) =>
                              setNewCategory((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoryDescription">Description</Label>
                          <Textarea
                            id="categoryDescription"
                            placeholder="Enter category description"
                            value={newCategory.description}
                            onChange={(e) =>
                              setNewCategory((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoryImage">Upload Image (Optional)</Label>
                          <div className="flex items-center gap-4">
                            <Input
                              id="categoryImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file);
                                }
                              }}
                              disabled={isUploadingImage}
                            />
                            {isUploadingImage && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {newCategory.imageUrl && (
                              <img
                                src={newCategory.imageUrl}
                                alt="Preview"
                                className="h-10 w-10 object-cover rounded"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newCategory.showOnHome}
                            onChange={(e) =>
                              setNewCategory((prev) => ({
                                ...prev,
                                showOnHome: e.target.checked,
                              }))
                            }
                            id="showOnHome"
                          />
                          <Label htmlFor="showOnHome">Show on home</Label>
                        </div>
                        <div className="flex justify-end gap-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddingCategory(false);
                              setNewCategory({
                                name: "",
                                description: "",
                                showOnHome: true,
                                imageUrl: null,
                                sortOrder: 0,
                              });
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddCategory}
                            disabled={
                              isLoading ||
                              !newCategory.name.trim() ||
                              !newCategory.description.trim()
                            }
                            className="bg-[#9D215D] hover:bg-[#CD3883]"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {isLoadingCategories ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="space-y-6 ">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="border rounded-lg overflow-hidden bg-white shadow-sm"
                      >
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 border-b">
                          <div className="flex items-center gap-3">
                            {service.imageUrl ? (
                              <img
                                src={service.imageUrl}
                                alt={service.category}
                                className="h-10 w-10 object-cover rounded-md shadow-sm"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-[#9D215D]/10 flex items-center justify-center">
                                <Shirt className="h-5 w-5 text-[#9D215D]" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {service.category}
                              </h3>
                              {service.description && (
                                <p className="text-sm text-gray-500">
                                  {service.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCategory(service.id);
                                setIsAddingSubcategory(true);
                              }}
                              className="cursor-pointer hover:bg-[#9D215D]/10 hover:text-[#9D215D]"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Service
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteCategory(service.category)
                              }
                              className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="divide-y">
                          {isAddingSubcategory &&
                            selectedCategory === service.id && (
                              <div className="p-4 bg-gray-50/50 border-b">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Subcategory Name</Label>
                                      <Input
                                        value={newSubcategory.name}
                                        onChange={(e) =>
                                          setNewSubcategory((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                          }))
                                        }
                                        placeholder="Enter subcategory name"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Base Price</Label>
                                      <Input
                                        type="number"
                                        value={newSubcategory.basePrice}
                                        onChange={(e) =>
                                          setNewSubcategory((prev) => ({
                                            ...prev,
                                            basePrice: Number(e.target.value),
                                          }))
                                        }
                                        placeholder="Enter base price"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      value={newSubcategory.description}
                                      onChange={(e) =>
                                        setNewSubcategory((prev) => ({
                                          ...prev,
                                          description: e.target.value,
                                        }))
                                      }
                                      placeholder="Enter description"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Upload Image (Optional)</Label>
                                    <div className="flex items-center gap-4">
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            handleImageUpload(file, true);
                                          }
                                        }}
                                        disabled={isUploadingImage}
                                      />
                                      {isUploadingImage && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      )}
                                      {newSubcategory.imageUrl && (
                                        <img
                                          src={newSubcategory.imageUrl}
                                          alt="Preview"
                                          className="h-10 w-10 object-cover rounded"
                                        />
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <Label>Pricing Variations</Label>
                                    </div>

                                    <div className="p-4 border rounded-lg space-y-4">
                                      <h4 className="font-medium">
                                        New Pricing Variation
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Item Type</Label>
                                          <Input
                                            value={newPricingVariation.itemType}
                                            onChange={(e) =>
                                              setNewPricingVariation(
                                                (prev) => ({
                                                  ...prev,
                                                  itemType: e.target.value,
                                                })
                                              )
                                            }
                                            placeholder="Enter item type"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Customer Category</Label>
                                          <select
                                            value={
                                              newPricingVariation.customerCategory
                                            }
                                            onChange={(e) =>
                                              setNewPricingVariation(
                                                (prev) => ({
                                                  ...prev,
                                                  customerCategory: e.target
                                                    .value as "MALE" | "FEMALE",
                                                })
                                              )
                                            }
                                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                                          >
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">
                                              Female
                                            </option>
                                          </select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Price</Label>
                                          <Input
                                            type="number"
                                            min="0"
                                            value={
                                              newPricingVariation.price || ""
                                            }
                                            onChange={(e) =>
                                              setNewPricingVariation(
                                                (prev) => ({
                                                  ...prev,
                                                  price:
                                                    Number(e.target.value) || 0,
                                                })
                                              )
                                            }
                                            placeholder="Enter price"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Description</Label>
                                          <Input
                                            value={
                                              newPricingVariation.description
                                            }
                                            onChange={(e) =>
                                              setNewPricingVariation(
                                                (prev) => ({
                                                  ...prev,
                                                  description: e.target.value,
                                                })
                                              )
                                            }
                                            placeholder="Enter description"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex justify-end">
                                        <Button
                                          type="button"
                                          onClick={handleAddPricingVariation}
                                          className="bg-[#9D215D] hover:bg-[#CD3883]"
                                        >
                                          Add This Variation
                                        </Button>
                                      </div>
                                    </div>

                                    {newSubcategory.pricingVariations.map(
                                      (variation, index) => (
                                        <div
                                          key={index}
                                          className="p-4 border rounded-lg space-y-4"
                                        >
                                          <div className="flex justify-between items-center">
                                            <h4 className="font-medium">
                                              Variation {index + 1}
                                            </h4>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                handleRemovePricingVariation(
                                                  index
                                                )
                                              }
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label>Item Type</Label>
                                              <Input
                                                value={variation.itemType}
                                                disabled
                                                className="bg-gray-50"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Customer Category</Label>
                                              <Input
                                                value={
                                                  variation.customerCategory
                                                }
                                                disabled
                                                className="bg-gray-50"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Price</Label>
                                              <Input
                                                type="number"
                                                value={variation.price}
                                                disabled
                                                className="bg-gray-50"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Description</Label>
                                              <Input
                                                value={variation.description}
                                                disabled
                                                className="bg-gray-50"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>

                                  <div className="flex justify-end gap-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setIsAddingSubcategory(false);
                                        setNewSubcategory({
                                          name: "",
                                          description: "",
                                          categoryId: "",
                                          basePrice: 0,
                                          imageUrl: null,
                                          isActive: true,
                                          showOnHome: false,
                                          pricingVariations: [],
                                        });
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleAddSubcategory}
                                      disabled={
                                        isLoading ||
                                        !newSubcategory.name.trim() ||
                                        newSubcategory.pricingVariations
                                          .length === 0
                                      }
                                      className="bg-[#9D215D] hover:bg-[#CD3883]"
                                    >
                                      {isLoading ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Adding...
                                        </>
                                      ) : (
                                        "Add Subcategory"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          <ul>
                            {service.services?.map((subService) => (
                              <li
                                key={subService.id}
                                className="py-4 px-10 hover:bg-gray-50/50 transition-colors list-disc"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {subService.imageUrl ? (
                                      <img
                                        src={subService.imageUrl}
                                        alt={subService.name}
                                        className="h-10 w-10 object-cover rounded-md shadow-sm"
                                      />
                                    ) : (
                                      <div className="h-10 w-10 rounded-md bg-[#9D215D]/10 flex items-center justify-center">
                                        <Shirt className="h-5 w-5 text-[#9D215D]" />
                                      </div>
                                    )}
                                    <div>
                                      <h4 className="font-medium text-gray-800">
                                        {subService.name}
                                      </h4>
                                      <p className="text-sm text-gray-500">
                                        {subService.description}
                                      </p>
                                      {subService.pricingVariations && subService.pricingVariations.length > 0 && (
                                        <div className="mt-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                              <Shirt className="h-4 w-4 text-[#9D215D]" />
                                              Pricing Variations
                                            </h5>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                              {subService.pricingVariations.length} variations
                                            </span>
                                          </div>
                                          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                            <table className="w-full text-sm">
                                              <thead className="bg-gray-50/80 backdrop-blur-sm">
                                                <tr>
                                                  <th className="px-4 py-3 text-left font-medium text-gray-700">Item Type</th>
                                                  <th className="px-4 py-3 text-left font-medium text-gray-700">Category</th>
                                                  <th className="px-4 py-3 text-left font-medium text-gray-700">Price</th>
                                                  <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-gray-100">
                                                {subService.pricingVariations.map((variation, idx) => (
                                                  <tr 
                                                    key={idx} 
                                                    className="group hover:bg-gray-50/50 transition-colors duration-150"
                                                  >
                                                    <td className="px-4 py-3">
                                                      <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-[#9D215D]" />
                                                        <span className="text-gray-700">{variation.itemType}</span>
                                                      </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        variation.customerCategory === 'MALE' 
                                                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                                                          : 'bg-pink-50 text-pink-700 ring-1 ring-pink-200'
                                                      }`}>
                                                        {variation.customerCategory}
                                                      </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                      <div className="flex items-center gap-1">
                                                        <span className="font-medium text-[#9D215D]">₹{variation.price}</span>
                                                        <span className="text-xs text-gray-400">/item</span>
                                                      </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                      <div className="flex items-center gap-2">
                                                        <span className="text-gray-600">{variation.description}</span>
                                                        {variation.isActive ? (
                                                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                        ) : (
                                                          <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                                                        )}
                                                      </div>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <p className="text-sm text-gray-500">
                                        Base Price
                                      </p>
                                      <p className="font-medium text-[#9D215D]">
                                        ₹{subService.basePrice}
                                      </p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteSubcategory(
                                          service.category,
                                          subService.name
                                        )
                                      }
                                      className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
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
