import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import * as argon from "argon2";
import { GoogleProfile } from "next-auth/providers/google";

import prisma from "../lib/prismadb";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile: GoogleProfile) {
        return {
          ...profile,
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "USER",
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        //finding if user exists
        const user =
          credentials?.email &&
          (await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          }));

        if (!user || !user?.password) {
          throw new Error("Invalid credentials");
        }

        //comparing password
        const isCorrectPassword = await argon.verify(
          user.password,
          credentials.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],

  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      //console.log("the user => ", user);
      if (user) {
        //console.log("the token => ", token);

        token.role = user?.role;
        //console.log("the token after => ", token);
        return token;
      }
      return token;
    },

    async session({ session, token }) {
      if (session) {
        //console.log("session token => ", token);

        session.user.role = token?.role;

        // console.log("the session => ", session);

        return session;
      }
      return session;
    },
  },
};
