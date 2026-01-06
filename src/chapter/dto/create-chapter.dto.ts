import { IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({
    example: 1,
    description: 'Chapter number',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  chapterNumber: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the book this chapter belongs to',
  })
  @IsUUID()
  bookId: string;
}
