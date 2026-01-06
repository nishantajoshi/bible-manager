import { ApiProperty } from '@nestjs/swagger';

export class Book {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  abbreviation: string;

  @ApiProperty()
  bookNumber: number;

  @ApiProperty()
  testament: string;

  @ApiProperty()
  translationId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
