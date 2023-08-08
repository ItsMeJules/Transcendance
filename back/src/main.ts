import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import NestExpressApplication
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { TwoFactorAuthenticationFilter } from './auth/exceptions/two-factor.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from the public/images directory
  // app.use('/images', express.static(join(__dirname, '..', 'public')));

  // Set the public directory to serve static files.
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
