"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { AppHeader } from "@/components/header"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen flex-col w-full">
          <AppHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <main className="flex-1 p-6 md:p-8 ">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  )
}
