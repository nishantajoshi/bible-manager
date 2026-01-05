import { IsInt, Min } from 'class-validator';
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
    example: 1,
    description: 'ID of the book this chapter belongs to',
  })
  @IsInt()
  bookId: number;
}
