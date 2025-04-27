import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (credentials) => {
        if (Object.keys(credentials).length === 0) return null;
        return credentials;
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
      // return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;



