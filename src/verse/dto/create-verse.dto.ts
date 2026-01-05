import { IsInt, Min, IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVerseDto {
  @ApiProperty({
    example: 1,
    description: 'Verse number',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  verseNumber: number;

  @ApiProperty({
    example: 'In the beginning God created the heaven and the earth.',
    description: 'Text of the verse',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the chapter this verse belongs to',
  })
  @IsInt()
  chapterId: number;
}
