/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth, { type DefaultSession } from "next-auth";
import { NextRequest } from "next/server";

declare module "next/server" {
  interface NextRequest {
    auth?: Session | null; // For session-based auth
    // auth?: JWT | null; // Uncomment if using JWT instead
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

export const { auth, handlers } = NextAuth({
  callbacks: {
    session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          address: user.address,
        },
      };
    },
  },
});
