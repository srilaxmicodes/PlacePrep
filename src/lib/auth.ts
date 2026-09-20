import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        await dbConnect();

        // Normalize email to lowercase
        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password.");
        }

        // Compare plain text password with stored bcrypt hash
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || "",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Automatically create User document in MongoDB on first Google OAuth login
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await dbConnect();
        const existingUser = await User.findOne({
          email: user.email.toLowerCase(),
        });

        if (!existingUser) {
          await User.create({
            name: user.name || "Google User",
            email: user.email.toLowerCase(),
            image: user.image || "",
            provider: "google",
          });
        }
      }
      return true;
    },
    // Attach the MongoDB user id to the JWT token
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" && user.email) {
          // Google's own id is not a valid MongoDB ObjectId, so look up our user
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email.toLowerCase() });
          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        } else {
          token.id = user.id;
        }
      }
      return token;
    },
    // Expose user ID in session object accessible on server & client
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};