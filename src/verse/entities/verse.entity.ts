import { ApiProperty } from '@nestjs/swagger';

export class Verse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  verseNumber: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  chapterId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
