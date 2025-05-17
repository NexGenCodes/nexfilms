"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/toggle";
import { SITE_NAME, SITE_SHORT_URL } from "@/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSidebar } from "./ui/sidebar";
import { Search } from "./search";

export function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-10 h-16 px-2 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        scrolled ? "border-border shadow-sm" : "border-border"
      )}
    >
      <div className="flex items-center gap-4 md:gap-6 ">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleSidebar()}
            className="lg:hidden hover:bg-green-500/10 hover:text-green-500 transition-colors"
          >
            <Menu className="size-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg text-primary"
        >
          <span className="hidden sm:block uppercase">{SITE_NAME}</span>
          <span className="inline-flex sm:hidden uppercase">
            {SITE_SHORT_URL}
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Search />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
