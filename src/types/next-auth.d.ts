import 'next-auth'
import { User as PrismaUser } from '@prisma/client'
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    } & DefaultSession["user"]
  }

  interface User extends Omit<PrismaUser, 'emailVerified' | 'hashedPassword'> {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    hashedPassword?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
  }
}
