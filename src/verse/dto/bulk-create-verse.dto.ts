import { IsInt, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, Min } from 'class-validator';

class VerseDataDto {
  @ApiProperty({
    example: 1,
    description: 'Verse number',
  })
  @IsInt()
  @Min(1)
  verseNumber: number;

  @ApiProperty({
    example: 'In the beginning God created the heaven and the earth.',
    description: 'Text of the verse',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text: string;
}

export class BulkCreateVerseDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the chapter for all verses',
  })
  @IsInt()
  chapterId: number;

  @ApiProperty({
    type: [VerseDataDto],
    description: 'Array of verses to create',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => VerseDataDto)
  verses: VerseDataDto[];
}
