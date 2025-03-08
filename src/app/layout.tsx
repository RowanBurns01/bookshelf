import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookshelf - Your Reading Journey",
  description: "Track, review, and share your reading journey with friends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen bg-white dark:bg-gray-900">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
