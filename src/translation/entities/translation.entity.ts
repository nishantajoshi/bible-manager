import { ApiProperty } from '@nestjs/swagger';

export class Translation {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  abbreviation: string;

  @ApiProperty()
  language: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
