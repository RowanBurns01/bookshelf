import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { User as PrismaUser } from '@prisma/client'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        }) as PrismaUser

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials')
        }

        const isValid = await compare(credentials.password, user.hashedPassword)

        if (!isValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // After login, always redirect to /discover
      if (url.includes('/login')) {
        return `${baseUrl}/discover`
      }
      // For all other cases, use default behavior
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
})

export { handler as GET, handler as POST } 