import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterChapterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter chapters by book ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  bookId?: number;
}
