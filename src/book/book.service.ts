import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    // Check if translation exists
    const translation = await this.prisma.bibleTranslation.findUnique({
      where: { id: createBookDto.translationId },
    });

    if (!translation) {
      throw new BadRequestException(
        `Translation with ID ${createBookDto.translationId} not found`,
      );
    }

    // Check if book with same bookNumber exists for this translation
    const existing = await this.prisma.book.findUnique({
      where: {
        translationId_bookNumber: {
          translationId: createBookDto.translationId,
          bookNumber: createBookDto.bookNumber,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Book number ${createBookDto.bookNumber} already exists for this translation`,
      );
    }

    return this.prisma.book.create({
      data: createBookDto,
      include: {
        translation: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 20, translationId?: string) {
    const skip = (page - 1) * limit;

    const where = translationId ? { translationId } : {};

    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { bookNumber: 'asc' },
        include: {
          translation: true,
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        translation: true,
        chapters: {
          orderBy: { chapterNumber: 'asc' },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    // Check if book exists
    await this.findOne(id);

    // If updating translationId, check it exists
    if (updateBookDto.translationId) {
      const translation = await this.prisma.bibleTranslation.findUnique({
        where: { id: updateBookDto.translationId },
      });

      if (!translation) {
        throw new BadRequestException(
          `Translation with ID ${updateBookDto.translationId} not found`,
        );
      }
    }

    // Check for bookNumber conflict if updating bookNumber or translationId
    if (updateBookDto.bookNumber || updateBookDto.translationId) {
      const book = await this.prisma.book.findUnique({ where: { id } });

      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      const checkTranslationId =
        updateBookDto.translationId || book.translationId;
      const checkBookNumber = updateBookDto.bookNumber || book.bookNumber;

      const existing = await this.prisma.book.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { translationId: checkTranslationId },
            { bookNumber: checkBookNumber },
          ],
        },
      });

      if (existing) {
        throw new ConflictException(
          `Book number ${checkBookNumber} already exists for this translation`,
        );
      }
    }

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: {
        translation: true,
      },
    });
  }

  async remove(id: string) {
    // Check if book exists
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}
