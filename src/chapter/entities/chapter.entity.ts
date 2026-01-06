import { ApiProperty } from '@nestjs/swagger';

export class Chapter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  chapterNumber: number;

  @ApiProperty()
  bookId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
