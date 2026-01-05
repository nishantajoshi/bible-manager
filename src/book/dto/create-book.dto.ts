import { IsString, IsNotEmpty, IsInt, Min, Max, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    example: 'Genesis',
    description: 'Name of the book',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Gen',
    description: 'Abbreviation of the book',
  })
  @IsString()
  @IsNotEmpty()
  abbreviation: string;

  @ApiProperty({
    example: 1,
    description: 'Book number (1-66)',
    minimum: 1,
    maximum: 66,
  })
  @IsInt()
  @Min(1)
  @Max(66)
  bookNumber: number;

  @ApiProperty({
    example: 'OT',
    description: 'Testament (OT or NT)',
    enum: ['OT', 'NT'],
  })
  @IsString()
  @IsIn(['OT', 'NT'])
  testament: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the Bible translation',
  })
  @IsInt()
  translationId: number;
}
