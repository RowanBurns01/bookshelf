import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
      },
    })

    // Create some books
    const book1 = await prisma.book.create({
      data: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        coverImage:
          'https://books.google.com/books/content?id=iXn5U2IzVH0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        description: 'A story of decadence and excess.',
        pageCount: 180,
        publishDate: new Date('1925-04-10'),
        googleBooksId: 'iXn5U2IzVH0C',
      },
    })

    const book2 = await prisma.book.create({
      data: {
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        coverImage:
          'https://books.google.com/books/content?id=kotPYEqx7kMC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        description: 'A dystopian social science fiction novel.',
        pageCount: 328,
        publishDate: new Date('1949-06-08'),
        googleBooksId: 'kotPYEqx7kMC',
      },
    })

    // Add books to user's collection
    await prisma.userBook.create({
      data: {
        userId: user.id,
        bookId: book1.id,
        status: 'completed',
        progress: 100,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-15'),
      },
    })

    await prisma.userBook.create({
      data: {
        userId: user.id,
        bookId: book2.id,
        status: 'reading',
        progress: 45,
        startDate: new Date('2024-02-01'),
      },
    })

    // Create a book list
    const list = await prisma.list.create({
      data: {
        name: 'My Favorite Books',
        description: 'A collection of my all-time favorites',
        userId: user.id,
        books: {
          create: [
            {
              bookId: book1.id,
              order: 1,
            },
            {
              bookId: book2.id,
              order: 2,
            },
          ],
        },
      },
    })

    console.log('Seed data created successfully!')
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
