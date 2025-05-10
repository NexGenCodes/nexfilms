import { ThemeProvider } from "@/components/theme/provider";
import { ThemeToggle } from "@/components/theme/toggle";
import logo from "@/assets/COLOURED/MAIN.png";
import { Inter } from "next/font/google";
import { SITE_NAME } from "@/constants";
import type { Metadata } from "next";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import "@/globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: `Authentication - ${SITE_NAME}`,
  description: "Sign in or create an account",
  icons: {
    icon: "/favicon.ico",
  },
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col w-full">
            <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 md:px-6 ">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex aspect-square items-center justify-center">
                  <Image
                    src={logo}
                    priority
                    alt="Logo"
                    className="size-8"
                    width={32}
                    height={32}
                  />
                </div>
                <span className="text-lg font-semibold">{SITE_NAME}</span>
              </Link>
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 p-6 md:p-8 ">{children}</main>
            <footer className="border-t py-4 text-center text-sm text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} {SITE_NAME}. All rights
                reserved.
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
