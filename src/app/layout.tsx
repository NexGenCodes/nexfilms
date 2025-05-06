import { ThemeProvider } from "@/components/theme/provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SITE_DESCRIPTION, SITE_NAME } from "@/constants";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/sidebar";
import { AppHeader } from "@/components/header";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import type React from "react";
import "@/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
    // shortcut: "/favicon-16x16.png",
    // apple: "/apple-touch-icon.png",
  },
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className=" antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
        </ThemeProvider>
      </body>
    </html>
  );
}
