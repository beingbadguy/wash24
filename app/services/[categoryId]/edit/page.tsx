"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { uploadImageToCloudinary } from "@/lib/cloudinaryImageUpload";
import { CategoryType } from "../../types";

const  EditCategoryPage=()=> {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    api.get("/admin/categories")
      .then(res => {
        if (!res.data?.data) {
          setError("Failed to fetch categories.");
          setCategory(null);
        } else {
          // Find the category with the matching ID
          const foundCategory = res.data.data.find((cat: CategoryType) => cat.id === categoryId);
          if (!foundCategory) {
            setError("Category not found.");
            setCategory(null);
          } else {
            setCategory(foundCategory);
          }
        }
      })
      .catch(() => {
        setError("Failed to fetch categories. Please try again later.");
        setCategory(null);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!category) return;
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setCategory({
      ...category,
      [name]: newValue,
    });
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setCategory((prev: CategoryType | null) => prev ? { ...prev, imageUrl } : prev);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    if (!category) return;
    setSaving(true);
    setError(null);
    try {
      await api.patch(`/admin/categories/${category.id}`, {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        showOnHome: category.showOnHome,
        sortOrder: category.sortOrder,
      });
      toast.success("Category updated successfully");
      router.push("/services");
    } catch (err) {
      console.error(err);
      setError("Failed to update category. Please try again.");
      toast.error("Failed to update category");
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
      <Button onClick={() => router.push("/services")}>Back to Services</Button>
    </div>
  );
  if (!category) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={category.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={category.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Upload Image (Optional)</Label>
          <div className="flex items-center gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              disabled={imageUploading}
            />
            {imageUploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {category.imageUrl && (
              <img
                src={category.imageUrl}
                alt="Preview"
                className="h-10 w-10 object-cover rounded"
              />
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showOnHome"
            name="showOnHome"
            checked={category.showOnHome}
            onChange={handleInputChange}
          />
          <Label htmlFor="showOnHome">Show on home</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            value={category.sortOrder}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="outline"
          onClick={() => router.push("/services")}
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
  );
}
export default EditCategoryPage;
