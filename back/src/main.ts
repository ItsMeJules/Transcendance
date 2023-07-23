import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Serve static files from the public/images directory
  app.use('/images', express.static(join(__dirname, '..', 'public/images')));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET', 'PATCH'],
    credentials: true,
  });
  await app.listen(3333);
}
bootstrap();