import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterVerseDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter verses by chapter ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  chapterId?: number;
}
