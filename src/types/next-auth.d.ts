import { type DefaultSession } from "next-auth";

declare module "next/server" {
  interface NextRequest {
    auth?: Session | null; // For session-based auth
    // auth?: JWT | null; // Uncomment if using JWT instead
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: "USER" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "ADMIN";
  }
}
