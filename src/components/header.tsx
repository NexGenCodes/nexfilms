"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme/toggle";
import { UserNav } from "@/components/nav";
import { SITE_NAME, SITE_SHORT_URL } from "@/constants";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 md:px-6 ">
      <div className="flex items-center gap-4 md:gap-6">
        <SidebarTrigger />
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="hidden md:inline-flex">{SITE_NAME}</span>
          <span className="inline-flex md:hidden">{SITE_SHORT_URL}</span>
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="lg:w-96 rounded-full bg-muted pl-8 w-auto"
          />
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Theme toggle dropdown */}
        <ThemeToggle />

        {/* User navigation */}
        <UserNav />
      </div>
    </header>
  );
}
