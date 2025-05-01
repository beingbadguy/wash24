"use client";

import { useState, useEffect } from "react";
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
import { Pencil, Plus, Trash2, Shirt, Loader2, X, AlertTriangle, Eye } from "lucide-react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import api from "@/lib/axios";
import { uploadImageToCloudinary } from "@/lib/cloudinaryImageUpload";
import { useRouter } from "next/navigation";

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
    pricingVariations?: {
      itemType: string;
      customerCategory: "MALE" | "FEMALE";
      price: number;
      description: string;
      isActive: boolean;
    }[];
  }[];
}

interface NewCategory {
  name: string;
  description: string;
  showOnHome: boolean;
  imageUrl: string | null;
  sortOrder: number;
}

interface NewSubcategory {
  name: string;
  description: string;
  categoryId: string;
  basePrice: number;
  imageUrl: string | null;
  isActive: boolean;
  showOnHome: boolean;
  pricingVariations: {
    itemType: string;
    customerCategory: "MALE" | "FEMALE";
    price: number;
    description: string;
    isActive: boolean;
  }[];
}

interface PricingVariation {
  itemType: string;
  customerCategory: "MALE" | "FEMALE";
  price: number;
  description: string;
  isActive: boolean;
}

// Add this type alias for clarity
// Type for a single service/subcategory
// (This matches the type of objects in CategoryResponse['services'])
type SubService = NonNullable<CategoryResponse['services']>[number];

