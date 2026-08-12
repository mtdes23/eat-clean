"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, UtensilsCrossed, User, ShoppingCart, LayoutDashboard, Shield } from "lucide-react";

const tabs = [
  { key: "menu", label: "Menu", icon: CalendarDays, href: "/" },
  { key: "meals", label: "Mon an", icon: UtensilsCrossed, href: "/meals" },
  { key: "dashboard", label: "Theo doi", icon: LayoutDashboard, href: "/dashboard" },
  { key: "shopping", label: "Mua sam", icon: ShoppingCart, href: "/shopping" },
  { key: "auth", label: "Tai khoan", icon: User, href: "/auth" },
];

export default function AppLayout({ children, title, showNav = true }) {
  const pathname = usePathname();

  const activeTab = tabs.find((t) => t.href === pathname)?.key || null;

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-40 pt-3 pb-2"
        style={{ background: "linear-gradient(180deg, #000 60%, transparent)" }}
      >
        <div className="px-4 flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight">{title}</h1>
          {pathname === "/admin" && (
            <Link
              href="/admin"
              className="ml-auto flex items-center gap-1 text-xs text-zinc-500 hover:text-white"
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 pb-24">{children}</main>

      {showNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{
            background: "linear-gradient(0deg, #000 60%, transparent)",
            paddingBottom: "env(safe-area-inset-bottom, 8px)",
          }}
        >
          <div className="flex items-center justify-around px-4 pt-2 pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl transition-all duration-200 min-w-[60px] ${
                    active ? "tab-active" : "text-zinc-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
