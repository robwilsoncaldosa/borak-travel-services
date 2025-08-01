"use client";

import { ProtectedRoute } from "@/components/auth/protected-route"; 
import { useAuth } from "@/hooks/useAuth";
import {
    Calendar1,
    Home,
    Inbox,
    LayoutDashboard,
    LucideIcon,
    Package,
    Table2,
    Users,
    BookOpen
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";

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
    title: "Users",
    href: "/admin/dashboard/users",
    icon: Users,
  },

  {
    title: "Inbox",
    href: "/admin/dashboard/inbox",
    icon: Inbox,
  },
 
  {
    title: "Bookings",
    href: "/admin/dashboard/bookings",
    icon: BookOpen,
  },
  
  {
    title: "Calendar View",
    href: "/admin/dashboard/examples/calendar",
    icon: Calendar1,
  },
  {
    title: "Packages",
    href: "/admin/dashboard/packages",
    icon: Package,
  },
  {
    title: "Reviews",
    href: "/admin/dashboard/reviews",
    icon: Table2,
  },

];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, logoutLoading } = useAuth();

  // Logout handler
  const handleLogout = async () => {
    await logout();
    // Redirect to login page after logout
    router.push("/admin/login");
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
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
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-6 w-6" />
                <span className="text-xl font-semibold">Logo</span>
              </Link>
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
            <SidebarFooter className="flex items-center flex-row gap-2">
              <Button
                variant="destructive"
                className="w-full mt-4"
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                {logoutLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing out...</span>
                  </div>
                ) : (
                  "Logout"
                )}
              </Button>
            </SidebarFooter>
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
  </ProtectedRoute>
  );
}
