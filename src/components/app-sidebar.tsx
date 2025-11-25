"use client";

import {
  LayoutDashboard,
  Users,
  Bird,
  Hospital,
  TrendingUp,
  ChevronUp,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/store";
import { useLogout } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/utils";
import { toast } from "sonner";

const menuItems = [
  {
    name: "Breeders",
    href: "/breeders",
    icon: Users,
  },
  {
    name: "Schema",
    href: "/schemas",
    icon: LayoutDashboard,
  },
  {
    name: "Events",
    href: "/events",
    icon: Bird,
  },
  {
    name: "Event Inventory",
    href: "/event-inventory",
    icon: Hospital,
  },
  {
    name: "Races",
    href: "/races",
    icon: TrendingUp,
  },
  {
    name: "Birds",
    href: "/birds",
    icon: Bird,
  },
];

export function AppSidebar() {
  const { mutateAsync: logout } = useLogout();
  const handleLogout = async () => {
    if (!logout) return;
    try {
      // Remove token from localStorage using utility
      tokenStorage.remove();
      const { data, error } = await logout({});
      if (error) {
        toast.error("Failed to log out");
        return;
      }
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("An error occurred while logging out");
    }
  };
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Bird className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-xl">AGN</span>
                  <span className="text-xs text-muted-foreground">Pigeon Racing</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">{user?.name || "User"}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