export default function ServicesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
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
  const [newPricingVariation, setNewPricingVariation] = useState<PricingVariation>({
    itemType: "",
    customerCategory: "MALE",
      price: 0,
      description: "",
    isActive: true,
  });
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [isViewingCategory, setIsViewingCategory] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    category?: CategoryResponse;
  }>({
    isOpen: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<SubService | null>(null);
  const [showDeleteServiceDialog, setShowDeleteServiceDialog] = useState(false);
  const [isDeletingService, setIsDeletingService] = useState(false);
  const [servicePage, setServicePage] = useState(1);
  const SERVICES_PER_PAGE = 6;
  const [categoryPage, setCategoryPage] = useState(1);
  const CATEGORIES_PER_PAGE = 6;
  const router = useRouter();

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await api.get(
        "https://civilian-mole-parivartanx-812f67f6.koyeb.app/api/v1/admin/categories"
      );
      if (response.data.success) {
        setCategories(response.data.data);
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

  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      setIsLoading(true);
      try {
        const response = await api.post(
          "/admin/categories",
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
  console.log(selectedCategory);

  const handleAddSubcategory = async () => {
    if (newSubcategory.name.trim() && newSubcategory.categoryId.trim()) {
      setIsLoading(true);
      try {
        const response = await api.post(
          `/admin/services/${selectedCategory?.id}`,
          newSubcategory
        );

        if (response.data.success) {
          toast.success("Service added successfully");
          await fetchCategories();
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
        }
      } catch (error) {
        console.error("Error adding service:", error);
        toast.error("Failed to add service");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddPricingVariation = () => {
    if (newPricingVariation.itemType.trim() && newPricingVariation.price > 0) {
      setNewSubcategory((prev) => ({
        ...prev,
        pricingVariations: [
          ...prev.pricingVariations,
          newPricingVariation,
        ],
      }));
      setNewPricingVariation({
        itemType: "",
        customerCategory: "MALE",
        price: 0,
        description: "",
        isActive: true,
      });
    }
  };

  const handleRemovePricingVariation = (index: number) => {
    setNewSubcategory((prev) => ({
      ...prev,
      pricingVariations: prev.pricingVariations.filter((_, i) => i !== index),
    }));
  };

  // const handleEditCategory = async () => {
  //   if (selectedCategory && newCategory.name.trim()) {
  //     setIsLoading(true);
  //     try {
  //       const response = await api.put(
  //         `/admin/categories/${selectedCategory.id}`,
  //         newCategory
  //       );

  //       if (response.data.success) {
  //         toast.success("Category updated successfully");
  //         await fetchCategories();
  //         setNewCategory({
  //           name: "",
  //           description: "",
  //           showOnHome: true,
  //           imageUrl: null,
  //           sortOrder: 0,
  //         });
  //         setSelectedCategory(null);
  //         setIsAddingCategory(false);
  //       }
  //     } catch (error) {
  //       console.error("Error updating category:", error);
  //       toast.error("Failed to update category");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

  const handleDeleteCategory = async () => {
    if (deleteDialog.category) {
      setIsLoading(true);
      try {
        const response = await api.delete(
          `/admin/categories/${deleteDialog.category.id}`
        );

        if (response.data.success) {
          toast.success("Category deleted successfully");
          await fetchCategories();
          setDeleteDialog({ isOpen: false });
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // const openEditModal = (category: CategoryResponse) => {
  //   setSelectedCategory(category);
  //   setNewCategory({
  //     name: category.name,
  //     description: category.description,
  //     showOnHome: category.showOnHome,
  //     imageUrl: category.imageUrl,
  //     sortOrder: category.sortOrder,
  //   });
  //   setIsAddingCategory(true);
  // };

  const openViewSidebar = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setServicePage(1);
    setIsViewingCategory(true);
  };

  const paginatedServices = selectedCategory?.services
    ? selectedCategory.services.slice(
        (servicePage - 1) * SERVICES_PER_PAGE,
        servicePage * SERVICES_PER_PAGE
      )
    : [];
  const totalPages = selectedCategory?.services
    ? Math.ceil(selectedCategory.services.length / SERVICES_PER_PAGE)
    : 1;

  const paginatedCategories = categories.slice(
    (categoryPage - 1) * CATEGORIES_PER_PAGE,
    categoryPage * CATEGORIES_PER_PAGE
  );
  const totalCategoryPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);

  return (
    <div className="container p-6 max-w-full overflow-y-scroll max-h-[90vh]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="text-gray-500">Manage your laundry services</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddingCategory(true)} className="bg-black text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Category
            </Button>
           
          </div>
        </div>

        {isLoadingCategories ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
              </tr>
            </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#9D215D]/10 flex items-center justify-center">
                            <Shirt className="h-5 w-5 text-[#9D215D]" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.showOnHome
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {category.showOnHome ? "Active" : "Inactive"}
                    </span>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(category);
                            setNewSubcategory(prev => ({
                              ...prev,
                              categoryId: category.id
                            }));
                            setIsAddingSubcategory(true);
                          }}
                          className="text-[#9D215D] hover:text-[#CD3883]"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewSidebar(category)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/services/${category.id}/edit`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteDialog({ isOpen: true, category })}
                          className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Add Category Modal */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Fill in the category details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
          </div>
          <DialogFooter>
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
                "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Service Modal */}
      <Dialog open={isAddingSubcategory} onOpenChange={setIsAddingSubcategory}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Add a new service to {selectedCategory?.name || 'selected category'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input
                  value={newSubcategory.name}
                  onChange={(e) =>
                    setNewSubcategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter service name"
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
                <h4 className="font-medium">New Pricing Variation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Item Type</Label>
                    <Input
                      value={newPricingVariation.itemType}
                      onChange={(e) =>
                        setNewPricingVariation((prev) => ({
                          ...prev,
                          itemType: e.target.value,
                        }))
                      }
                      placeholder="Enter item type"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Category</Label>
                    <select
                      value={newPricingVariation.customerCategory}
                      onChange={(e) =>
                        setNewPricingVariation((prev) => ({
                          ...prev,
                          customerCategory: e.target.value as "MALE" | "FEMALE",
                        }))
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newPricingVariation.price || ""}
                      onChange={(e) =>
                        setNewPricingVariation((prev) => ({
                          ...prev,
                          price: Number(e.target.value) || 0,
                        }))
                      }
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={newPricingVariation.description}
                      onChange={(e) =>
                        setNewPricingVariation((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
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

              {newSubcategory.pricingVariations.map((variation, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Variation {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePricingVariation(index)}
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
                        value={variation.customerCategory}
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
              ))}
            </div>
          </div>
          <DialogFooter>
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
                newSubcategory.pricingVariations.length === 0
              }
              className="bg-[#9D215D] hover:bg-[#CD3883]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Service"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Category Sidebar */}
      <Sheet open={isViewingCategory} onOpenChange={setIsViewingCategory}>
        <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
          <div className=" top-0 bg-white z-10 border-b pb-4">
            <SheetHeader>
              <SheetTitle>Category Details</SheetTitle>
              {/* <SheetDescription>
                View all details about the selected category
              </SheetDescription> */}
            </SheetHeader>
          </div>
          {selectedCategory && (
            <div className="mt-6 space-y-6 pb-6">
              <div className="flex items-center gap-4">
                {selectedCategory.imageUrl ? (
                  <img
                    src={selectedCategory.imageUrl}
                    alt={selectedCategory.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-[#9D215D]/10 flex items-center justify-center">
                    <Shirt className="h-10 w-10 text-[#9D215D]" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{selectedCategory.name}</h3>
                  <p className="text-sm text-gray-500">{selectedCategory.description}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedCategory.showOnHome
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {selectedCategory.showOnHome ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Services</h4>
                  <div className="mt-2 space-y-4">
                    {paginatedServices.map((service) => (
                      <div key={service.id} className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0">
                            {service.imageUrl ? (
                              <img
                                src={service.imageUrl}
                                alt={service.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-[#9D215D]/10 flex items-center justify-center">
                                <Shirt className="h-5 w-5 text-[#9D215D]" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 truncate">{service.name}</p>
                              <div className="text-sm text-gray-500 truncate">{service.description}</div>
                              <div className="text-xs text-gray-500 mt-1">Base Price: <span className="font-medium text-[#9D215D]">₹{service.basePrice}</span></div>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/services/${selectedCategory?.id}/services/${service.id}/edit`)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              aria-label="Edit Service"
                            >
                              <Pencil className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setServiceToDelete(service);
                                setShowDeleteServiceDialog(true);
                              }}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              aria-label="Delete Service"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Pricing Variations */}
                        {service.pricingVariations && service.pricingVariations.length > 0 && (
                          <div className="ml-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-medium text-gray-700">Pricing Variations</h5>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {service.pricingVariations.length} variations
                              </span>
                            </div>
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Item Type</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Category</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Price</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {service.pricingVariations.map((variation, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                      <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                          <div className="h-2 w-2 rounded-full bg-[#9D215D]" />
                                          <span className="text-gray-700">{variation.itemType}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          variation.customerCategory === 'MALE' 
                                            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                                            : 'bg-pink-50 text-pink-700 ring-1 ring-pink-200'
                                        }`}>
                                          {variation.customerCategory}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2">
                                        <div className="flex items-center gap-1">
                                          <span className="font-medium text-[#9D215D]">₹{variation.price}</span>
                                          <span className="text-xs text-gray-400">/item</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          variation.isActive
                                            ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                                            : 'bg-gray-50 text-gray-700 ring-1 ring-gray-200'
                                        }`}>
                                          {variation.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!selectedCategory.services || selectedCategory.services.length === 0) && (
                      <p className="text-sm text-gray-500">No services added yet</p>
                    )}
                  </div>
                </div>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={servicePage === 1}
                    onClick={() => setServicePage(servicePage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="px-2 py-1 text-sm">
                    Page {servicePage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={servicePage === totalPages}
                    onClick={() => setServicePage(servicePage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={() => setDeleteDialog({ isOpen: false })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete the category {deleteDialog.category?.name}? This will also delete all its services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Service Confirmation Dialog */}
      <AlertDialog open={showDeleteServiceDialog} onOpenChange={setShowDeleteServiceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete the service {serviceToDelete?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={isDeletingService}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (serviceToDelete) {
                  setIsDeletingService(true);
                  try {
                    await api.delete(`/admin/services/${serviceToDelete.id}`);
                    setShowDeleteServiceDialog(false);
                    setServiceToDelete(null);
                    setIsViewingCategory(false);
                    fetchCategories();
                    toast.success("Service deleted successfully");
                  } catch (error) {
                    toast.error("Failed to delete service");
                    console.error(error);
                  } finally {
                    setIsDeletingService(false);
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              disabled={isDeletingService}
            >
              {isDeletingService ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pagination for categories */}
      {totalCategoryPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-500 text-sm">
            Showing {(categoryPage - 1) * CATEGORIES_PER_PAGE + 1}
            {" "}
            to {Math.min(categoryPage * CATEGORIES_PER_PAGE, categories.length)}
            {" "}
            of {categories.length} categories
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={categoryPage === 1}
              onClick={() => setCategoryPage(categoryPage - 1)}
              className="rounded-md"
            >
              Previous
            </Button>
            {Array.from({ length: totalCategoryPages }, (_, i) => (
              <Button
                key={i + 1}
                size="sm"
                variant={categoryPage === i + 1 ? "default" : "outline"}
                className={`rounded-md ${categoryPage === i + 1 ? 'bg-black text-white' : ''}`}
                onClick={() => setCategoryPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={categoryPage === totalCategoryPages}
              onClick={() => setCategoryPage(categoryPage + 1)}
              className="rounded-md"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
