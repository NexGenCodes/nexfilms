import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { AppError } from "./lib/appError";

export default {
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (credentials) => {
        if (!credentials || Object.keys(credentials).length === 0) {
          throw new AppError("Invalid credentials", 401);
        }
        return credentials;
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
      // return true;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as "USER" | "ADMIN",
        };
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
