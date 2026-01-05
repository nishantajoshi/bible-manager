import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TranslationModule } from './translation/translation.module';
import { BookModule } from './book/book.module';
import { ChapterModule } from './chapter/chapter.module';
import { VerseModule } from './verse/verse.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    TranslationModule,
    BookModule,
    ChapterModule,
    VerseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
