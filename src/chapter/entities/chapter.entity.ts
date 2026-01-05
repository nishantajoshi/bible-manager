import { ApiProperty } from '@nestjs/swagger';

export class Chapter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  chapterNumber: number;

  @ApiProperty()
  bookId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
