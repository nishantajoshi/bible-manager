import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;
  const apiVersion = configService.get<string>('apiVersion') ?? 'v1';

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global API prefix with versioning
  app.setGlobalPrefix(`api/${apiVersion}`);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Bible Manager API')
    .setDescription(
      'A production-grade REST API for managing Bible translations, books, chapters, and verses',
    )
    .setVersion('1.0')
    .addTag('translations', 'Bible translation management')
    .addTag('books', 'Bible book management')
    .addTag('chapters', 'Chapter management')
    .addTag('verses', 'Verse management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  logger.log(`🔗 API base URL: http://localhost:${port}/api/${apiVersion}`);
}

bootstrap();
