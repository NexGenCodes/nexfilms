import type React from "react";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "@/globals.css";

import { ThemeProvider } from "@/components/theme/provider";
import { SITE_DESCRIPTION, SITE_NAME } from "@/constants";
import { AppLayout } from "@/components/layout";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={inter.className}> */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
