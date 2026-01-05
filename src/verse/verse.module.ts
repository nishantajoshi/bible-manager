import { Module } from '@nestjs/common';
import { VerseService } from './verse.service';
import { VerseController } from './verse.controller';

@Module({
  controllers: [VerseController],
  providers: [VerseService],
  exports: [VerseService],
})
export class VerseModule {}
