import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import 'dotenv/config';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  // Create KJV translation (idempotent)
  const kjvTranslation = await prisma.bibleTranslation.upsert({
    where: { abbreviation: 'KJV' },
    update: {},
    create: {
      name: 'King James Version',
      abbreviation: 'KJV',
      language: 'English',
      description:
        'The King James Version, published in 1611, is one of the most widely used English translations of the Bible.',
    },
  });

  console.log(`Created/found translation: ${kjvTranslation.name}`);

  // Create Genesis book
  const genesis = await prisma.book.upsert({
    where: {
      translationId_bookNumber: {
        translationId: kjvTranslation.id,
        bookNumber: 1,
      },
    },
    update: {},
    create: {
      name: 'Genesis',
      abbreviation: 'Gen',
      bookNumber: 1,
      testament: 'OT',
      translationId: kjvTranslation.id,
    },
  });

  console.log(`Created/found book: ${genesis.name}`);

  // Create Genesis Chapter 1
  const genesisChapter1 = await prisma.chapter.upsert({
    where: {
      bookId_chapterNumber: {
        bookId: genesis.id,
        chapterNumber: 1,
      },
    },
    update: {},
    create: {
      chapterNumber: 1,
      bookId: genesis.id,
    },
  });

  console.log(
    `Created/found chapter: Genesis ${genesisChapter1.chapterNumber}`,
  );

  // Create first 10 verses of Genesis 1
  const verses = [
    {
      verseNumber: 1,
      text: 'In the beginning God created the heaven and the earth.',
    },
    {
      verseNumber: 2,
      text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
    },
    {
      verseNumber: 3,
      text: 'And God said, Let there be light: and there was light.',
    },
    {
      verseNumber: 4,
      text: 'And God saw the light, that it was good: and God divided the light from the darkness.',
    },
    {
      verseNumber: 5,
      text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.',
    },
    {
      verseNumber: 6,
      text: 'And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.',
    },
    {
      verseNumber: 7,
      text: 'And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.',
    },
    {
      verseNumber: 8,
      text: 'And God called the firmament Heaven. And the evening and the morning were the second day.',
    },
    {
      verseNumber: 9,
      text: 'And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.',
    },
    {
      verseNumber: 10,
      text: 'And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.',
    },
  ];

  for (const verse of verses) {
    await prisma.verse.upsert({
      where: {
        chapterId_verseNumber: {
          chapterId: genesisChapter1.id,
          verseNumber: verse.verseNumber,
        },
      },
      update: {},
      create: {
        verseNumber: verse.verseNumber,
        text: verse.text,
        chapterId: genesisChapter1.id,
      },
    });
  }

  console.log(`Created/updated ${verses.length} verses in Genesis 1`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
