"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  UserCog,
  Tags,
  Settings,
  HelpCircle,
  MessageCircle,
  LogOut,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/store";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ShoppingCart, label: "Order", href: "/orders" },
  { icon: UserCog, label: "Delivery Agent", href: "/agents" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Tags, label: "Service & Pricing", href: "/services" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "FAQ", href: "/help" },
  { icon: MessageCircle, label: "Support", href: "/support" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    Cookies.remove("wash24");
    clearAuth();
    router.push("/auth/login");
  };

  return (
    <div className="h-screen w-64 bg-white border-r p-4 flex flex-col">
      <div className="flex items-center gap-2 px-2 mb-8 justify-center">
        <Image
          src="/logo.jpeg"
          alt="Wash24"
          width={120}
          height={120}
          className="object-contain"
          priority
        />
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-purple-100 text-[#9D215D]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        className="gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-lg mt-auto bg-gray-200 text-black flex items-center justify-center w-full"
        onClick={() => setShowLogoutDialog(true)}
      >
        <LogOut size={20} />
        <span>Log Out</span>
      </button>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to log in again to
              access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
