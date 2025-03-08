# Bookshelf

A modern web application for managing your reading list, tracking books you've read, and discovering new books to read.

## Features

- User authentication with email/password
- Personal reading lists
- Book tracking (read, currently reading, want to read)
- Book discovery
- Profile page with reading statistics
- Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js v5
- Tailwind CSS
- Framer Motion
- Deployed on Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bookshelf.git
cd bookshelf
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

4. Seed the database (optional):

```bash
npm run prisma:seed
```

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

## Project Structure

```
bookshelf/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/         # Reusable components
│   ├── lib/               # Utility functions and API helpers
│   └── types/             # TypeScript type definitions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding script
└── public/               # Static assets
```

## Deployment

This project is configured for deployment on Vercel. The following environment variables need to be set in your Vercel project:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
