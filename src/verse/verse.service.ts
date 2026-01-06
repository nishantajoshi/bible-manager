import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVerseDto } from './dto/create-verse.dto';
import { UpdateVerseDto } from './dto/update-verse.dto';
import { BulkCreateVerseDto } from './dto/bulk-create-verse.dto';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';

@Injectable()
export class VerseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVerseDto: CreateVerseDto) {
    // Check if chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: createVerseDto.chapterId },
    });

    if (!chapter) {
      throw new BadRequestException(
        `Chapter with ID ${createVerseDto.chapterId} not found`,
      );
    }

    // Check if verse with same verseNumber exists for this chapter
    const existing = await this.prisma.verse.findUnique({
      where: {
        chapterId_verseNumber: {
          chapterId: createVerseDto.chapterId,
          verseNumber: createVerseDto.verseNumber,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Verse ${createVerseDto.verseNumber} already exists for this chapter`,
      );
    }

    return this.prisma.verse.create({
      data: createVerseDto,
      include: {
        chapter: {
          include: {
            book: {
              include: {
                translation: true,
              },
            },
          },
        },
      },
    });
  }

  async bulkCreate(bulkCreateVerseDto: BulkCreateVerseDto) {
    // Check if chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: bulkCreateVerseDto.chapterId },
    });

    if (!chapter) {
      throw new BadRequestException(
        `Chapter with ID ${bulkCreateVerseDto.chapterId} not found`,
      );
    }

    // Check for duplicate verse numbers in the request
    const verseNumbers = bulkCreateVerseDto.verses.map((v) => v.verseNumber);
    const uniqueVerseNumbers = new Set(verseNumbers);
    if (verseNumbers.length !== uniqueVerseNumbers.size) {
      throw new BadRequestException('Duplicate verse numbers in request');
    }

    // Check if any verses already exist
    const existingVerses = await this.prisma.verse.findMany({
      where: {
        chapterId: bulkCreateVerseDto.chapterId,
        verseNumber: {
          in: verseNumbers,
        },
      },
    });

    if (existingVerses.length > 0) {
      const existingNumbers = existingVerses
        .map((v) => v.verseNumber)
        .join(', ');
      throw new ConflictException(
        `Verses ${existingNumbers} already exist for this chapter`,
      );
    }

    // Use transaction to create all verses
    const verses = await this.prisma.$transaction(
      bulkCreateVerseDto.verses.map((verse) =>
        this.prisma.verse.create({
          data: {
            verseNumber: verse.verseNumber,
            text: verse.text,
            chapterId: bulkCreateVerseDto.chapterId,
          },
        }),
      ),
    );

    return {
      count: verses.length,
      verses,
    };
  }

  async findAll(page: number = 1, limit: number = 50, chapterId?: string) {
    const skip = (page - 1) * limit;

    const where = chapterId ? { chapterId } : {};

    const [data, total] = await Promise.all([
      this.prisma.verse.findMany({
        where,
        skip,
        take: limit,
        orderBy: { verseNumber: 'asc' },
        include: {
          chapter: {
            include: {
              book: {
                include: {
                  translation: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.verse.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const verse = await this.prisma.verse.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            book: {
              include: {
                translation: true,
              },
            },
          },
        },
      },
    });

    if (!verse) {
      throw new NotFoundException(`Verse with ID ${id} not found`);
    }

    return verse;
  }

  async update(id: string, updateVerseDto: UpdateVerseDto) {
    // Check if verse exists
    await this.findOne(id);

    // If updating chapterId, check it exists
    if (updateVerseDto.chapterId) {
      const chapter = await this.prisma.chapter.findUnique({
        where: { id: updateVerseDto.chapterId },
      });

      if (!chapter) {
        throw new BadRequestException(
          `Chapter with ID ${updateVerseDto.chapterId} not found`,
        );
      }
    }

    // Check for verseNumber conflict if updating verseNumber or chapterId
    if (updateVerseDto.verseNumber || updateVerseDto.chapterId) {
      const verse = await this.prisma.verse.findUnique({ where: { id } });

      if (!verse) {
        throw new NotFoundException(`Verse with ID ${id} not found`);
      }

      const checkChapterId = updateVerseDto.chapterId || verse.chapterId;
      const checkVerseNumber = updateVerseDto.verseNumber || verse.verseNumber;

      const existing = await this.prisma.verse.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { chapterId: checkChapterId },
            { verseNumber: checkVerseNumber },
          ],
        },
      });

      if (existing) {
        throw new ConflictException(
          `Verse ${checkVerseNumber} already exists for this chapter`,
        );
      }
    }

    return this.prisma.verse.update({
      where: { id },
      data: updateVerseDto,
      include: {
        chapter: {
          include: {
            book: {
              include: {
                translation: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if verse exists
    await this.findOne(id);

    return this.prisma.verse.delete({
      where: { id },
    });
  }
}
