/*
  Warnings:

  - Made the column `trendingScore` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "trendingScore" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "Book"("title");

-- CreateIndex
CREATE INDEX "Book_author_idx" ON "Book"("author");

-- CreateIndex
CREATE INDEX "Book_trendingScore_idx" ON "Book"("trendingScore");
