import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { TwoFactorAuthenticationFilter } from './auth/exceptions/two-factor.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve static files from the public/images directory
  app.use('/images', express.static(join(__dirname, '..', 'public/images')));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:4000',
    methods: ['POST', 'GET', 'PATCH'],
    credentials: true,
  });
  // app.useGlobalFilters(new TwoFactorAuthenticationFilter());

  await app.listen(3000);
}
bootstrap();
