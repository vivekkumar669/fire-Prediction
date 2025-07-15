"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  Megaphone,
  History,
  BotMessageSquare,
  Mountain,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/incidents", label: "Incidents", icon: History },
  { href: "/simulation", label: "Simulation", icon: BotMessageSquare },
  { href: "/alerts", label: "Alerts", icon: Megaphone },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 size-10 rounded-lg">
            <Flame className="size-6" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold font-headline text-foreground">
              FireWatch AI
            </h2>
            <p className="text-xs text-muted-foreground">Forest Fire Intel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 flex flex-col gap-2">
            <div className="p-4 rounded-lg bg-card border border-primary/20 flex flex-col items-center text-center gap-2">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Mountain className="size-6"/>
                </div>
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                    Contact support for assistance with the system.
                </p>
                <Button size="sm" className="w-full">Contact Support</Button>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
