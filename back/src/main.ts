import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,
//     transform: true
//   }));

  app.enableCors({
    origin: 'http://localhost:4000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin,Accept,Content-Type,Authorization',
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();