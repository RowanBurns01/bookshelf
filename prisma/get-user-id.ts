import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: 'test@example.com'
      }
    })
    console.log('User ID:', user?.id)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error) 