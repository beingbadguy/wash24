"use client";

import { Sidebar } from "@/components/Sidebar";
import "./globals.css";
import { Inter } from "next/font/google";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Bell } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth");

  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gray-50 ${
          !isAuthRoute ? "flex items-start gap-2" : ""
        }`}
      >
        {isAuthRoute ? (
          children
        ) : (
          <div className="flex items-start w-full">
            <Sidebar />
            <div className="w-full items-center justify-start flex flex-col">
              <header className="bg-white border-b p-4 flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-[#9D215D]">A</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Chandani Kumari</h3>
                    <p className="text-sm text-gray-500">admin@wash24.com</p>
                  </div>
                </div>

                <Popover>
                  <PopoverTrigger>
                    <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                      <Bell size={20} />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white shadow-md mr-12 min-h-10 p-4 border rounded flex items-start justify-start gap-2 flex-col z-[999]">
                    <div className="w-full flex items-center justify-between">
                      <p className="text-[#9D215D] font-bold w-full text-left">
                        Notifications
                      </p>
                    </div>
                    <p className="text-sm">
                      You have received a notification from X
                    </p>
                    <p className="text-sm">
                      You have received a notification from X
                    </p>
                    <p className="text-sm">
                      You have received a notification from X
                    </p>
                    <p className="text-sm">
                      You have received a notification from X
                    </p>
                    <p className="text-sm">
                      You have received a notification from X
                    </p>

                    <Separator className="w-full border" />
                    <div className="cursor-pointer transition-all duration-300 w-full bg-[#9D215D] p-1 rounded text-white text-center">
                      See all
                    </div>
                  </PopoverContent>
                </Popover>
              </header>
              <div className="w-full mx-4">{children}</div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
