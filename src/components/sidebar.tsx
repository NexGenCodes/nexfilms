"use client";
import Link from "next/link";
import { SITE_NAME, NAV_ITEMS, SOCIAL_LINKS } from "@/constants";
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
import { GalleryVerticalEnd } from "lucide-react";
import { cn, getIconByName } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    return href === pathname;
  };
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-none hover:text-none"
              asChild
            >
              <Link href="/">
                <div className="flex aspect-square size-6 items-center justify-center rounded-lg text-primary-foreground">
                  <GalleryVerticalEnd className="size-8" />
                </div>
                <div className="flex flex-col gap-0.5 ">
                  <span className="font-semibold uppercase text-2xl">
                    {SITE_NAME}
                  </span>
                  <span className="text-xs text-muted-foreground leading-none">
                    Your entertainment center
                  </span>
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
              {NAV_ITEMS.map((item) => {
                const Icon = getIconByName(item.icon);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        isActive(item.href) &&
                          "bg-primary/50 text-primary-foreground "
                      )}
                    >
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Connect With Us</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SOCIAL_LINKS.map((item) => {
                const Icon = getIconByName(item.icon);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
