"use client";
import {
  Calendar1,
  Github,
  Home,
  LayoutDashboard,
  LucideIcon,
  Table2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Table View",
    href: "/admin/dashboard/examples/table",
    icon: Table2,
  },
  {
    title: "Calendar View",
    href: "/admin/dashboard/examples/calendar",
    icon: Calendar1,
  },
  {
    title: "Packages",
    href: "/admin/dashboard/packages",
    icon: Github,
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="borak-theme"
    >
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden w-full">
          <Sidebar>
            <SidebarHeader className="px-6 py-4">
              <a href="/" className="flex items-center space-x-2">
                <Home className="h-6 w-6" />
                <span className="text-xl font-semibold">Logo</span>
              </a>
            </SidebarHeader>
            <SidebarContent className="p-4">
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href} className="mt-2">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <a href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="flex items-center flex-row gap-2"></SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <div className="flex h-full flex-col">
              <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger />
                <div className="flex-1 flex items-center justify-end gap-4">
                  <ThemeToggle />{" "}
                </div>
              </header>
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
