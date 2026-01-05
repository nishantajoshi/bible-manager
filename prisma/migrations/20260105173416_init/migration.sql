-- CreateTable
CREATE TABLE "bible_translations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "books" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "bookNumber" INTEGER NOT NULL,
    "testament" TEXT NOT NULL,
    "translationId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "books_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "bible_translations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "chapters_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "verseNumber" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,
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
