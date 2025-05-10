import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeProvider } from "@/components/theme/provider";
import { ThemeToggle } from "@/components/theme/toggle";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Inter } from "next/font/google";
import { SITE_NAME } from "@/constants";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import Link from "next/link";
import "@/globals.css";
import {
  Home,
  LayoutDashboard,
  Film,
  Tv,
  PlayCircle,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: `Admin Dashboard - ${SITE_NAME}`,
  description: "Manage your entertainment content",
};

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<Props>) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/movies", label: "Movies", icon: Film },
    { href: "/admin/series", label: "Series", icon: Tv },
    { href: "/admin/animations", label: "Animations", icon: PlayCircle },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 md:px-6">
              <Link
                href="/admin"
                className="flex items-center gap-2 font-semibold"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" aria-hidden="true" />
                </div>
                <span>{SITE_NAME} Admin</span>
              </Link>
              <div className="ml-auto flex items-center gap-4">
                <ThemeToggle />
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>Back to Site</span>
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || "Admin user"}
                    />
                    <AvatarFallback>
                      {session.user.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex flex-1">
              <nav className="hidden w-64 border-r bg-muted/40 md:block">
                <ul className="flex flex-col gap-2 p-4" role="list">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Button
                        variant="ghost"
                        asChild
                        className="justify-start w-full"
                      >
                        <Link href={item.href}>
                          <item.icon
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          <span>{item.label}</span>
                        </Link>
                      </Button>
                    </li>
                  ))}
                  <li>
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-destructive hover:text-destructive"
                      form="logout-form"
                      type="submit"
                    >
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span>Sign Out</span>
                    </Button>
                    <form
                      id="logout-form"
                      action="/api/auth/signout"
                      method="POST"
                      className="hidden"
                    ></form>
                  </li>
                </ul>
              </nav>
              <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
