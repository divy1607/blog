import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@repo/db";
import { env } from "process";

// Define authOptions separately
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        try {
          const { data: user } = await axios.post(
            "http://localhost:3000/api/auth/validate",
            {
              username: credentials.username,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          if (user) {
            return user;
          }
        } catch (error) {
          console.error("Error during user authentication:", error);
          return null;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.username = token.username as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("http")) {
        return url;
      }
      return baseUrl;
    },
  },
  debug: true,
};

// Use the authOptions in the default export
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions);
}

// Export auth for different HTTP methods
export { auth as GET, auth as POST };
