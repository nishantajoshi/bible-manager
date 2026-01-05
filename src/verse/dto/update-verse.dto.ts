import { PartialType } from '@nestjs/swagger';
import { CreateVerseDto } from './create-verse.dto';

export class UpdateVerseDto extends PartialType(CreateVerseDto) {}
