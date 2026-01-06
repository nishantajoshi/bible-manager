/*
  Warnings:

  - The primary key for the `bible_translations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `books` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `chapters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `verses` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Drop all existing tables and recreate with UUID
DROP TABLE IF EXISTS "verses";
DROP TABLE IF EXISTS "chapters";
DROP TABLE IF EXISTS "books";
DROP TABLE IF EXISTS "bible_translations";

-- CreateTable
CREATE TABLE "bible_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "bookNumber" INTEGER NOT NULL,
    "testament" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "books_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "bible_translations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "chapters_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "verseNumber" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "verses_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "bible_translations_name_key" ON "bible_translations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bible_translations_abbreviation_key" ON "bible_translations"("abbreviation");

-- CreateIndex
CREATE INDEX "bible_translations_name_idx" ON "bible_translations"("name");

-- CreateIndex
CREATE INDEX "bible_translations_abbreviation_idx" ON "bible_translations"("abbreviation");

-- CreateIndex
CREATE INDEX "books_translationId_idx" ON "books"("translationId");

-- CreateIndex
CREATE UNIQUE INDEX "books_translationId_bookNumber_key" ON "books"("translationId", "bookNumber");

-- CreateIndex
CREATE INDEX "chapters_bookId_idx" ON "chapters"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_bookId_chapterNumber_key" ON "chapters"("bookId", "chapterNumber");

-- CreateIndex
CREATE INDEX "verses_chapterId_idx" ON "verses"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "verses_chapterId_verseNumber_key" ON "verses"("chapterId", "verseNumber");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

