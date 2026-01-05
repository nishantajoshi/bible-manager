import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTranslationDto {
  @ApiProperty({
    example: 'King James Version',
    description: 'Full name of the Bible translation',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'KJV',
    description: 'Abbreviation of the translation',
    minLength: 2,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 10)
  abbreviation: string;

  @ApiProperty({
    example: 'English',
    description: 'Language of the translation',
  })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiPropertyOptional({
    example: 'A classic English translation published in 1611',
    description: 'Optional description of the translation',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
