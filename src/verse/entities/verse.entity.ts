import { ApiProperty } from '@nestjs/swagger';

export class Verse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  verseNumber: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  chapterId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
