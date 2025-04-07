"use client";

import { Phone, Mail, MapPin, Clock, Globe, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function BusinessInfo() {
  return (
    <div className="p-3 space-y-6 overflow-y-scroll max-h-[90vh] w-full">
      {/* Business Name & Logo */}
      <Card className="shadow-md">
        <CardContent className="flex justify-between items-center py-6 px-4">
          <div>
            <h2 className="text-[#9D215D] font-semibold text-lg mb-2">
              Business Name & Logo
            </h2>
            <p className="text-sm">
              <span className="font-semibold">Name:</span> Wash24
            </p>
            <p className="text-sm">
              <span className="font-semibold">Logo:</span>
            </p>
          </div>
          <div className="w-32 h-20 bg-white border rounded-md shadow-sm flex items-center justify-center p-2">
            <Image
              src="/logo.jpeg" // Replace this with your actual logo path
              alt="Wash24 Logo"
              className="object-contain w-full h-full"
              width={120}
              height={120}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="shadow-md">
        <CardContent className="py-6 px-4 space-y-1">
          <h2 className="text-[#9D215D] font-semibold text-lg mb-2">
            Contact Information
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-[#9D215D]" />
            <span className="font-semibold">Phone:</span> +91 9876543210
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-[#9D215D]" />
            <span className="font-semibold">Email:</span> arjun@email.com
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-[#9D215D]" />
            <span className="font-semibold">Address:</span> Paliganj, Patna,
            Bihar
          </div>
        </CardContent>
      </Card>

      {/* Currency & Time Zone */}
      <Card className="shadow-md">
        <CardContent className="py-6 px-4 space-y-1">
          <h2 className="text-[#9D215D] font-semibold text-lg mb-2">
            Currency & Time Zone
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="h-4 w-4 text-[#9D215D]" />
            <span className="font-semibold">Currency:</span> INR (₹)
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-[#9D215D]" />
            <span className="font-semibold">Time Zone:</span> IST (Indian
            Standard Time, GMT +5:30)
          </div>
        </CardContent>
      </Card>

      {/* Working Hours & Holidays */}
      <Card className="shadow-md">
        <CardContent className="py-6 px-4 space-y-2">
          <h2 className="text-[#9D215D] font-semibold text-lg mb-2">
            Working Hours & Holidays
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-[#9D215D]" />
            <span className="font-semibold">Working Hours:</span> Monday to
            Sunday, 9:00 AM - 9:00 PM
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
