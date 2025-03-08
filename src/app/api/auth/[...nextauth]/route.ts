import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth from "next-auth"
import type { DefaultSession, AuthOptions, Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { AdapterUser } from "@auth/core/adapters"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

const prisma = new PrismaClient()

type DBUser = {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  hashedPassword: string | null
}

export const config: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        }) as DBUser | null

        if (!user) {
          throw new Error("No user found with this email")
        }

        if (!user.hashedPassword) {
          throw new Error("Please sign in with the method you used to create your account")
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page on error
  },
}

const handler = NextAuth(config)

export { handler as GET, handler as POST } 