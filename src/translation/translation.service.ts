import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';

@Injectable()
export class TranslationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTranslationDto: CreateTranslationDto) {
    // Check if translation with same name or abbreviation exists
    const existing = await this.prisma.bibleTranslation.findFirst({
      where: {
        OR: [
          { name: createTranslationDto.name },
          { abbreviation: createTranslationDto.abbreviation },
        ],
      },
    });

    if (existing) {
      throw new ConflictException(
        'Translation with this name or abbreviation already exists',
      );
    }

    return this.prisma.bibleTranslation.create({
      data: createTranslationDto,
    });
  }

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.bibleTranslation.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.bibleTranslation.count(),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number) {
    const translation = await this.prisma.bibleTranslation.findUnique({
      where: { id },
      include: {
        books: {
          orderBy: { bookNumber: 'asc' },
        },
      },
    });

    if (!translation) {
      throw new NotFoundException(`Translation with ID ${id} not found`);
    }

    return translation;
  }

  async update(id: number, updateTranslationDto: UpdateTranslationDto) {
    // Check if translation exists
    await this.findOne(id);

    // Check for conflicts with other translations
    if (updateTranslationDto.name || updateTranslationDto.abbreviation) {
      const existing = await this.prisma.bibleTranslation.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                { name: updateTranslationDto.name },
                { abbreviation: updateTranslationDto.abbreviation },
              ],
            },
          ],
        },
      });

      if (existing) {
        throw new ConflictException(
          'Another translation with this name or abbreviation already exists',
        );
      }
    }

    return this.prisma.bibleTranslation.update({
      where: { id },
      data: updateTranslationDto,
    });
  }

  async remove(id: number) {
    // Check if translation exists
    await this.findOne(id);

    return this.prisma.bibleTranslation.delete({
      where: { id },
    });
  }
}
