"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  IndianRupee,
} from "lucide-react";

export default function SettingsPage() {
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
        </Tabs>
      </div>
    </div>
  );
}
