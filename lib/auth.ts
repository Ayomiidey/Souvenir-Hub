/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

declare module "next-auth" {
  interface User {
    roles?: string[];
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: string[];
    };
  }

  interface JWT {
    id?: string;
    roles?: string[];
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: Number(process.env.NEXTAUTH_SESSION_DURATION),
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles.map(
            (userRole: { role: { name: string } }) => userRole.role.name
          ),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
      } else if (token.id != null) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          });
          if (dbUser) {
            token.roles = dbUser.roles.map(
              (userRole: { role: { name: string } }) => userRole.role.name
            );
          }
        } catch (error) {
          console.error("Error refreshing user roles:", error);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.roles = token.roles;
      }
      return session;
    },
    async signIn({ user, account }: any) {
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // Checking if user already has a Google account linked
            const existingGoogleAccount = await prisma.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: "google",
              },
            });

            if (!existingGoogleAccount) {
              // Linking the Google account to the existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  provider: "google",
                  providerAccountId: account.providerAccountId,
                  type: "oauth",
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              });
            }
            return true;
          } else {
            const userRole = await prisma.role.upsert({
              where: { name: "USER" },
              update: {},
              create: { name: "USER" },
            });

            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "Google User",
              },
            });

            await prisma.account.create({
              data: {
                userId: newUser.id,
                provider: "google",
                providerAccountId: account.providerAccountId,
                type: "oauth",
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });

            await prisma.userRole.create({
              data: {
                userId: newUser.id,
                roleId: userRole.id,
              },
            });
          }
        } catch (error) {
          console.error("Error handling sign-in:", error);
          return false;
        }
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
