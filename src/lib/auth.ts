import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

const prisma = new PrismaClient()

type DBUser = {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  hashedPassword: string | null
  createdAt: Date
  updatedAt: Date
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        }) as DBUser | null

        if (!user?.hashedPassword) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} 