import 'next-auth'
import { User as PrismaUser } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User extends Omit<PrismaUser, 'emailVerified' | 'hashedPassword'> {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
} 