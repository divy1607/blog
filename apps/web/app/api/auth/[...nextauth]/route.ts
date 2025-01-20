import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          // Ensure credentials are passed
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Username and password are required");
          }

          try {
            // Make a POST request to your own API to validate credentials
            const { data: user } = await axios.post(
              "http://localhost:3000/api/auth/validate", // Create a validate endpoint
              {
                username: credentials.username,
                password: credentials.password,
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );

            if (user) {
              // Return user object if authentication is successful
              return user;
            }
          } catch (error) {
            console.error("Error during user authentication:", error);
            return null;
          }

          // If authentication fails
          return null;
        },
      }),
    ],
    callbacks: {
      async redirect({ url, baseUrl }) {
        // Redirect to custom or default URL
        if (url.startsWith("http")) {
          return url;
        }
        return baseUrl;
      },
    },
    debug: true,
  });
}

export { auth as GET, auth as POST };
