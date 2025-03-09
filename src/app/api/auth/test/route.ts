import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const hashedPassword = await hash('testpass123', 10)
    const user = await prisma.user.upsert({
      where: {
        email: 'test@example.com',
      },
      update: {
        hashedPassword,
      },
      create: {
        email: 'test@example.com',
        name: 'Test User',
        hashedPassword,
      },
    })

    return NextResponse.json({
      message: 'Test user created successfully',
      userId: user.id,
    })
  } catch (error) {
    console.error('Error creating test user:', error)
    return NextResponse.json(
      { error: 'Failed to create test user' },
      { status: 500 }
    )
  }
} 