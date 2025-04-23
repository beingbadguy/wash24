"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { AxiosError } from "axios";

interface Document {
  documentType: string;
  documentUrl: string;
}

interface FormSection {
  [key: string]: string;
}

interface FormData {
  personalInfo: FormSection;
  addressInfo: FormSection;
  vehicleInfo: FormSection;
  bankInfo: FormSection;
  documents: Document[];
  status: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ApiError {
  path: string;
  message: string;
}

export default function AddAgentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      emergencyContact: "",
    },
    addressInfo: {
      address: "",
      city: "",
      pinCode: "",
    },
    vehicleInfo: {
      vehicleNumber: "",
      vehicleType: "",
    },
    bankInfo: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      accountHolderName: "",
    },
    documents: [
      {
        documentType: "Driving License",
        documentUrl: "",
      },
      {
        documentType: "Vehicle Registration",
        documentUrl: "",
      },
    ],
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Phone number validation
    if (formData.personalInfo.phone.length < 8) {
      newErrors["personalInfo.phone"] =
        "Phone number must be at least 8 characters";
    }

    // Document URL validation
    formData.documents.forEach((doc, index) => {
      try {
        new URL(doc.documentUrl);
      } catch {
        newErrors[`documents.${index}.documentUrl`] =
          "Please enter a valid URL";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/admin/delivery-agent", formData);
      console.log(response.data);
      toast.success("Delivery agent added successfully");
      router.push("/agents");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.errors) {
        const apiErrors: ValidationErrors = {};
        (error.response.data.errors as ApiError[]).forEach((err) => {
          apiErrors[err.path] = err.message;
        });
        setErrors(apiErrors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error("Failed to add delivery agent");
      }
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const [section, field] = name.split(".");

    setFormData((prev) => {
      const newData = { ...prev };
      if (section in newData && field) {
        (newData[section as keyof FormData] as FormSection)[field] = value;
      }
      return newData;
    });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDocumentUrlChange = (documentType: string, url: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc) =>
        doc.documentType === documentType ? { ...doc, documentUrl: url } : doc
      ),
    }));

    // Clear error when document URL is modified
    const docIndex = formData.documents.findIndex(
      (doc) => doc.documentType === documentType
    );
    if (errors[`documents.${docIndex}.documentUrl`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`documents.${docIndex}.documentUrl`];
        return newErrors;
      });
    }
  };

  return (
    <div className="container p-6 mx-auto max-h-[90vh] overflow-y-scroll w-full">
      <div className="flex items-center gap-4 mb-6 cursor-pointer">
        <Button
          variant="ghost"
          className="cursor-pointer"
          size="icon"
          onClick={() => router.push("/agents")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Delivery Agent
          </h1>
          <p className="text-gray-500">
            Enter the details to register a new delivery agent
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="personalInfo.fullName">Full Name</Label>
              <Input
                id="personalInfo.fullName"
                name="personalInfo.fullName"
                value={formData.personalInfo.fullName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalInfo.email">Email Address</Label>
              <Input
                id="personalInfo.email"
                name="personalInfo.email"
                type="email"
                value={formData.personalInfo.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalInfo.phone">Phone Number</Label>
              <Input
                id="personalInfo.phone"
                name="personalInfo.phone"
                value={formData.personalInfo.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
              {errors["personalInfo.phone"] && (
                <p className="text-sm text-red-500">
                  {errors["personalInfo.phone"]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalInfo.emergencyContact">
                Emergency Contact
              </Label>
              <Input
                id="personalInfo.emergencyContact"
                name="personalInfo.emergencyContact"
                value={formData.personalInfo.emergencyContact}
                onChange={handleChange}
                required
                placeholder="Enter emergency contact"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="addressInfo.address">Address</Label>
              <Input
                id="addressInfo.address"
                name="addressInfo.address"
                value={formData.addressInfo.address}
                onChange={handleChange}
                required
                placeholder="Enter street address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressInfo.city">City</Label>
              <Input
                id="addressInfo.city"
                name="addressInfo.city"
                value={formData.addressInfo.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressInfo.pinCode">PIN Code</Label>
              <Input
                id="addressInfo.pinCode"
                name="addressInfo.pinCode"
                value={formData.addressInfo.pinCode}
                onChange={handleChange}
                required
                placeholder="Enter PIN code"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vehicleInfo.vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleInfo.vehicleNumber"
                name="vehicleInfo.vehicleNumber"
                value={formData.vehicleInfo.vehicleNumber}
                onChange={handleChange}
                required
                placeholder="Enter vehicle number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleInfo.vehicleType">Vehicle Type</Label>
              <select
                id="vehicleInfo.vehicleType"
                name="vehicleInfo.vehicleType"
                value={formData.vehicleInfo.vehicleType}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="">Select vehicle type</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Scooter">Scooter</option>
                <option value="Bicycle">Bicycle</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Bank Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bankInfo.accountNumber">
                Bank Account Number
              </Label>
              <Input
                id="bankInfo.accountNumber"
                name="bankInfo.accountNumber"
                value={formData.bankInfo.accountNumber}
                onChange={handleChange}
                required
                placeholder="Enter bank account number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankInfo.ifscCode">IFSC Code</Label>
              <Input
                id="bankInfo.ifscCode"
                name="bankInfo.ifscCode"
                value={formData.bankInfo.ifscCode}
                onChange={handleChange}
                required
                placeholder="Enter IFSC code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankInfo.bankName">Bank Name</Label>
              <Input
                id="bankInfo.bankName"
                name="bankInfo.bankName"
                value={formData.bankInfo.bankName}
                onChange={handleChange}
                required
                placeholder="Enter bank name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankInfo.accountHolderName">
                Account Holder Name
              </Label>
              <Input
                id="bankInfo.accountHolderName"
                name="bankInfo.accountHolderName"
                value={formData.bankInfo.accountHolderName}
                onChange={handleChange}
                required
                placeholder="Enter account holder name"
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Documents</h2>
          <div className="grid grid-cols-1 gap-6">
            {formData.documents.map((doc, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`document-${doc.documentType}`}>
                  {doc.documentType}
                </Label>
                <Input
                  id={`document-${doc.documentType}`}
                  type="text"
                  value={doc.documentUrl}
                  onChange={(e) =>
                    handleDocumentUrlChange(doc.documentType, e.target.value)
                  }
                  placeholder={`Enter ${doc.documentType} URL`}
                  required
                />
                {errors[`documents.${index}.documentUrl`] && (
                  <p className="text-sm text-red-500">
                    {errors[`documents.${index}.documentUrl`]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/agents")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Agent...
              </>
            ) : (
              "Add Agent"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
