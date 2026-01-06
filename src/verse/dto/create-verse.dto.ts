import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
} from 'class-validator';
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
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the chapter this verse belongs to',
  })
  @IsUUID()
  chapterId: string;
}
