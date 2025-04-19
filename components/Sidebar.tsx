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
} from "lucide-react";
import Image from "next/image";

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

  return (
    <div className="h-screen w-64 bg-white border-r p-4 flex flex-col">
      <div className="flex items-center gap-2 px-2 mb-8 justify-center">
        <Image src="/logo.jpeg" alt="Wash24" height={120} width={120} />
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

      <button className=" gap-3 px-3 py-2  hover:bg-gray-100 cursor-pointer rounded-lg mt-auto bg-gray-200 text-black flex items-center justify-center w-full">
        <LogOut size={20} />
        <span>Log Out</span>
      </button>
    </div>
  );
}
