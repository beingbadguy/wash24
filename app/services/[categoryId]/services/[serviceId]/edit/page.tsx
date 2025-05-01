"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X, Shirt } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { uploadImageToCloudinary } from "@/lib/cloudinaryImageUpload";
import { ServiceType, PricingVariation } from "@/app/services/types";

type CategoryType = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  showOnHome: boolean;
  sortOrder: number;
  services: ServiceType[];
}


const EditServicePage = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;
  const serviceId = params?.serviceId as string;
  const [service, setService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [newVariation, setNewVariation] = useState<PricingVariation>({
    itemType: "",
    customerCategory: "MALE",
    price: 0,
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (!categoryId || !serviceId) return;
    setLoading(true);
    setError(null);
    api.get("/admin/categories")
      .then(res => {
        if (!res.data?.data) {
          setError("Failed to fetch categories.");
          setService(null);
        } else {
          const foundCategory = res.data.data.find((cat: CategoryType) => cat.id === categoryId);
          if (!foundCategory) {
            setError("Category not found.");
            setService(null);
          } else {
            const foundService = foundCategory.services.find((serv: ServiceType) => serv.id === serviceId);
            if (!foundService) {
              setError("Service not found.");
              setService(null);
            } else {
              setService(foundService);
            }
          }
        }
      })
      .catch(() => {
        setError("Failed to fetch service. Please try again later.");
        setService(null);
      })
      .finally(() => setLoading(false));
  }, [categoryId, serviceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!service) return;
    const { name, value, type } = e.target;
    let newValue: string | boolean | number = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    } else if (type === "number") {
      newValue = Number(value);
    }
    setService({
      ...service,
      [name]: newValue,
    });
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setService((prev: ServiceType | null) => prev ? { ...prev, imageUrl } : prev);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddVariation = () => {
    if (!service) return;
    if (!newVariation.itemType.trim() || newVariation.price <= 0) {
      toast.error("Please fill in all required fields for the pricing variation");
      return;
    }
    setService({
      ...service,
      pricingVariations: [...service.pricingVariations, newVariation],
    });
    setNewVariation({
      itemType: "",
      customerCategory: "MALE",
      price: 0,
      description: "",
      isActive: true,
    });
  };

  const handleRemoveVariation = (index: number) => {
    if (!service) return;
    setService({
      ...service,
      pricingVariations: service.pricingVariations.filter((_: PricingVariation, i: number) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!service) return;
    setSaving(true);
    setError(null);
    try {
      await api.patch(`/admin/services/${service.id}`, {
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        imageUrl: service.imageUrl,
        isActive: service.isActive,
        showOnHome: service.showOnHome,
        sortOrder: service.sortOrder,
        pricingVariations: service.pricingVariations,
      });
      toast.success("Service updated successfully");
      router.push(`/services`);
    } catch (err) {
      setError("Failed to update service. Please try again.");
      toast.error("Failed to update service");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <div className="text-red-500 font-semibold mb-2">{error}</div>
      <Button onClick={() => router.push(`/services/${categoryId}`)}>Back to Services</Button>
    </div>
  );

  if (!service) return null;

  return (
    <div className=" mx-auto p-6 max-h-[90vh] overflow-y-scroll">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/services/${categoryId}`)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#9D215D] hover:bg-[#CD3883]"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                id="name"
                name="name"
                value={service.name}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={service.description}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="basePrice" className="text-sm font-medium text-gray-700">Base Price</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                value={service.basePrice}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium text-gray-700">Service Image</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    disabled={imageUploading}
                    className="w-full"
                  />
                </div>
                {imageUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Shirt className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={service.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#9D215D] focus:ring-[#9D215D] border-gray-300 rounded"
                />
                <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showOnHome"
                  name="showOnHome"
                  checked={service.showOnHome}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#9D215D] focus:ring-[#9D215D] border-gray-300 rounded"
                />
                <Label htmlFor="showOnHome" className="text-sm font-medium text-gray-700">Show on home</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder" className="text-sm font-medium text-gray-700">Sort Order</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                value={service.sortOrder}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Pricing Variations Section */}
        <div className="border-t pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pricing Variations</h2>
          </div>

          {/* New Variation Form */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Add New Pricing Variation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemType" className="text-sm font-medium text-gray-700">Item Type</Label>
                <Input
                  id="itemType"
                  value={newVariation.itemType}
                  onChange={(e) => setNewVariation({ ...newVariation, itemType: e.target.value })}
                  placeholder="e.g., Shirt, Pants"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerCategory" className="text-sm font-medium text-gray-700">Customer Category</Label>
                <select
                  id="customerCategory"
                  value={newVariation.customerCategory}
                  onChange={(e) => setNewVariation({ ...newVariation, customerCategory: e.target.value as "MALE" | "FEMALE" })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newVariation.price}
                  onChange={(e) => setNewVariation({ ...newVariation, price: Number(e.target.value) })}
                  placeholder="Enter price"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                <Input
                  id="description"
                  value={newVariation.description}
                  onChange={(e) => setNewVariation({ ...newVariation, description: e.target.value })}
                  placeholder="Optional description"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleAddVariation}
                className="bg-[#9D215D] hover:bg-[#CD3883]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variation
              </Button>
            </div>
          </div>

          {/* Existing Variations */}
          <div className="space-y-4">
            {service.pricingVariations.map((variation: PricingVariation, index: number) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{variation.itemType}</h3>
                    <p className="text-sm text-gray-500">{variation.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveVariation(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Customer Category</Label>
                    <p className="text-sm font-medium text-gray-900">{variation.customerCategory}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Price</Label>
                    <p className="text-sm font-medium text-[#9D215D]">₹{variation.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServicePage; 