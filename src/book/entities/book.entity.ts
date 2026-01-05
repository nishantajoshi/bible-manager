import { ApiProperty } from '@nestjs/swagger';

export class Book {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  abbreviation: string;

  @ApiProperty()
  bookNumber: number;

  @ApiProperty()
  testament: string;

  @ApiProperty()
  translationId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
