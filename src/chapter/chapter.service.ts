import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';

@Injectable()
export class ChapterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChapterDto: CreateChapterDto) {
    // Check if book exists
    const book = await this.prisma.book.findUnique({
      where: { id: createChapterDto.bookId },
    });

    if (!book) {
      throw new BadRequestException(
        `Book with ID ${createChapterDto.bookId} not found`,
      );
    }

    // Check if chapter with same chapterNumber exists for this book
    const existing = await this.prisma.chapter.findUnique({
      where: {
        bookId_chapterNumber: {
          bookId: createChapterDto.bookId,
          chapterNumber: createChapterDto.chapterNumber,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Chapter ${createChapterDto.chapterNumber} already exists for this book`,
      );
    }

    return this.prisma.chapter.create({
      data: createChapterDto,
      include: {
        book: {
          include: {
            translation: true,
          },
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 50, bookId?: number) {
    const skip = (page - 1) * limit;

    const where = bookId ? { bookId } : {};

    const [data, total] = await Promise.all([
      this.prisma.chapter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { chapterNumber: 'asc' },
        include: {
          book: {
            include: {
              translation: true,
            },
          },
        },
      }),
      this.prisma.chapter.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
      include: {
        book: {
          include: {
            translation: true,
          },
        },
        verses: {
          orderBy: { verseNumber: 'asc' },
        },
      },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }

    return chapter;
  }

  async update(id: number, updateChapterDto: UpdateChapterDto) {
    // Check if chapter exists
    await this.findOne(id);

    // If updating bookId, check it exists
    if (updateChapterDto.bookId) {
      const book = await this.prisma.book.findUnique({
        where: { id: updateChapterDto.bookId },
      });

      if (!book) {
        throw new BadRequestException(
          `Book with ID ${updateChapterDto.bookId} not found`,
        );
      }
    }

    // Check for chapterNumber conflict if updating chapterNumber or bookId
    if (updateChapterDto.chapterNumber || updateChapterDto.bookId) {
      const chapter = await this.prisma.chapter.findUnique({ where: { id } });

      if (!chapter) {
        throw new NotFoundException(`Chapter with ID ${id} not found`);
      }

      const checkBookId = updateChapterDto.bookId || chapter.bookId;
      const checkChapterNumber =
        updateChapterDto.chapterNumber || chapter.chapterNumber;

      const existing = await this.prisma.chapter.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { bookId: checkBookId },
            { chapterNumber: checkChapterNumber },
          ],
        },
      });

      if (existing) {
        throw new ConflictException(
          `Chapter ${checkChapterNumber} already exists for this book`,
        );
      }
    }

    return this.prisma.chapter.update({
      where: { id },
      data: updateChapterDto,
      include: {
        book: {
          include: {
            translation: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    // Check if chapter exists
    await this.findOne(id);

    return this.prisma.chapter.delete({
      where: { id },
    });
  }
}
